# Birthday Reminder App - React Native + Node.js

Ứng dụng nhắc nhở sinh nhật hoàn chỉnh với khả năng gửi email và push notifications cho cả iOS và Android.

## 🚀 Tính năng chính

### Backend (Node.js + Express)
- ✅ API server với Express.js framework
- ✅ Database PostgreSQL với các model: User, Birthday, Notification
- ✅ Authentication system với JWT
- ✅ Email service sử dụng nodemailer
- ✅ Push notification service với Firebase Admin SDK
- ✅ Cron job scheduler để kiểm tra sinh nhật hàng ngày
- ✅ CRUD operations cho quản lý sinh nhật
- ✅ Validation và error handling
- ✅ Security middleware (helmet, rate limiting)

### Mobile App (React Native)
- ✅ Cross-platform app cho iOS và Android
- ✅ Authentication screens (Login/Register)
- ✅ Birthday management screens (List, Add, Edit, Delete, Detail)
- ✅ Push notifications integration với Firebase
- ✅ Settings screen với user preferences
- ✅ Local storage với AsyncStorage
- ✅ Navigation với React Navigation
- ✅ UI components với React Native Paper

## 📁 Cấu trúc dự án

```
birthday-reminder-app/
├── backend/                    # Backend API server
│   ├── src/
│   │   ├── controllers/        # Route controllers
│   │   │   ├── authController.js
│   │   │   ├── birthdayController.js
│   │   │   ├── userController.js
│   │   │   └── notificationController.js
│   │   ├── models/             # Database models
│   │   │   ├── User.js
│   │   │   ├── Birthday.js
│   │   │   ├── Notification.js
│   │   │   └── index.js        # Model associations
│   │   ├── services/           # Business logic services
│   │   │   ├── emailService.js
│   │   │   ├── pushNotificationService.js
│   │   │   └── schedulerService.js
│   │   ├── middleware/         # Express middleware
│   │   │   └── authMiddleware.js
│   │   ├── routes/             # API routes
│   │   │   ├── auth.js
│   │   │   ├── birthdays.js
│   │   │   ├── users.js
│   │   │   └── notifications.js
│   │   ├── config/             # Configuration
│   │   │   └── database.js
│   │   └── utils/              # Utility functions
│   │       ├── validation.js
│   │       └── helpers.js
│   ├── package.json
│   ├── server.js               # Server entry point
│   └── .env.example            # Environment variables template
├── mobile/                     # React Native app
│   ├── src/
│   │   ├── components/         # Reusable UI components
│   │   │   ├── BirthdayCard.js
│   │   │   ├── CustomButton.js
│   │   │   ├── CustomInput.js
│   │   │   └── LoadingSpinner.js
│   │   ├── screens/            # Screen components
│   │   │   ├── auth/           # Authentication screens
│   │   │   │   ├── LoginScreen.js
│   │   │   │   └── RegisterScreen.js
│   │   │   ├── birthdays/      # Birthday management screens
│   │   │   │   ├── BirthdayListScreen.js
│   │   │   │   ├── AddBirthdayScreen.js
│   │   │   │   ├── EditBirthdayScreen.js
│   │   │   │   └── BirthdayDetailScreen.js
│   │   │   ├── profile/        # Profile and settings screens
│   │   │   │   ├── ProfileScreen.js
│   │   │   │   └── SettingsScreen.js
│   │   │   ├── app/            # Main app screens
│   │   │   │   └── HomeScreen.js
│   │   │   ├── NotificationsScreen.js
│   │   │   └── SplashScreen.js
│   │   ├── services/           # API and business logic services
│   │   │   ├── api.js
│   │   │   ├── authService.js
│   │   │   ├── birthdayService.js
│   │   │   └── notificationService.js
│   │   ├── navigation/         # Navigation configuration
│   │   │   └── AppNavigator.js
│   │   ├── context/            # React Context providers
│   │   │   ├── AuthContext.js
│   │   │   └── NotificationContext.js
│   │   ├── utils/              # Utility functions
│   │   │   ├── constants.js
│   │   │   ├── helpers.js
│   │   │   └── storage.js
│   │   └── styles/             # Styling
│   │       ├── theme.js
│   │       └── globalStyles.js
│   ├── android/                # Android native code
│   ├── ios/                    # iOS native code
│   ├── package.json
│   ├── App.js                  # App entry point
│   └── index.js                # React Native entry point
├── docker-compose.yml          # Docker deployment configuration
└── README.md                   # This file
```

## 🛠 Tech Stack

### Backend
- **Framework**: Express.js
- **Database**: PostgreSQL với Sequelize ORM
- **Authentication**: JWT (jsonwebtoken)
- **Email**: nodemailer
- **Push Notifications**: firebase-admin
- **Scheduling**: node-cron
- **Validation**: joi
- **Security**: helmet, express-rate-limit, cors
- **Environment**: dotenv

### Mobile
- **Framework**: React Native
- **Navigation**: React Navigation v6
- **UI Library**: React Native Paper
- **State Management**: Context API
- **HTTP Client**: axios
- **Storage**: AsyncStorage
- **Push Notifications**: @react-native-firebase/messaging
- **Date Picker**: react-native-date-picker

