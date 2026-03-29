# ==========================================
# Giai đoạn 1: Build ứng dụng (Maven)
# ==========================================
# Sử dụng image Maven chính thức với JDK 17 (hoặc bản bạn đang dùng) bản slim để nhẹ
FROM maven:3.8.5-openjdk-17-slim AS build

# Đặt thư mục làm việc bên trong container
WORKDIR /app

# Copy file pom.xml trước để tải các thư viện (dependencies)
# Việc này giúp tận dụng cache của Docker, lần build sau sẽ nhanh hơn nếu pom.xml không đổi
COPY pom.xml .

# Tải trước các thư viện cần thiết (có thể bỏ qua bước này nhưng khuyên dùng)
RUN mvn dependency:go-offline -B

# Copy toàn bộ mã nguồn (thư mục src) vào container
COPY src ./src

# Tiến hành đóng gói ứng dụng thành file .jar, bỏ qua chạy Tests để build nhanh hơn
RUN mvn clean package -DskipTests

# ==========================================
# Giai đoạn 2: Chạy ứng dụng (JRE)
# ==========================================
# Sử dụng image OpenJDK JRE bản slim (chỉ có môi trường chạy, không có công cụ build)
# Giúp giảm kích thước image cuối cùng xuống tối đa
FROM openjdk:17-jdk-slim

# Đặt thư mục làm việc
WORKDIR /app

# Copy file .jar đã được build từ Giai đoạn 1 sang Giai đoạn 2
# Lưu ý: Sửa lại tên file .jar cho đúng với tên trong pom.xml của bạn (artifactId-version.jar)
# Nếu không chắc chắn, bạn có thể dùng dấu * như dưới đây:
COPY --from=build /app/target/*.jar app.jar

# Render sử dụng biến môi trường $PORT để gán cổng động.
# Lệnh này đảm bảo Spring Boot sẽ nghe ở cổng mà Render yêu cầu.
# Mặc định Spring Boot chạy 8080, lệnh này sẽ override nó.
ENTRYPOINT ["java", "-Dserver.port=${PORT:5020}", "-jar", "app.jar"]