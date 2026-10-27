# 🚀 Deployment Guide: LIBRARY / DESK

---

## 1. Prerequisites

- **Java**: Java 21 LTS or compatible (Java 21+)
- **Maven**: Apache Maven 3.9+
- **Node.js**: v18+ or v22+ (npm v9+)
- **PostgreSQL**: PostgreSQL 15, 16, or 18

---

## 2. Quick Start: Local Development (Windows / PowerShell)

### Step 1: Database Setup
Make sure PostgreSQL is running on port 5432. Create the database:
```powershell
& "C:\Program Files\PostgreSQL\18\bin\psql.exe" -U postgres -h localhost -p 5432 -c "CREATE DATABASE library_desk;"
```

### Step 2: Configure Environment Variables
Copy `.env.example` to `.env`:
```powershell
Copy-Item .env.example .env
```
Default connection parameters in `application.properties`:
- `DB_URL`: `jdbc:postgresql://localhost:5432/library_desk`
- `DB_USERNAME`: `postgres`
- `DB_PASSWORD`: `postgres` (or your local postgres password)

### Step 3: Run Backend Tests
From the repository root:
```powershell
npm run backend:test
```
*(Or directly: `mvn -f backend/pom.xml test`)*

### Step 4: Build & Start Spring Boot Backend
```powershell
npm run backend:build
npm run backend:start
```
The backend initializes the database schema automatically via Flyway and starts on:
**[http://localhost:8080](http://localhost:8080)**  
Swagger Documentation: **[http://localhost:8080/swagger-ui.html](http://localhost:8080/swagger-ui.html)**  
Health Endpoint: **[http://localhost:8080/actuator/health](http://localhost:8080/actuator/health)**

### Step 5: Start React Frontend
In a separate terminal:
```powershell
npm run dev
```
Open **[http://localhost:5173](http://localhost:5173)** in your browser.  
Notice the top status badge reads **SPRING BOOT + POSTGRESQL ONLINE**!

---

## 3. Production Deployment Architecture

```
[GitHub Pages / Vercel / Netlify] (Static React Build: dist/)
                 |
         HTTPS REST Requests
                 v
[Render / Railway / AWS EC2] (Spring Boot JAR: library-desk-backend-1.0.0.jar)
                 |
       JDBC Connection (HikariCP)
                 v
[Managed PostgreSQL: Neon / Supabase / AWS RDS]
```

### Building Production Bundles
```powershell
# Frontend production bundle (Vite)
npm run build

# Backend production JAR (Maven)
npm run backend:build
```

### Deploying Frontend to GitHub Pages
```powershell
npm run deploy
```
*(Deploys the built `dist/` directory to the `gh-pages` branch).*

---

## 4. Troubleshooting

| Symptom | Cause | Solution |
| :--- | :--- | :--- |
| `Cannot connect to Spring Boot backend` in UI toast | Backend not running on port 8080 | Run `npm run backend:start` in a terminal. |
| `psql: FATAL: password authentication failed` | PostgreSQL password differs from default | Set environment variable `$env:DB_PASSWORD="yourpassword"` before starting backend. |
| `Address already in use: bind` | Port 8080 occupied | Check `netstat -ano \| findstr :8080` and terminate lingering processes. |
