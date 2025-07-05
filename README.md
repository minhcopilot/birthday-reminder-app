# Ứng dụng nhắc nhở sinh nhật (Birthday Reminder App)

Ứng dụng di động giúp người dùng quản lý và nhận thông báo về các ngày sinh nhật quan trọng.

## Tính năng

- Đăng ký và đăng nhập tài khoản
- Thêm, chỉnh sửa và xóa thông tin sinh nhật
- Nhận thông báo trước ngày sinh nhật
- Tùy chỉnh thời gian nhắc nhở
- Gửi thông báo qua email và push notification

## Cấu trúc dự án

```
birthday-reminder-app/
├── backend/              # API và server backend
│   ├── src/              # Mã nguồn backend
│   ├── package.json      # Cấu hình và dependencies
│   ├── .env.example      # Mẫu biến môi trường
│   └── server.js         # Điểm khởi đầu ứng dụng
├── mobile/               # Ứng dụng di động React Native
│   ├── src/              # Mã nguồn mobile
│   ├── package.json      # Cấu hình và dependencies
│   ├── App.js            # Component chính
│   ├── android/          # Mã nguồn Android
│   └── ios/              # Mã nguồn iOS
└── README.md             # Tài liệu dự án
```

## Cài đặt và chạy

### Backend

1. Di chuyển vào thư mục backend:
```
cd birthday-reminder-app/backend
```

2. Cài đặt các dependencies:
```
npm install
```

3. Tạo file .env từ mẫu .env.example và cấu hình các biến môi trường:
```
cp .env.example .env
```

4. Khởi động server:
```
npm run dev
```

### Mobile

1. Di chuyển vào thư mục mobile:
```
cd birthday-reminder-app/mobile
```

2. Cài đặt các dependencies:
```
npm install
```

3. Khởi động Metro Bundler:
```
npm start
```

4. Chạy ứng dụng trên Android:
```
npm run android
```

5. Chạy ứng dụng trên iOS:
```
npm run ios
```

## Công nghệ sử dụng

### Backend
- Node.js và Express
- PostgreSQL và Sequelize ORM
- JWT cho xác thực
- Firebase Admin SDK cho push notifications
- Nodemailer cho email
- Node-cron cho lập lịch

### Mobile
- React Native
- React Navigation
- React Native Paper (UI)
- Axios cho API calls
- React Hook Form
- Firebase Messaging cho push notifications

## Yêu cầu hệ thống

- Node.js >= 16.0.0
- PostgreSQL >= 12
- React Native CLI
- Android Studio (cho phát triển Android)
- Xcode (cho phát triển iOS, chỉ trên macOS)

## Giấy phép

MIT 