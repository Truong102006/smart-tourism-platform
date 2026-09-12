# Đi Đây Frontend

## Overview

React frontend cho luồng khám phá địa điểm, lọc theo nhu cầu, xem bản đồ, lưu địa điểm và xây dựng lịch trình. Dữ liệu hiện tại là mock và được truy cập qua cùng một lớp adapter dự kiến dùng cho REST API.

## Quick Start

Yêu cầu Node.js 22.22 trở lên.

```bash
npm install
npm run dev
```

## Available Scripts

- `npm run dev`: chạy Vite development server
- `npm run typecheck`: kiểm tra TypeScript
- `npm run lint`: chạy Oxlint
- `npm run build`: tạo production bundle
- `npm run preview`: xem production bundle tại máy

## Environment

Sao chép `.env.example` thành `.env` khi backend hoặc Cloudinary được kết nối.

## Source Layout

- `src/app`: providers và router
- `src/components`: UI dùng chung
- `src/features`: model, hooks, API adapter và state theo nghiệp vụ
- `src/pages`: route-level pages
- `src/data`: mock data tạm thời
- `src/lib`: Axios và TanStack Query configuration
