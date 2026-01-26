/**
 * MyLandManager - Core Geospatial Data Processing Logic
 * 
 * This file demonstrates the architectural patterns used in MyLandManager:
 * - Chunk-based pagination for large-scale geospatial data
 * - VWorld OpenAPI integration with error handling
 * - LocalStorage caching strategy
 * - File API for unlimited project storage
 * 
 * These patterns enable zero-cost infrastructure while processing 100MB+ datasets.
 */

// ============================================================================
// VWORLD OPENAPI INTEGRATION WITH CHUNK LOADING
// ============================================================================

/**
 * Fetches cadastral data for a region using VWorld OpenAPI with pagination.
 * 
 * Architecture Pattern: Chunk-based loading prevents memory exhaustion
 * when processing large datasets (100MB+). Processes up to 20,000 parcels
 * per region in 1,000-feature chunks.
 * 
 * @param {string} bjdCode - 법정동 코드 (e.g., "44790310" for 운곡면)
 * @returns {Promise<GeoJSON.FeatureCollection|null>} GeoJSON feature collection or null on error
 * 
 * Example:
 *   const data = await fetchAreaCadastral("44790310");
 *   if (data) {
 *     console.log(`Loaded ${data.features.length} parcels`);
 *   }
 */
async function fetchAreaCadastral(bjdCode) {
    const statusElement = document.getElementById('area-status-msg');
    if (statusElement) {
        statusElement.innerText = "🌐 지적도 불러오는 중...";
    }
    
    let allFeatures = [];
    const size = 1000; // Features per page (VWorld API limit)
    const maxPages = 20; // Maximum 20,000 parcels per region
    
    // [OPTIMIZATION] Check for pre-loaded local data first
    if (bjdCode === "44790310" && typeof UNGOK_DATA !== 'undefined' && UNGOK_DATA.features) {
        console.log("🚀 Using pre-loaded local data (UNGOK_DATA)");
        if (statusElement) {
            statusElement.innerText = "✅ 로컬 데이터 로드 완료";
        }
        return UNGOK_DATA;
    }
    
    try {
        // Pagination loop: Load data in chunks
        for (let page = 1; page <= maxPages; page++) {
            if (statusElement) {
                statusElement.innerText = `📡 ${page}페이지 데이터 수신 중...`;
            }
            
            // VWorld Data API v2 endpoint
            // Note: Wildcards (*, %) not supported - use prefix matching only
            const layerName = "LP_PA_CBND_BUBUN"; // Cadastral boundary layer
            const url = `https://api.vworld.kr/req/data?service=data&request=GetFeature&data=${layerName}&key=${VWORLD_KEY}&domain=${VWORLD_DOMAIN}&attrFilter=pnu:like:${bjdCode}&geometry=true&format=json&size=${size}&page=${page}`;
            
            console.log(`📡 [${layerName}, Page ${page}] Requesting...`);
            
            // JSONP request (handles CORS)
            const res = await jsonpOnce(url);
            
            if (res.response && res.response.status === "OK" && res.response.result.featureCollection.features) {
                const features = res.response.result.featureCollection.features;
                allFeatures = allFeatures.concat(features);
                
                // If this page has fewer features than size, it's the last page
                if (features.length < size) {
                    console.log(`✅ Last page reached (${features.length} features)`);
                    break;
                }
            } else {
                // Error handling
                const status = res.response?.status;
                const errText = res.response?.error?.text || "Unknown error";
                console.warn(`API Error on page ${page}: ${status} - ${errText}`);
                
                if (status === "NOT FOUND") {
                    // No data available - normal termination
                    break;
                } else if (status === "ERROR") {
                    // Explicit error - show user-friendly message
                    if (statusElement) {
                        statusElement.innerHTML = `
                            <span style='color:red;'>⛔ API 오류: ${errText}</span><br>
                            <span style="font-size:11px; color:#64748b;">
                            요청 도메인: <b>${VWORLD_DOMAIN}</b><br>
                            사용 키: <b>${VWORLD_KEY.slice(0, 8)}...</b><br>
                            (VWorld 설정과 이 도메인이 100% 일치해야 합니다)
                            </span>
                        `;
                    }
                    return null;
                }
                break;
            }
            
            // Rate limiting: Small delay between requests
            await new Promise(r => setTimeout(r, 100));
        }
        
        if (allFeatures.length === 0) {
            // No data found
            if (statusElement) {
                statusElement.innerHTML = `❌ 해당 지역의 지적도 데이터가 없습니다 (0건).`;
            }
            return null;
        }
        
        if (statusElement) {
            statusElement.innerText = `✅ 로드 완료 (${allFeatures.length}필지)`;
        }
        
        return {
            type: "FeatureCollection",
            features: allFeatures
        };
        
    } catch (e) {
        console.error("Fetch error:", e);
        if (statusElement) {
            statusElement.innerHTML = `
                <span style='color:red;'>❌ 로드 실패: API 인증 또는 네트워크 오류.</span>
            `;
        }
        return null;
    }
}


