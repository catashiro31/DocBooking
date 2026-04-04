<h1 align="center">🏥 DocBooking - Hệ thống Đặt lịch Khám bệnh</h1>

<p align="center">
  <strong>DocBooking</strong> là giải pháp quản lý đặt lịch khám trực tuyến hiện đại, kết nối bệnh nhân và y bác sĩ tại Việt Nam.
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Java-17-orange?style=for-the-badge&logo=java" alt="Java 17">
  <img src="https://img.shields.io/badge/Spring_Boot-3.2.2-green?style=for-the-badge&logo=spring-boot" alt="Spring Boot 3.2.2">
  <img src="https://img.shields.io/badge/React-19-blue?style=for-the-badge&logo=react" alt="React 19">
  <img src="https://img.shields.io/badge/Vite-8-purple?style=for-the-badge&logo=vite" alt="Vite 8">
  <img src="https://img.shields.io/badge/Tailwind_CSS-4.0-38B2AC?style=for-the-badge&logo=tailwind-css" alt="Tailwind CSS 4">
  <img src="https://img.shields.io/badge/PostgreSQL-18-336791?style=for-the-badge&logo=postgresql" alt="PostgreSQL 18">
</p>

---

## 📖 Giới thiệu (Overview)
**DocBooking** cung cấp trải nghiệm đặt lịch khám bệnh thông minh, giúp người dùng tiết kiệm thời gian chờ đợi và nâng cao hiệu quả quản trị cho các cơ sở y tế.

## ✨ Tính năng nổi bật (Key Features)

### 🩺 Dành cho Bệnh nhân
*   **Tìm kiếm:** Tìm kiếm bác sĩ theo chuyên khoa, kinh nghiệm hoặc vị trí.
*   **Đặt lịch:** Đặt lịch hẹn chỉ với vài thao tác đơn giản.
*   **Quản lý:** Theo dõi trạng thái lịch hẹn và nhận thông báo qua Email.
*   **Hồ sơ:** Lưu trữ thông tin cá nhân và lịch sử thăm khám.

### 👨‍⚕️ Dành cho Bác sĩ & Admin
*   **Dashboard:** Giao diện quản lý lịch khám trực quan, hiện đại.
*   **Xác nhận:** Phê duyệt hoặc hủy lịch hẹn nhanh chóng.
*   **Thống kê:** Báo cáo số lượng lịch khám theo ngày/tháng/năm.
*   **Xác thực:** Bảo vệ tài khoản bằng hệ thống JWT (JSON Web Token) mạnh mẽ.

---

## 🛠 Công nghệ sử dụng (Tech Stack)

| Thành phần | Công nghệ |
| :--- | :--- |
| **Backend** | Java 17, Spring Boot 3.2, Hibernate, Spring Security |
| **Frontend** | React 19, Vite, Tailwind CSS 4, Redux Toolkit |
| **Database** | PostgreSQL 18 |
| **Authentication** | JWT (JSON Web Token) |
| **Storage** | Cloudinary (Quản lý hình ảnh) |
| **Notification** | Spring Mail (Thông báo Email tự động) |

---

## 🏗 Kiến trúc dự án (Architecture)

Toàn bộ dự án được tổ chức theo cấu trúc Monorepo thống nhất:

```text
DocBooking/
├── Backend/                       # API Spring Boot (Java 17)
│   ├── src/main/java/docbooking/
│   │   ├── admin/                 # Quản trị hệ thống (Admin, Review moderation, v.v.)
│   │   ├── auth/                  # Đăng ký, Đăng nhập & Xác thực
│   │   ├── configs/               # Cấu hình CORS, Swagger, Cloudinary
│   │   ├── doctor/                # Quản lý bác sĩ & Lịch làm việc
│   │   ├── exceptions/            # Xử lý lỗi tập trung (Global Exception Handler)
│   │   ├── models/                # Thực thể dữ liệu (User, Doctor, Appointment, v.v.)
│   │   ├── open/                  # API công khai (Tìm kiếm bác sĩ, Xem phòng khám)
│   │   ├── patient/               # Nghiệp vụ bệnh nhân & Đặt lịch
│   │   ├── repositories/          # Tầng truy vấn database (Spring Data JPA)
│   │   ├── security/              # Cấu hình JWT & Spring Security
│   │   ├── user/                  # Quản lý thông tin người dùng
│   │   └── utils/                 # Các lớp tiện ích (Email sender, AI filter, v.v.)
│   └── pom.xml                    # Quản lý dependencies Maven
├── Frontend/                      # Giao diện người dùng (React 19 + Vite)
│   ├── src/
│   │   ├── components/            # Các UI components dùng chung (Navbar, Footer, v.v.)
│   │   ├── context/               # Quản lý Global State (AuthContext, v.v.)
│   │   ├── images/                # Hình ảnh minh họa & Icons
│   │   ├── pages/                 # Các trang chính (Home, Booking, Profile, v.v.)
│   │   ├── services/              # Các hàm gọi API (AdminService, PatientService, v.v.)
│   │   ├── utils/                 # Hàm tiện ích (Date formatter, Auth verify, v.v.)
│   │   ├── App.jsx                # Component định tuyến chính
│   │   └── main.jsx               # Điểm khởi đầu của ứng dụng
│   └── vite.config.js             # Cấu hình Build tối ưu
├── Docs/                          # Tài liệu & Tài nguyên (Logo, Mockups, Diagrams)
├── .gitignore                     # Tệp cấu hình bỏ qua Git
└── README.md                      # Tài liệu hướng dẫn chính
```



---

## 🚀 Hướng dẫn Quick Start

### 1. Backend Setup
1. Đảm bảo bạn đã cài đặt **JDK 17** và **PostgreSQL**.
2. Tạo database có tên `docbooking` trong PostgreSQL.
3. Cập nhật cấu hình database trong `Backend/src/main/resources/application.properties`.
4. Chạy ứng dụng từ thư mục `Backend/`:
```bash
./mvnw spring-boot:run
```

### 2. Frontend Setup
1. Đảm bảo bạn đã cài đặt **Node.js** (Phiên bản v18 trở lên).
2. Di chuyển vào thư mục Frontend:
```bash
cd Frontend
npm install
```
3. Khởi chạy môi trường phát triển:
```bash
npm run dev
```