## 🗄 Database Schema

### Users Table
- id (Primary Key)
- email (Unique)
- password (Hashed)
- firstName
- lastName
- fcmToken (Firebase token)
- reminderTime (Default notification time)
- isActive
- createdAt, updatedAt

### Birthdays Table
- id (Primary Key)
- userId (Foreign Key)
- name
- birthday (Date)
- email
- phone
- reminderDays (Days before to remind)
- notes
- isActive
- createdAt, updatedAt

### Notifications Table
- id (Primary Key)
- userId (Foreign Key)
- birthdayId (Foreign Key)
- type (email/push)
- sentAt
- status (pending/sent/failed)
- createdAt, updatedAt

## 🔗 API Endpoints

### Authentication
- `POST /api/auth/register` - Đăng ký tài khoản
- `POST /api/auth/login` - Đăng nhập

### Birthdays
- `GET /api/birthdays` - Lấy danh sách sinh nhật
- `POST /api/birthdays` - Tạo sinh nhật mới
- `GET /api/birthdays/:id` - Lấy chi tiết sinh nhật
- `PUT /api/birthdays/:id` - Cập nhật sinh nhật
- `DELETE /api/birthdays/:id` - Xóa sinh nhật

### Users
- `GET /api/users/profile` - Lấy thông tin cá nhân
- `PUT /api/users/profile` - Cập nhật thông tin cá nhân

### Notifications
- `POST /api/notifications/send` - Gửi thông báo
- `GET /api/notifications/history` - Lịch sử thông báo

## ⚙️ Cài đặt và chạy

### Yêu cầu hệ thống
- Node.js >= 16.0.0
- PostgreSQL >= 12
- React Native CLI
- Android Studio (cho phát triển Android)
- Xcode (cho phát triển iOS, chỉ trên macOS)

### 1. Cài đặt Backend

```bash
# Di chuyển vào thư mục backend
cd backend

# Cài đặt dependencies
npm install

# Tạo file .env từ mẫu
cp .env.example .env

# Cập nhật các biến môi trường trong .env
# - Database connection
# - JWT secret
# - Email configuration
# - Firebase configuration

# Khởi động server
npm run dev
```

### 2. Cài đặt Mobile App

```bash
# Di chuyển vào thư mục mobile
cd mobile

# Cài đặt dependencies
npm install

# Cài đặt pods cho iOS (chỉ trên macOS)
cd ios && pod install && cd ..

# Chạy Metro Bundler
npm start

# Chạy trên Android (terminal mới)
npm run android

# Chạy trên iOS (terminal mới, chỉ trên macOS)
npm run ios
```

### 3. Cài đặt với Docker (Tùy chọn)

```bash
# Khởi động toàn bộ hệ thống với Docker Compose
docker-compose up -d

# Xem logs
docker-compose logs -f

# Dừng services
docker-compose down
```

## 🔧 Cấu hình môi trường

### Backend (.env)
```env
# Database
DB_NAME=birthday_reminder
DB_USER=postgres
DB_PASSWORD=password
DB_HOST=localhost
DB_PORT=5432

# JWT
JWT_SECRET=your-super-secret-jwt-key-here

# Email
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password

# Firebase
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_PRIVATE_KEY_ID=your-private-key-id
FIREBASE_PRIVATE_KEY=your-private-key
FIREBASE_CLIENT_EMAIL=your-client-email
FIREBASE_CLIENT_ID=your-client-id

# Server
PORT=3000
NODE_ENV=development
```

### Firebase Setup
1. Tạo project trên [Firebase Console](https://console.firebase.google.com/)
2. Bật Firebase Cloud Messaging (FCM)
3. Tạo Service Account và tải về JSON key
4. Cập nhật thông tin Firebase vào file .env

## 📱 Tính năng Mobile App

1. **Authentication**: Đăng ký, đăng nhập với JWT
2. **Birthday Management**: CRUD operations với giao diện thân thiện
3. **Search & Filter**: Tìm kiếm và lọc sinh nhật theo nhiều tiêu chí
4. **Notifications**: Thông báo đẩy và lịch sử thông báo
5. **Settings**: Cài đặt thời gian nhắc nhở và preferences
6. **Profile Management**: Quản lý thông tin cá nhân

## 🚀 Deployment

### Backend Deployment
- Sử dụng services như Heroku, DigitalOcean, AWS
- Cấu hình PostgreSQL database
- Thiết lập environment variables
- Cấu hình Firebase service account

### Mobile App Deployment
- **Android**: Build APK/AAB và upload lên Google Play Store
- **iOS**: Build IPA và upload lên App Store Connect

## 📝 License

MIT License - xem file [LICENSE](LICENSE) để biết thêm chi tiết.

## 🤝 Contributing

1. Fork project
2. Tạo feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Mở Pull Request

## 📞 Support

Nếu bạn gặp vấn đề hoặc có câu hỏi, vui lòng tạo issue trên GitHub hoặc liên hệ qua email.

---

**Happy Coding! 🎉** 