// ============================================================================
// JSONP HELPER FOR CORS HANDLING
// ============================================================================

/**
 * JSONP wrapper for VWorld API requests (handles CORS).
 * 
 * Architecture Pattern: JSONP enables cross-origin requests without
 * backend proxy, maintaining serverless architecture.
 * 
 * @param {string} url - API endpoint URL
 * @param {number} timeout - Request timeout in milliseconds (default: 10000)
 * @returns {Promise<Object>} API response object
 */
function jsonpOnce(url, timeout = 10000) {
    return new Promise((resolve, reject) => {
        const callbackName = 'jsonp_callback_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
        const script = document.createElement('script');
        let timeoutId;
        
        // Set up timeout
        timeoutId = setTimeout(() => {
            cleanup();
            reject(new Error("JSONP timeout"));
        }, timeout);
        
        // Cleanup function
        function cleanup() {
            if (script.parentNode) {
                script.parentNode.removeChild(script);
            }
            delete window[callbackName];
            if (timeoutId) {
                clearTimeout(timeoutId);
            }
        }
        
        // Callback function
        window[callbackName] = (data) => {
            cleanup();
            resolve(data);
        };
        
        // Handle errors
        script.onerror = () => {
            cleanup();
            reject(new Error("JSONP script error"));
        };
        
        // Build URL with callback parameter
        const separator = url.includes('?') ? '&' : '?';
        script.src = url + separator + 'callback=' + callbackName;
        
        // Append to document
        document.head.appendChild(script);
    });
}


// ============================================================================
// LOCALSTORAGE STATE MANAGEMENT
// ============================================================================

const PROJECT_STORAGE_KEY = 'myland_project_state_v6';

/**
 * Saves project state to LocalStorage.
 * 
 * Architecture Pattern: Automatic persistence prevents work loss
 * while maintaining fast access (5-10MB limit).
 * 
 * @param {string} projectName - Current project name
 * @param {Object} landsDB - Land parcels database
 */
function saveStateToLocalStorage(projectName, landsDB) {
    const state = {
        projectName: projectName,
        lands: landsDB,
        updatedAt: new Date().toISOString()
    };
    
    try {
        localStorage.setItem(PROJECT_STORAGE_KEY, JSON.stringify(state));
        console.log("✅ State saved to LocalStorage");
    } catch (e) {
        // Handle quota exceeded error
        if (e.name === 'QuotaExceededError') {
            console.warn("⚠️ LocalStorage quota exceeded. Consider exporting to file.");
            alert("저장 공간이 부족합니다. 파일로 내보내기를 사용하세요.");
        } else {
            console.error("LocalStorage save error:", e);
        }
    }
}

/**
 * Loads project state from LocalStorage.
 * 
 * @returns {Object|null} Project state object or null if not found
 */
function loadStateFromLocalStorage() {
    try {
        const saved = localStorage.getItem(PROJECT_STORAGE_KEY);
        if (saved) {
            const data = JSON.parse(saved);
            if (data.lands) {
                console.log("✅ State loaded from LocalStorage");
                return data;
            }
        }
    } catch (e) {
        console.error("LocalStorage load error:", e);
    }
    return null;
}


// ============================================================================
// FILE API FOR UNLIMITED STORAGE
// ============================================================================

/**
 * Saves project to JSON file using File System Access API.
 * 
 * Architecture Pattern: File API bypasses LocalStorage 5-10MB limit,
 * enabling unlimited project size while maintaining serverless architecture.
 * 
 * @param {Object} projectData - Project data object
 * @param {string} filename - Suggested filename
 * @returns {Promise<boolean>} Success status
 */
async function saveProjectToFile(projectData, filename = 'myland-project.json') {
    try {
        // Check for File System Access API support
        if ('showSaveFilePicker' in window) {
            const blob = new Blob([JSON.stringify(projectData, null, 2)], {
                type: 'application/json'
            });
            
            const handle = await window.showSaveFilePicker({
                suggestedName: filename,
                types: [{
                    description: 'JSON files',
                    accept: { 'application/json': ['.json'] }
                }]
            });
            
            const writable = await handle.createWritable();
            await writable.write(blob);
            await writable.close();
            
            console.log("✅ Project saved to file");
            return true;
        } else {
            // Fallback: Download link
            const blob = new Blob([JSON.stringify(projectData, null, 2)], {
                type: 'application/json'
            });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = filename;
            a.click();
            URL.revokeObjectURL(url);
            return true;
        }
    } catch (e) {
        if (e.name !== 'AbortError') {
            console.error("File save error:", e);
        }
        return false;
    }
}

/**
 * Loads project from JSON file.
 * 
 * @returns {Promise<Object|null>} Project data object or null on error
 */
