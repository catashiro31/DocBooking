# ==========================================
# Giai đoạn 1: Build ứng dụng (Maven)
# ==========================================
# Cập nhật sang maven dùng thư viện eclipse-temurin
FROM maven:3.8.5-eclipse-temurin-17 AS build

WORKDIR /app
COPY pom.xml .
RUN mvn dependency:go-offline -B
COPY src ./src
RUN mvn clean package -DskipTests

# ==========================================
# Giai đoạn 2: Chạy ứng dụng (JRE)
# ==========================================
# Thay thế openjdk bằng eclipse-temurin (bản JRE cực nhẹ dành riêng để chạy code)
FROM eclipse-temurin:17-jre-jammy

WORKDIR /app
COPY --from=build /app/target/*.jar app.jar

# Render sử dụng biến môi trường $PORT để gán cổng động.
# Lệnh này đảm bảo Spring Boot sẽ nghe ở cổng mà Render yêu cầu.
# Mặc định Spring Boot chạy 8080, lệnh này sẽ override nó.
ENTRYPOINT ["java", "-Dserver.port=${PORT:5020}", "-jar", "app.jar"]