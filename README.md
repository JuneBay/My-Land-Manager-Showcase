# My Land Manager — Architecture Showcase

**Geospatial Decision Support System | v6.0**

[![Live](https://img.shields.io/badge/Live-landmanager.co.kr-green?style=for-the-badge)](https://landmanager.co.kr)
[![LinkedIn](https://img.shields.io/badge/LinkedIn-junebay-blue?style=flat&logo=linkedin)](https://linkedin.com/in/junebay)

---

## Overview

Serverless web application for integrated land parcel management. Combines VWorld public cadastral data with surrounding infrastructure information to support pre-calculation, risk assessment, and dispute prevention.

**Patent filed** for dispute risk management features.

### At a Glance

| Item | Detail |
|------|--------|
| **Version** | v6.0 |
| **Live URL** | [landmanager.co.kr](https://landmanager.co.kr) |
| **Infrastructure Cost** | $0/month (Vercel Free Tier + VWorld OpenAPI) |
| **Architecture** | Pure client-side, no backend server |
| **Patent** | Filed — dispute risk management |
| **Status** | Production, actively maintained |

---

## Architecture

```
┌──────────────────────────────────────────────┐
│           Client Browser (Pure JS)           │
├──────────────────────────────────────────────┤
│  Leaflet.js    Turf.js    LocalStorage       │
│  (Map Engine)  (Geospatial) (Project State)  │
├──────────────────────────────────────────────┤
│              VWorld OpenAPI                   │
│         (Government Cadastral Data)          │
└──────────────┬───────────────┬───────────────┘
               │               │
        Toji-eum Portal   Supreme Court
        (Land Registry)    Registry
```

**Key decisions:**
- **No backend** — pure client-side, zero server costs
- **Public APIs only** — VWorld OpenAPI (government-provided, free)
- **Browser storage** — LocalStorage + File API for project persistence
- **Chunk loading** — 100MB+ GeoJSON processed in 1,000-feature chunks

---

## Core Features

### Dispute Risk Management (Patent Filed)
- Virtual surveying simulation before costly legal proceedings
- Litigation and professional survey cost pre-calculation
- High-risk parcel identification via cadastral mismatch detection
- Direct workflow to government portals for document issuance

### Stateful Workflow
- Save/load/edit analysis at any stage
- LocalStorage for active projects + File API for archiving
- 80%+ time reduction through project reuse

### Large-Scale Data Handling
- 100MB+ contiguous cadastral map processing in-browser
- Dynamic viewport rendering — only visible areas loaded
- Sub-second response for cached regions

### Government Portal Integration
- One-stop workflow: analysis → Toji-eum → Supreme Court Registry
- No context switching between platforms

---

## Infrastructure Cost

| Component | Technology | Monthly Cost |
|-----------|-----------|:---:|
| Hosting | Vercel Free Tier | $0 |
| Backend | None (client-side) | $0 |
| Database | LocalStorage + File API | $0 |
| Maps API | VWorld OpenAPI | $0 |
| **Total** | | **$0** |

---

## Tech Stack

- **Vanilla JavaScript** (ES6+) — zero framework overhead
- **Leaflet.js** — interactive map rendering
- **Turf.js** — geospatial calculations (area, distance, intersection)
- **VWorld OpenAPI** — cadastral maps, land valuation
- **Vercel** — static hosting

---

## Related

- **Profile**: [github.com/JuneBay](https://github.com/JuneBay)
- **LinkedIn**: [linkedin.com/in/junebay](https://linkedin.com/in/junebay)

- **Web**: [macrobay.kr](https://macrobay.kr)
