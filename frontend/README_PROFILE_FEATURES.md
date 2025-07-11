# User Profile Management Features

## Overview

Đã thêm các tính năng quản lý profile user vào frontend với các chức năng sau:

### 1. Profile Page (`/app/profile`)

- Hiển thị thông tin chi tiết của user
- Avatar với fallback là chữ cái đầu của username
- Thông tin: Username, Email, Full Name, Status, Roles, Member Since, Last Updated
- 2 nút chính: "Edit Profile" và "Change Password"

### 2. Profile Modal

- Cập nhật thông tin cá nhân: Username, Email, Full Name, Avatar URL
- Validation form
- Loading state và error handling
- Tự động cập nhật context sau khi thành công

### 3. Change Password Modal

- Đổi mật khẩu với validation:
  - Mật khẩu hiện tại
  - Mật khẩu mới (tối thiểu 6 ký tự)
  - Xác nhận mật khẩu mới
- Kiểm tra mật khẩu mới và xác nhận phải giống nhau

### 4. User Profile Popup

- Popup hiển thị thông tin user khi click vào icon profile trong header
- Thêm nút "Profile Settings" để navigate đến Profile Page
- Hiển thị roles với styling đẹp

## Cách sử dụng

### Truy cập Profile Page

1. Đăng nhập vào hệ thống
2. Click vào icon user ở header (góc phải)
3. Click "Profile Settings" trong popup
4. Hoặc truy cập trực tiếp: `/app/profile`

### Cập nhật thông tin profile

1. Vào Profile Page
2. Click "Edit Profile"
3. Điền thông tin mới
4. Click "Update Profile"

### Đổi mật khẩu

1. Vào Profile Page
2. Click "Change Password"
3. Nhập mật khẩu hiện tại
4. Nhập mật khẩu mới (tối thiểu 6 ký tự)
5. Xác nhận mật khẩu mới
6. Click "Change Password"

## API Endpoints được sử dụng

### Backend APIs

- `GET /api/auth/me` - Lấy thông tin user hiện tại
- `PUT /api/auth/profile` - Cập nhật thông tin profile
- `PUT /api/auth/password` - Đổi mật khẩu

### Frontend API Functions

- `getCurrentUser()` - Lấy thông tin user
- `updateProfile(data)` - Cập nhật profile
- `changePassword(data)` - Đổi mật khẩu

## Components được tạo

### 1. ProfileModal (`src/components/profile/ProfileModal.tsx`)

- Modal để cập nhật thông tin profile
- Form validation
- Error handling
- Success feedback

### 2. ChangePasswordModal (`src/components/profile/ChangePasswordModal.tsx`)

- Modal để đổi mật khẩu
- Password validation
- Confirmation check
- Security feedback

### 3. ProfilePage (`src/pages/ProfilePage.tsx`)

- Trang hiển thị thông tin profile
- Tích hợp cả 2 modals
- UI đẹp với avatar và thông tin chi tiết

### 4. userApi (`src/api/userApi.ts`)

- API functions cho user management
- TypeScript interfaces
- Error handling

## Cập nhật Components khác

### 1. AuthContext (`src/context/AuthContext.tsx`)

- Thêm `setUser` function để cập nhật user context
- Sửa User type để phù hợp với backend

### 2. Header (`src/components/layout/Header.tsx`)

- Sử dụng `avatarUrl` thay vì `photoURL`
- Cải thiện UX

### 3. UserProfilePopup (`src/components/auth/UserProfilePopup.tsx`)

- Thêm nút "Profile Settings"
- Hiển thị roles với styling
- Link đến Profile Page

### 4. App.tsx

- Sửa route admin check để sử dụng `roles.includes('ROLE_ADMIN')`
- Route `/app/profile` đã có sẵn

## Styling

- Sử dụng Tailwind CSS
- Dark theme phù hợp với design system
- Responsive design
- Loading states và animations
- Error và success states

## Security

- Validation form ở frontend
- Password confirmation
- JWT token authentication
- Secure API calls

## Testing

Để test các tính năng:

1. **Start backend:**

   ```bash
   cd backend
   mvn spring-boot:run
   ```

2. **Start frontend:**

   ```bash
   cd frontend
   npm run dev
   ```

3. **Test flow:**
   - Đăng nhập
   - Vào Profile Page
   - Test update profile
   - Test change password
   - Kiểm tra UserProfilePopup

## Lưu ý

- Backend phải có các API endpoints tương ứng
- JWT token phải được lưu trong localStorage
- User context phải được cập nhật sau khi thay đổi
- Error handling đã được implement đầy đủ
