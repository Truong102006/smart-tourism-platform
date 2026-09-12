# System Architecture

## Overview

Hệ thống hướng đến Modular Monolith và REST API. Giai đoạn hiện tại chỉ có frontend chạy được; backend mới là ranh giới kiến trúc dự kiến.

## Repository Boundaries

| Area | Responsibility | Status |
|---|---|---|
| `frontend/` | Web khám phá, bản đồ, yêu thích và lịch trình | Implemented with mock data |
| `backend/` | Spring Boot Modular Monolith | Reserved only |
| `database/` | Flyway migrations and development data | Reserved only |
| `postman/` | REST API collections | Reserved only |
| `infra/` | Static frontend serving | Nginx configured |

## Frontend Flow

Pages depend on feature hooks. Feature hooks depend on API adapters. The current adapter reads mock data and simulates latency. A future REST adapter can use the existing Axios client without changing pages.

```text
Route page -> feature hook -> query cache -> API adapter -> mock data now
                                                -> REST API later
```

Client-only state such as favorites and itinerary lives outside TanStack Query and persists to `localStorage`.

## Future Backend Modules

- Identity
- Places
- Local Services
- Recommendation
- Favorites
- Itinerary
- Media

Each module should own its domain model, application services, ports, adapters and API boundary. Cross-module access should go through public application interfaces, not another module's repository.

## Data and Infrastructure

- PostgreSQL: source of truth
- Redis: cache only
- Cloudinary: image binary storage; PostgreSQL stores metadata and public identifiers
- OpenStreetMap: base map tiles
- Leaflet: map interaction in the web client

## Security Boundary

The frontend contains only a future Bearer token attachment point. Authentication, authorization, JWT validation and refresh policy remain backend responsibilities and are not implemented in this phase.
