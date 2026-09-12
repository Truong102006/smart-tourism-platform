# Đi Đây

Nền tảng khám phá du lịch đô thị thông minh và kết nối hệ sinh thái du lịch địa phương tại Việt Nam.

## Trạng thái hiện tại

Giai đoạn này chỉ triển khai frontend bằng dữ liệu mock. Thư mục `backend/` được giữ chỗ, chưa có Java source, API, migration hay logic nghiệp vụ.

## Cấu trúc

```text
smart-tourism-platform/
├── frontend/        # React, TypeScript, Vite, Tailwind CSS
├── backend/         # Chỉ giữ chỗ cho Spring Boot Modular Monolith
├── database/        # Giữ chỗ cho Flyway và dữ liệu phát triển
├── postman/         # Giữ chỗ cho collection kiểm thử API
├── infra/           # Cấu hình phục vụ frontend
├── docs/            # Kiến trúc và quy ước thiết kế
└── docker-compose.yml
```

Nguồn và giấy phép ảnh minh họa được ghi tại [`docs/image-credits.md`](docs/image-credits.md).

## Chạy frontend

Yêu cầu Node.js 22.22 trở lên.

```bash
cd frontend
npm install
npm run dev
```

Mở `http://localhost:5173`.

## Kiểm tra

```bash
cd frontend
npm run typecheck
npm run lint
npm run build
```

## Docker

```bash
docker compose up --build
```

Mở `http://localhost:3000`. Cổng `8080` được để trống cho REST API Spring Boot trong giai đoạn sau.

## Phạm vi tiếp theo

Khi nghiệp vụ backend được chốt, khởi tạo Spring Boot 3.x trong `backend/` và kết nối các adapter hiện có ở `frontend/src/features/*/api/` tới REST API.
