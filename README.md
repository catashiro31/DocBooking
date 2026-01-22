# 🏥 DocBooking - Hệ thống Đặt lịch Khám bệnh

## 📖 Giới thiệu
**DocBooking** là nền tảng Web App kết nối bệnh nhân và bác sĩ, hỗ trợ đặt lịch khám trực tuyến, quản lý hồ sơ bệnh án và tìm kiếm cơ sở y tế nhanh chóng. Dự án được xây dựng theo kiến trúc **Monorepo**, tách biệt Frontend và Backend để đảm bảo hiệu năng và khả năng mở rộng.

---

## 🛠 Công nghệ sử dụng (Tech Stack)

### 1. Backend (Server)
* **Kiến trúc:** Layered Architecture
* **Ngôn ngữ:** Java 17
* **Framework:** Spring Boot 3.2.2
* **Database:** PostgreSQL 18
* **ORM:** Hibernate / Spring Data JPA
* **Security:** Spring Security + JWT (JSON Web Token)
* **API Documentation:** Swagger UI (Optional)

### 2. Frontend (Client)
* **Core:** ReactJS 18
* **Build Tool:** Vite (Siêu nhanh)
* **Styling:** Tailwind CSS
* **State Management:** Redux Toolkit
* **Routing:** React Router Dom v6
* **HTTP Client:** Axios

---

### 📂 Cấu trúc Tổng quan (Monorepo)

```text
DocBooking/
├── Backend/
├── Frontend/
├── Docs/                  # Tài liệu dự án
├── Database/ 
├── .gitignore
└── README.md
```

---

### 1. Backend (Spring Boot)

**Đặc điểm:** Gom nhóm theo lớp kỹ thuật.

```text
Backend/
├── src/main/java/com/docbooking/
│   ├── DocBookingApplication.java
│   │
│   ├── controllers/             # Chứa TẤT CẢ các Controller
│   │   ├── AuthController.java
│   │   ├── TestController.java
│   │   ├── DoctorController.java
│   │   └── BookingController.java
│   │
│   ├── models/                  # Chứa TẤT CẢ các Entity (DB Tables)
│   │   ├── User.java
│   │   ├── Role.java
│   │   ├── ERole.java           (Enum)
│   │   ├── Doctor.java
│   │   └── Booking.java
│   │
│   ├── repository/              # Chứa TẤT CẢ Interface Repository
│   │   ├── UserRepository.java
│   │   ├── RoleRepository.java
│   │   └── BookingRepository.java
│   │
│   ├── security/                # Cấu hình bảo mật
│   │   ├── WebSecurityConfig.java
│   │   ├── jwt/
│   │   │   ├── AuthEntryPointJwt.java
│   │   │   ├── AuthTokenFilter.java
│   │   │   └── JwtUtils.java
│   │   └── services/
│   │       ├── UserDetailsImpl.java
│   │       └── UserDetailsServiceImpl.java
│   │
│   └── dto/
│       ├── auth/
│       │   ├── LoginRequest.java
│       │   ├── RegisterRequest.java
│       │   └── JwtResponse.java
│       ├── booking/
│       │   ├── BookingRequest.java
│       │   └── BookingDTO.java (Dùng để trả về dữ liệu)
│       └── doctor/
│           └── DoctorDTO.java
│
└── src/main/resources/
    └── application.properties

```

---

### 2. Frontend (React) - BezKoder Style

**Đặc điểm:** Tách biệt hoàn toàn `services` (gọi API) và `components` (Giao diện). Không dùng folder `features`.

```text
Frontend/
├── public/
├── src/
│   ├── App.js
│   ├── index.js
│   │
│   ├── common/                  # Các file tiện ích
│   │   ├── AuthVerify.js
│   │   ├── EventBus.js
│   │   └── with-router.js       (Hỗ trợ Class component cũ, nhưng Function mới vẫn dùng utils ở đây)
│   │
│   ├── components/              # Chứa TẤT CẢ Component giao diện
│   │   ├── Login.js
│   │   ├── Register.js
│   │   ├── Home.js
│   │   ├── Profile.js
│   │   ├── BoardUser.js
│   │   ├── BoardAdmin.js
│   │   ├── DoctorList.js        # (Thêm mới cho DocBooking)
│   │   └── BookingForm.js       # (Thêm mới cho DocBooking)
│   │
│   ├── services/                # Nơi duy nhất gọi API (Axios)
│   │   ├── auth-header.js       # Hàm lấy Token từ LocalStorage
│   │   ├── auth.service.js      # Gọi API Login, Register
│   │   ├── user.service.js      # Gọi API lấy public/private content
│   │   ├── doctor.service.js    # (Thêm mới) Gọi API lấy DS bác sĩ
│   │   └── booking.service.js   # (Thêm mới) Gọi API đặt lịch
│   │
│   └── images/                  # Chứa ảnh tĩnh
│
├── package.json
└── vite.config.js (hoặc package.json cấu hình script start)

```
