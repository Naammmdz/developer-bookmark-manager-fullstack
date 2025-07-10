# Bookmark Manager - 3-Layer Architecture

## Tổng quan dự án

Đây là một ứng dụng quản lý bookmark cho developers, được xây dựng theo mô hình 3-layer architecture với Spring Boot và JWT authentication.

## Kiến trúc 3 lớp (3-Layer Architecture)

### 1. **Presentation Layer (Lớp Trình bày)**

- **Package**: `com.g1.bookmark_manager.controller`
- **Chức năng**: Xử lý HTTP requests/responses, validation đầu vào
- **Các class chính**:
  - `AuthController`: Xử lý authentication (login, register)
  - `BookmarkController`: Xử lý CRUD operations cho bookmark
  - `TestController`: Endpoints để test API

### 2. **Business Layer (Lớp Logic nghiệp vụ)**

- **Package**: `com.g1.bookmark_manager.service`
- **Chức năng**: Xử lý business logic, validation nghiệp vụ
- **Các class chính**:
  - `AuthService`: Xử lý logic authentication, UserDetailsService
  - `BookmarkService`: Xử lý logic CRUD bookmark, tìm kiếm, phân loại

### 3. **Data Access Layer (Lớp Truy cập dữ liệu)**

- **Package**: `com.g1.bookmark_manager.repository`
- **Chức năng**: Tương tác với database
- **Các class chính**:
  - `UserRepository`: Truy cập dữ liệu user
  - `BookmarkRepository`: Truy cập dữ liệu bookmark với các query tùy chỉnh

## Cấu trúc Entity & DTO

### Entity (Data Model)

- **Package**: `com.g1.bookmark_manager.entity`
- `User`: Entity người dùng với UserDetails implementation
- `Bookmark`: Entity bookmark với relationship tới User

### DTOs (Data Transfer Objects)

- **Request DTOs**: `com.g1.bookmark_manager.dto.request`

  - `LoginRequest`: Dữ liệu đăng nhập
  - `RegisterRequest`: Dữ liệu đăng ký
  - `BookmarkRequest`: Dữ liệu tạo/cập nhật bookmark

- **Response DTOs**: `com.g1.bookmark_manager.dto.response`
  - `AuthResponse`: Phản hồi authentication
  - `BookmarkResponse`: Phản hồi bookmark data

## Cấu hình Security & JWT

### JWT Configuration

- **Package**: `com.g1.bookmark_manager.util`
- `JwtUtil`: Utility class cho JWT operations
- JWT secret và expiration được cấu hình trong `application.properties`

### Security Configuration

- **Package**: `com.g1.bookmark_manager.config`
- `SecurityConfig`: Cấu hình Spring Security
- `JwtAuthenticationFilter`: Filter xử lý JWT authentication

## API Endpoints

### Authentication

- `POST /api/auth/register` - Đăng ký user mới
- `POST /api/auth/login` - Đăng nhập

### Bookmarks (Cần JWT Token)

- `GET /api/bookmarks` - Lấy tất cả bookmarks
- `POST /api/bookmarks` - Tạo bookmark mới
- `GET /api/bookmarks/{id}` - Lấy bookmark theo ID
- `PUT /api/bookmarks/{id}` - Cập nhật bookmark
- `DELETE /api/bookmarks/{id}` - Xóa bookmark
- `GET /api/bookmarks/favorites` - Lấy bookmarks yêu thích
- `GET /api/bookmarks/category/{category}` - Lấy bookmarks theo category
- `GET /api/bookmarks/search?keyword=` - Tìm kiếm bookmarks
- `GET /api/bookmarks/categories` - Lấy danh sách categories

### Test Endpoints

- `GET /api/test/hello` - Test API
- `GET /api/test/health` - Health check

## Database Configuration

### SQL Server

- Database: `BookmarkDB`
- Port: `1433`
- Username: `sa`
- Password: `12345`

### Tables

- `users`: Thông tin người dùng
- `bookmarks`: Thông tin bookmark

## Cách chạy ứng dụng

1. **Cài đặt dependencies**:

   ```bash
   mvn clean install
   ```

2. **Chạy ứng dụng**:

   ```bash
   mvn spring-boot:run
   ```

3. **Truy cập Swagger UI**:
   ```
   http://localhost:8080/swagger-ui.html
   ```

## Tính năng chính

### Authentication

- Đăng ký/đăng nhập với JWT
- Password encryption với BCrypt
- JWT token validation

### Bookmark Management

- CRUD operations cho bookmark
- Tìm kiếm bookmark theo title, description, tags
- Phân loại bookmark theo category
- Đánh dấu bookmark yêu thích
- Chỉ user được phép truy cập bookmark của mình

### Security

- JWT-based authentication
- Role-based access control
- CORS configuration
- Request/Response validation

## Dependencies chính

- **Spring Boot 3.5.3**
- **Spring Security**
- **Spring Data JPA**
- **JWT (0.12.6)**
- **SQL Server Driver**
- **Lombok**
- **SpringDoc OpenAPI**
- **Validation**

## Lưu ý

1. Đảm bảo SQL Server đang chạy và có database `BookmarkDB`
2. Cấu hình JWT secret trong production environment
3. Cập nhật database configuration phù hợp với môi trường
