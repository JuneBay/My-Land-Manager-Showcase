# MyLandManager - Technical Details

**Project:** MyLandManager (Land Parcel Management System)
**Role:** Geospatial Solutions Developer
**Period:** Jan 2024 - Present
**Repository:** https://github.com/JuneBay/My-Land-Manager.git
**Status:** Live on Vercel

---

## 📋 Project Overview

Designed and built a **Land Parcel Management System** to manage multiple land parcels in a single integrated view. The workflow focuses on pre-validating potential disputes where official land boundaries might differ from actual usage or registration data.

**Core Value:**
- Automated pre-screening by combining public cadastral data with surrounding structure info
- Proactive risk mitigation before on-site surveys
- Reduced repetitive site visits and document checks, cutting processing costs and rework risks
- Standardized verification workflow across different regions using public API integration

---

## 🎯 Key Achievements & Metrics

### 1. Quality & Risk Management
- **Dispute Risk Management (Patent Pending):** Pre-validation of boundary disputes via virtual surveying
- **Government Portal Integration:** Seamless integration with Toji-eum and Supreme Court Registry
- **One-Stop Workflow:** From analysis to document issuance in a single flow
- **Data Integration:** Unified view of cadastral maps, land valuation, and structure data
- **Auto-Calculation:** Automatic distance and perimeter calculation to identify risk zones

### 2. Cost Reduction
- **$0 Infrastructure Cost:** Serverless architecture (Vercel Free Tier + VWorld OpenAPI)
- **Reduced Site Visits:** Eliminated unnecessary trips through automated pre-calculation
- ** Minimized Rework:** Reduced repetitive visits and document re-verification

### 3. Time Efficiency
- **Before:** Manual map search + data entry (20-35 mins/task)
- **After:** Load saved project state (1-2 mins/task)
- **Improvement:** >80% reduction in processing time

### 4. Scalability
- **Public API Integration:** Standardized workflow applicable nationwide via VWorld OpenAPI
- **Versatile Use Cases:** Supports farmland, residential, and commercial zoning

### 5. Performance Optimization
- **Large Data Handling:** Dynamic chunk loading for 100MB+ geospatial datasets
- **Memory Efficiency:** Optimized memory usage via on-demand loading

---

## 🏗️ System Architecture

### High-Level Structure

```
[Client Side (Browser)]
   ↓
[Leaflet.js Map Interface]
   ↓
[VWorld OpenAPI]
   ├─ Cadastral Map Layer
   ├─ Land Valuation Data
   └─ Address Search
   ↓
[LocalStorage Data Store]
   ├─ Project Data
   ├─ Parcel Info
   └─ Group Info
   ↓
[File API (JSON Export/Import)]
```

### Key Technical Implementations

#### 1. Serverless Architecture
- **Hosting:** Vercel Free Tier
- **Backend:** None (Pure Client-Side App)
- **Storage:** LocalStorage + File API (JSON)
- **Maps:** VWorld OpenAPI (Government Public API)

#### 2. Public API Integration
- **VWorld OpenAPI:**
  - Continuous cadastral map layers
  - Real-time land valuation
  - Address search capability

#### 3. Large Data Optimization
- **Chunk Loading:** Splitting 100MB+ datasets into manageable chunks
- **Dynamic Loading:** Loading only visible/required areas
- **Caching:** LocalStorage caching to minimize redundant API calls

#### 4. Project Management System
- **Save/Load:** JSON-based project state persistence
- **Grouping:** Managing multiple parcels as logical groups
- **Memo:** Contextual notes for parcels/groups

#### 5. Geospatial Calculation
- **Auto-Distance:** Automatic parcel-to-parcel distance
- **Perimeter:** Auto-calculation of boundary length
- **Shared Boundary Analysis (new):** Automatic detection and visualization of shared boundaries between parcels using Turf.js `lineOverlap`.
- **Risk Assessment:** Proactive risk scoring based on proximity to structures

---

## 💻 Tech Stack

### Frontend
- **HTML5:** Semantic markup
- **CSS3:** Flexbox, Grid for responsive layout
- **JavaScript:** Vanilla JS (ES6+) for business logic

### Mapping & GIS
- **Leaflet.js:** 1.9.x for map rendering and interaction
- **Leaflet.draw:** Vector drawing capabilities
- **Turf.js:** Advanced geospatial analysis (intersections, unions, measurements)

### APIs & Services
- **VWorld OpenAPI:** Cadastral maps, valuation data
- **Vercel:** Hosting platform

### Data Storage
- **LocalStorage:** Session data (~5-10MB)
- **File API:** Unlimited project storage (JSON Export/Import)

---

## 🔧 Solved Technical Challenges

### 1. Handling Large Geospatial Data
**Problem:** Loading 100MB+ cadastral data crashed browser memory.
**Solution:** Implemented dynamic chunk loading and viewport-based rendering.
**Result:** 80% reduction in memory usage, faster load times.

### 2. LocalStorage Limits
**Problem:** 5-10MB limit insufficient for large projects.
**Solution:** Built JSON Export/Import system using File API.
**Result:** Unlimited project storage, easy backup/sharing.

### 3. API CORS Issues
**Problem:** Direct calls to VWorld API blocked by CORS polocy.
**Solution:** Utilized JSONP support and proxy-less direct endpoints where available.
**Result:** Successful integration while maintaining serverless architecture.

### 4. Responsive Map UI
**Problem:** Map rendering issues on variable screen sizes.
**Solution:** Flexbox layout + `invalidateSize()` trigger on resize.
**Result:** Optimized UX across mobile, tablet, and desktop.

### 5. Project State Persistence
**Problem:** Data loss on page refresh.
**Solution:** Auto-save to LocalStorage + manual JSON export.
**Result:** 0% data loss, >80% reduction in repetitive entry.

---

## 📊 Performance Comparison

| Metric | Manual Process | Automated System | Improvement |
|--------|----------------|------------------|-------------|
| **Task Time** | 20-35 mins/task | 1-2 mins/task | **>80% Faster** |
| **Infra Cost** | Server + DB costs | **$0** (Serverless) | **100% Savings** |
| **Site Visits** | Required every time | Eliminated unnecessary trips | **Cost Reduction** |
| **Scalability** | Region-specific setup | Nationwide standard | **Highly Scalable** |

---

## 📁 Technical Documents
- **Repository:** https://github.com/JuneBay/My-Land-Manager.git
- **Live Service:** Vercel Deployment
