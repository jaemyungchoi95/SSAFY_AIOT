FROM eclipse-temurin:21-jdk AS build

WORKDIR /app
COPY . .
RUN chmod +x mvnw && ./mvnw clean package -DskipTests

FROM eclipse-temurin:21-jdk
WORKDIR /app
COPY --from=build /app/target/*.jar app.jar

# .lck 저장용 디렉토리 생성 및 권한 부여
RUN mkdir -p /app/data && chmod 777 /app/data

ENTRYPOINT ["java", "-Duser.timezone=Asia/Seoul", "-jar", "app.jar"]