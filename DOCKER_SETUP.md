# 🐳 Docker Setup Guide - Laboratory Management System

This guide will help you run the entire Laboratory Management System using Docker containers.

## 📦 What's Included

This Docker setup includes **3 containers**:
1. **MySQL 8.0** - Database container with auto-initialization
2. **Backend (Node.js)** - Express API server
3. **Frontend (React)** - React application

## 🚀 Quick Start (One Command!)

### Prerequisites
- Docker installed ([Download Docker](https://docs.docker.com/get-docker/))
- Docker Compose installed (usually comes with Docker Desktop)

### Step 1: Clone and Navigate
```bash
cd Laboratory-Management-System-Final-Sass-
```

### Step 2: Start Everything
```bash
docker-compose up --build
```

That's it! The application will:
- ✅ Create MySQL database automatically
- ✅ Import database schema
- ✅ Start backend API on `http://localhost:5000`
- ✅ Start frontend app on `http://localhost:3000`

### Step 3: Access the Application
Open your browser to:
```
http://localhost:3000
```

Login with:
- **Email:** test@lab.com
- **Password:** Test@123

---

## 🎯 Docker Commands

### Start the application
```bash
docker-compose up
```

### Start in background (detached mode)
```bash
docker-compose up -d
```

### Stop the application
```bash
docker-compose down
```

### Stop and remove all data (including database)
```bash
docker-compose down -v
```

### View logs
```bash
# All containers
docker-compose logs

# Specific container
docker-compose logs backend
docker-compose logs frontend
docker-compose logs mysql

# Follow logs (live)
docker-compose logs -f backend
```

### Rebuild containers (after code changes)
```bash
docker-compose up --build
```

### Restart a specific service
```bash
docker-compose restart backend
docker-compose restart frontend
```

---

## 📊 Container Details

### MySQL Container
- **Container Name:** `lab-mysql`
- **Port:** `3306` (exposed to host)
- **Database:** `laboratory`
- **Root Password:** `Cyberdumb#123`
- **User:** `labuser`
- **Password:** `Lab@2024`
- **Data Volume:** Persisted in Docker volume `mysql_data`

### Backend Container
- **Container Name:** `lab-backend`
- **Port:** `5000` (exposed to host)
- **API URL:** `http://localhost:5000`
- **Health Check:** `http://localhost:5000/api/health`
- **Hot Reload:** Enabled (code changes auto-restart)

### Frontend Container
- **Container Name:** `lab-frontend`
- **Port:** `3000` (exposed to host)
- **App URL:** `http://localhost:3000`
- **Hot Reload:** Enabled (code changes auto-refresh)

---

## 🔧 Environment Variables

All environment variables are configured in `docker-compose.yml`. You can override them by creating a `.env` file in the root directory:

```env
# Database
MYSQL_ROOT_PASSWORD=Cyberdumb#123
MYSQL_DATABASE=laboratory
MYSQL_USER=labuser
MYSQL_PASSWORD=Lab@2024

# Backend
JWT_SECRET=Boom#123
NODE_ENV=production

# Frontend
REACT_APP_API_URL=http://localhost:5000
```

---

## 🗄️ Database Management

### Access MySQL CLI inside container
```bash
docker exec -it lab-mysql mysql -u root -p
# Password: Cyberdumb#123
```

### Import additional SQL files
```bash
docker exec -i lab-mysql mysql -u root -pCyberdumb#123 laboratory < your-file.sql
```

### Backup database
```bash
docker exec lab-mysql mysqldump -u root -pCyberdumb#123 laboratory > backup.sql
```

### Restore database
```bash
docker exec -i lab-mysql mysql -u root -pCyberdumb#123 laboratory < backup.sql
```

### View database logs
```bash
docker-compose logs mysql
```

---

## 🔍 Troubleshooting

### Port Already in Use
If you get "port already in use" error:

**Option 1: Stop conflicting services**
```bash
# Find process using port 3306 (MySQL)
lsof -i :3306
kill -9 <PID>

# Find process using port 5000 (Backend)
lsof -i :5000
kill -9 <PID>

# Find process using port 3000 (Frontend)
lsof -i :3000
kill -9 <PID>
```

**Option 2: Change ports in docker-compose.yml**
```yaml
mysql:
  ports:
    - "3307:3306"  # Use port 3307 on host

backend:
  ports:
    - "5001:5000"  # Use port 5001 on host

frontend:
  ports:
    - "3001:3000"  # Use port 3001 on host
```

### Database Connection Failed
```bash
# Check if MySQL container is running
docker ps

# Check MySQL logs
docker-compose logs mysql

# Restart MySQL container
docker-compose restart mysql

# Check database health
docker exec -it lab-mysql mysqladmin ping -h localhost -u root -pCyberdumb#123
```

### Backend Can't Connect to Database
```bash
# Ensure containers are on same network
docker network inspect laboratory-management-system-final-sass-_lab-network

# Check backend logs
docker-compose logs backend

# Restart backend after MySQL is ready
docker-compose restart backend
```

### Frontend Shows API Errors
```bash
# Check backend is running
curl http://localhost:5000/api/health

# Check frontend logs
docker-compose logs frontend

# Rebuild frontend
docker-compose up --build frontend
```

### Clear Everything and Start Fresh
```bash
# Stop all containers
docker-compose down

# Remove all volumes (WARNING: Deletes database data!)
docker-compose down -v

# Remove all images
docker-compose down --rmi all

# Rebuild and start
docker-compose up --build
```

---

## 🔄 Development Workflow

### Making Code Changes

**Backend Changes:**
1. Edit files in `backend/` directory
2. Container auto-restarts with changes
3. Check logs: `docker-compose logs -f backend`

**Frontend Changes:**
1. Edit files in `laboratory/` directory
2. Browser auto-refreshes with changes
3. Check logs: `docker-compose logs -f frontend`

**Database Schema Changes:**
1. Update `DATABASE_SCHEMA_UPGRADE.sql`
2. Rebuild containers: `docker-compose down -v && docker-compose up --build`

### Install New NPM Packages

**Backend:**
```bash
# Stop containers
docker-compose down

# Install package locally
cd backend
npm install <package-name>

# Rebuild backend container
docker-compose up --build backend
```

**Frontend:**
```bash
# Stop containers
docker-compose down

# Install package locally
cd laboratory
npm install <package-name>

# Rebuild frontend container
docker-compose up --build frontend
```

---

## 📈 Performance Tips

### Optimize Build Time
- Add files to `.dockerignore` to exclude from build context
- Use `docker-compose up -d` to run in background
- Use `docker system prune` to clean up unused images/containers

### Monitor Resource Usage
```bash
# View resource usage
docker stats

# View container details
docker ps
```

---

## 🎓 What Happens on First Run

1. **MySQL Container Starts**
   - Creates database `laboratory`
   - Imports schema from `DATABASE_SCHEMA_UPGRADE.sql`
   - Runs initialization script `docker/mysql/init.sql`
   - Creates user `labuser` with password `Lab@2024`

2. **Backend Container Starts**
   - Waits for MySQL to be healthy
   - Installs Node.js dependencies
   - Connects to MySQL database
   - Starts Express server on port 5000

3. **Frontend Container Starts**
   - Waits for backend to be ready
   - Installs Node.js dependencies
   - Starts React dev server on port 3000
   - Connects to backend API

---

## ✅ Verification Steps

After running `docker-compose up`, verify everything is working:

### 1. Check all containers are running
```bash
docker ps
```
You should see 3 containers: `lab-mysql`, `lab-backend`, `lab-frontend`

### 2. Check backend health
```bash
curl http://localhost:5000/api/health
```
Should return status "OK"

### 3. Check frontend
Open browser to `http://localhost:3000` - You should see the login page

### 4. Test database connection
```bash
docker exec -it lab-mysql mysql -u labuser -pLab@2024 -e "USE laboratory; SHOW TABLES;"
```
Should list all database tables

### 5. Test login
- Go to `http://localhost:3000`
- Login with `test@lab.com` / `Test@123`
- You should reach the dashboard

---

## 🎉 Success!

If all verification steps pass, your Laboratory Management System is running successfully in Docker!

**Access URLs:**
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000
- Health Check: http://localhost:5000/api/health
- MySQL: localhost:3306

**Login Credentials:**
- Email: test@lab.com
- Password: Test@123

---

## 📝 Notes

- All data is persisted in Docker volumes (survives container restarts)
- Use `docker-compose down -v` to completely reset (deletes all data)
- Logs are available via `docker-compose logs`
- Hot reload is enabled for both frontend and backend
- Database is automatically initialized on first run

**Enjoy your Dockerized Laboratory Management System! 🚀**
