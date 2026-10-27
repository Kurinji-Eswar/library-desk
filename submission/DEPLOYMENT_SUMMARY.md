# 🚀 Deployment Summary: LIBRARY / DESK

---

## 1. Local Deployment Reproducibility

The system is 100% reproducible on local machines.

### Execution Commands (PowerShell / Windows)
```powershell
# 1. Install frontend dependencies
npm install

# 2. Run backend automated tests
npm run backend:test

# 3. Build backend Spring Boot JAR
npm run backend:build

# 4. Start backend on port 8080
npm run backend:start

# 5. Start frontend dev server on port 5173
npm run dev
```

---

## 2. Cloud Deployment Topology

1. **Frontend**:
   - Hosted on GitHub Pages: [https://kurinji-eswar.github.io/library-desk/](https://kurinji-eswar.github.io/library-desk/)
   - Built via `npm run build` with assets in `dist/`.
2. **Backend**:
   - Containerized or executable Spring Boot JAR (`target/library-desk-backend-1.0.0.jar`).
   - Runs on Java 21 LTS environment (e.g. Render, Railway, AWS EC2, or Docker).
3. **Database**:
   - PostgreSQL database with schema versioning managed via Flyway.
   - Externalized connection via `DB_URL`, `DB_USERNAME`, `DB_PASSWORD`.
