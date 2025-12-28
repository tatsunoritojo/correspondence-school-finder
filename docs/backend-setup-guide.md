# Backend Setup Guide - 開発者向け手順書

## 前提条件

- Java 21 (OpenJDK or Corretto)
- Gradle 8.x
- Docker（ローカルテスト用）
- AWS CLI（デプロイ用）

## 1. 開発環境セットアップ

### Java 21 インストール

```bash
# Windows (Scoop)
scoop install openjdk21

# macOS (Homebrew)
brew install openjdk@21

# 確認
java -version
```

### プロジェクト作成

```bash
cd correspondence-school-finder
mkdir backend && cd backend

# Spring Initializr で生成、または手動で作成
```

### Gradle 依存関係

```gradle
// build.gradle
plugins {
    id 'java'
    id 'org.springframework.boot' version '3.2.1'
    id 'io.spring.dependency-management' version '1.1.4'
}

java {
    sourceCompatibility = '21'
}

dependencies {
    implementation 'org.springframework.boot:spring-boot-starter-web'
    implementation 'org.springframework.boot:spring-boot-starter-thymeleaf'
    implementation 'com.microsoft.playwright:playwright:1.40.0'
    
    // AWS S3
    implementation 'software.amazon.awssdk:s3:2.21.0'
    
    // Lombok
    compileOnly 'org.projectlombok:lombok'
    annotationProcessor 'org.projectlombok:lombok'
    
    testImplementation 'org.springframework.boot:spring-boot-starter-test'
}
```

## 2. Playwright セットアップ

### ブラウザインストール

```bash
# プロジェクトディレクトリで実行
./gradlew build
mvn exec:java -e -D exec.mainClass=com.microsoft.playwright.CLI -D exec.args="install chromium"

# または
npx playwright install chromium
```

## 3. ローカル起動

```bash
cd backend
./gradlew bootRun
```

アクセス: http://localhost:8080/health

## 4. Docker ビルド

```dockerfile
# Dockerfile
FROM eclipse-temurin:21-jdk-alpine

# Playwright dependencies
RUN apk add --no-cache \
    chromium \
    nss \
    freetype \
    freetype-dev \
    harfbuzz \
    ca-certificates \
    ttf-freefont

ENV PLAYWRIGHT_SKIP_BROWSER_DOWNLOAD=1
ENV PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH=/usr/bin/chromium-browser

WORKDIR /app
COPY build/libs/*.jar app.jar

EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]
```

```bash
# ビルド＆実行
./gradlew build
docker build -t school-finder-backend .
docker run -p 8080:8080 school-finder-backend
```

## 5. AWS デプロイ手順

### EC2 の場合

1. EC2 インスタンス作成（t3.micro, Amazon Linux 2023）
2. セキュリティグループ: 8080ポート開放
3. SSH接続してセットアップ:

```bash
# Java インストール
sudo dnf install java-21-amazon-corretto -y

# アプリケーションデプロイ
scp build/libs/*.jar ec2-user@<IP>:/home/ec2-user/
ssh ec2-user@<IP>
nohup java -jar app.jar &
```

### ECS Fargate の場合

1. ECR にイメージプッシュ
2. Task Definition 作成
3. Service 作成

## 6. フロントエンドとの接続テスト

### CORS設定

```java
@Configuration
public class CorsConfig implements WebMvcConfigurer {
    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/api/**")
            .allowedOrigins(
                "http://localhost:5173",
                "https://your-site.netlify.app"
            )
            .allowedMethods("GET", "POST", "OPTIONS");
    }
}
```

### フロントエンド環境変数

```bash
# .env.local
VITE_API_URL=http://localhost:8080

# .env.production
VITE_API_URL=https://api.your-domain.com
```

## 7. トラブルシューティング

| 問題 | 解決策 |
|------|--------|
| Playwright がブラウザを見つけられない | `playwright install chromium` を実行 |
| Docker内でフォントが文字化け | 日本語フォントをインストール |
| CORS エラー | CorsConfig を確認 |
| メモリ不足 | EC2 インスタンスサイズを上げる |