async function loadProjectFromFile() {
    try {
        if ('showOpenFilePicker' in window) {
            const [handle] = await window.showOpenFilePicker({
                types: [{
                    description: 'JSON files',
                    accept: { 'application/json': ['.json'] }
                }]
            });
            
            const file = await handle.getFile();
            const text = await file.text();
            const data = JSON.parse(text);
            
            console.log("✅ Project loaded from file");
            return data;
        } else {
            // Fallback: File input
            return new Promise((resolve) => {
                const input = document.createElement('input');
                input.type = 'file';
                input.accept = '.json';
                input.onchange = (e) => {
                    const file = e.target.files[0];
                    if (file) {
                        const reader = new FileReader();
                        reader.onload = (event) => {
                            try {
                                const data = JSON.parse(event.target.result);
                                resolve(data);
                            } catch (err) {
                                console.error("JSON parse error:", err);
                                resolve(null);
                            }
                        };
                        reader.readAsText(file);
                    } else {
                        resolve(null);
                    }
                };
                input.click();
            });
        }
    } catch (e) {
        if (e.name !== 'AbortError') {
            console.error("File load error:", e);
        }
        return null;
    }
}


// ============================================================================
// GEOSPATIAL CALCULATION HELPERS
// ============================================================================

/**
 * Calculates distance between two coordinates (Haversine formula).
 * 
 * @param {number} lat1 - Latitude of first point
 * @param {number} lon1 - Longitude of first point
 * @param {number} lat2 - Latitude of second point
 * @param {number} lon2 - Longitude of second point
 * @returns {number} Distance in meters
 */
function calculateDistance(lat1, lon1, lat2, lon2) {
    const R = 6371000; // Earth radius in meters
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
              Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
              Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
}

/**
 * Calculates perimeter of a GeoJSON polygon.
 * 
 * Architecture Pattern: Client-side calculation eliminates server dependency,
 * enabling serverless architecture while maintaining accuracy.
 * 
 * @param {GeoJSON.Polygon} polygon - GeoJSON polygon feature
 * @returns {number} Perimeter in meters
 */
function calculatePerimeter(polygon) {
    if (!polygon || !polygon.coordinates || polygon.coordinates.length === 0) {
        return 0;
    }
    
    let totalPerimeter = 0;
    const coordinates = polygon.coordinates[0]; // Outer ring
    
    for (let i = 0; i < coordinates.length - 1; i++) {
        const [lon1, lat1] = coordinates[i];
        const [lon2, lat2] = coordinates[i + 1];
        totalPerimeter += calculateDistance(lat1, lon1, lat2, lon2);
    }
    
    return totalPerimeter;
}

/**
 * Calculates area of a GeoJSON polygon (Shoelace formula).
 * 
 * @param {GeoJSON.Polygon} polygon - GeoJSON polygon feature
 * @returns {number} Area in square meters
 */
function calculateArea(polygon) {
    if (!polygon || !polygon.coordinates || polygon.coordinates.length === 0) {
        return 0;
    }
    
    const coordinates = polygon.coordinates[0]; // Outer ring
    let area = 0;
    
    for (let i = 0; i < coordinates.length - 1; i++) {
        const [lon1, lat1] = coordinates[i];
        const [lon2, lat2] = coordinates[i + 1];
        area += lon1 * lat2 - lon2 * lat1;
    }
    
    // Convert to square meters (approximate, assumes small area)
    const R = 6371000; // Earth radius in meters
    const lat = coordinates[0][1] * Math.PI / 180;
    const areaInRadians = Math.abs(area) / 2;
    const areaInSquareMeters = areaInRadians * R * R * Math.cos(lat);
    
    return areaInSquareMeters;
}


// ============================================================================
// USAGE EXAMPLES
// ============================================================================

if (typeof window !== 'undefined') {
    // Example: Load cadastral data for a region
    window.exampleLoadRegion = async function(bjdCode) {
        console.log(`Loading cadastral data for region: ${bjdCode}`);
        const data = await fetchAreaCadastral(bjdCode);
        if (data) {
            console.log(`✅ Loaded ${data.features.length} parcels`);
            return data;
        } else {
            console.error("❌ Failed to load data");
            return null;
        }
    };
    
    // Example: Save project state
    window.exampleSaveProject = function(projectName, landsDB) {
        saveStateToLocalStorage(projectName, landsDB);
        console.log("Project state saved");
    };
    
    // Example: Calculate parcel metrics
    window.exampleCalculateMetrics = function(polygon) {
        const perimeter = calculatePerimeter(polygon);
        const area = calculateArea(polygon);
        console.log(`Perimeter: ${perimeter.toFixed(2)}m`);
        console.log(`Area: ${area.toFixed(2)}m²`);
        return { perimeter, area };
    };
}

// Export for Node.js environments (testing)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        fetchAreaCadastral,
        jsonpOnce,
        saveStateToLocalStorage,
        loadStateFromLocalStorage,
        saveProjectToFile,
        loadProjectFromFile,
        calculateDistance,
        calculatePerimeter,
        calculateArea
    };
}
