# Backend

## Overview

Thư mục giữ chỗ cho backend Java 21 và Spring Boot 3.x. Chưa có code backend vì yêu cầu nghiệp vụ và hợp đồng API chưa được xác định.

## Kiến trúc dự kiến

Modular Monolith theo nghiệp vụ, không chia toàn bộ hệ thống thành các tầng dùng chung.

- `identity`: tài khoản, xác thực JWT, hồ sơ và tiêu chí người dùng
- `places`: địa điểm, danh mục, vị trí và giờ mở cửa
- `local-services`: dịch vụ, nhà cung cấp địa phương và mức giá
- `recommendation`: chấm điểm theo tiêu chí và dữ liệu có sẵn
- `favorites`: bộ sưu tập địa điểm của người dùng
- `itinerary`: chuyến đi, ngày và điểm dừng
- `media`: metadata ảnh Cloudinary

PostgreSQL là nguồn dữ liệu chính. Redis chỉ dùng cho cache và dữ liệu ngắn hạn.

## Next Steps

Chỉ khởi tạo Spring Boot sau khi chốt use case, quyền truy cập, mô hình dữ liệu và REST contract.
