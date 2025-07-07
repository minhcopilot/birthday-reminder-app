# Birthday Reminder App - Backend

Backend API cho ứng dụng Birthday Reminder, được xây dựng với Node.js, Express và PostgreSQL.

## Cài đặt

1. Clone repository
2. Cài đặt các dependencies:

```bash
npm install
```

3. Tạo file `.env` dựa trên `.env.example` và điền các thông tin cần thiết.
4. Khởi động server:

```bash
npm run dev
```

## Cấu hình Email

### Sử dụng Brevo API (Khuyên dùng)

Ứng dụng đã được cấu hình để sử dụng Brevo (trước đây là SendinBlue) để gửi email. Đây là dịch vụ gửi email đáng tin cậy với nhiều tính năng hữu ích.

1. Đăng ký tài khoản tại [Brevo](https://www.brevo.com/)
2. Tạo API key trong tài khoản Brevo
3. Cập nhật file `.env` với các thông tin sau:

```
BREVO_API_KEY=your-brevo-api-key
BREVO_EMAIL=your-email@example.com
```

### Sử dụng SMTP thông thường (Phương án dự phòng)

Nếu bạn không muốn sử dụng Brevo, ứng dụng cũng hỗ trợ gửi email qua SMTP thông thường:

1. Cập nhật file `.env` với các thông tin sau:

```
EMAIL_HOST=your-smtp-host
EMAIL_PORT=your-smtp-port
EMAIL_USER=your-email@example.com
EMAIL_PASSWORD=your-email-password
```

2. Sửa file `src/services/schedulerService.js` và `src/controllers/notificationController.js` để sử dụng `sendEmailNotification` thay vì `sendBrevoEmailNotification`.

## Khắc phục sự cố

### Lỗi Firebase Private Key

Trong phiên bản hiện tại, chúng tôi đã tạm thời tắt tính năng Firebase để tránh lỗi `Failed to parse private key`. Điều này có nghĩa là tính năng thông báo đẩy (push notification) sẽ không hoạt động cho đến khi bạn cấu hình đúng Firebase.

Nếu bạn muốn kích hoạt lại Firebase, hãy thực hiện các bước sau:

1. Mở file `.env` và đảm bảo cấu hình Firebase đúng:
```
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_PRIVATE_KEY_ID=your-private-key-id
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYOUR_PRIVATE_KEY_HERE\n-----END PRIVATE KEY-----\n"
FIREBASE_CLIENT_EMAIL=your-client-email
FIREBASE_CLIENT_ID=your-client-id
```

2. Mở file `src/services/notificationService.js` và bỏ comment phần khởi tạo Firebase.

### Lỗi Brevo API

Chúng tôi đã cập nhật code để xử lý lỗi `TypeError: Cannot set properties of undefined (setting 'apiKey')` khi sử dụng Brevo API. Nếu Brevo API không hoạt động, hệ thống sẽ tự động chuyển sang sử dụng Nodemailer.

Nếu bạn muốn sử dụng Brevo API, hãy đảm bảo:

1. Đã cài đặt đúng phiên bản thư viện:
```bash
npm install @getbrevo/brevo@latest --save
```

2. Cấu hình đúng trong file `.env`:
```
BREVO_API_KEY=your-brevo-api-key
BREVO_EMAIL=your-email@example.com
```

### Kiểm tra cấu hình

Để kiểm tra xem cấu hình đã đúng chưa, bạn có thể chạy file test:

```bash
node test-with-file.js
```

Kết quả sẽ được ghi vào file `test-result.txt`.

## Cấu trúc dự án

- `server.js`: Điểm khởi đầu của ứng dụng
- `src/controllers`: Xử lý logic cho các routes
- `src/models`: Định nghĩa các model dữ liệu
- `src/routes`: Định nghĩa API routes
- `src/services`: Các dịch vụ như thông báo, email
- `src/middleware`: Middleware xác thực và xác thực
- `src/config`: Cấu hình cơ sở dữ liệu và các cấu hình khác
- `src/utils`: Các hàm tiện ích

## API Endpoints

### Auth
- `POST /api/auth/register`: Đăng ký người dùng mới
- `POST /api/auth/login`: Đăng nhập và nhận JWT token
- `POST /api/auth/refresh`: Làm mới JWT token

### Users
- `GET /api/users/me`: Lấy thông tin người dùng hiện tại
- `PUT /api/users/me`: Cập nhật thông tin người dùng

### Birthdays
- `GET /api/birthdays`: Lấy tất cả sinh nhật của người dùng
- `POST /api/birthdays`: Thêm sinh nhật mới
- `GET /api/birthdays/:id`: Lấy thông tin chi tiết của sinh nhật
- `PUT /api/birthdays/:id`: Cập nhật thông tin sinh nhật
- `DELETE /api/birthdays/:id`: Xóa sinh nhật

### Notifications
- `POST /api/notifications/send`: Gửi thông báo thủ công
- `GET /api/notifications/history`: Lấy lịch sử thông báo 