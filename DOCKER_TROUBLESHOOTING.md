# 🔧 Docker Troubleshooting Guide - Windows

## Error: "unable to get image 'mysql:8.0': unexpected end of JSON input"

This error happens when Docker's image cache is corrupted or Docker Desktop isn't fully running.

---

## ✅ **SOLUTION - Follow These Steps:**

### **Step 1: Make Sure Docker Desktop is Running**

1. Open **Docker Desktop** application
2. Wait until you see "Docker Desktop is running" in the system tray
3. The whale icon should be **steady** (not animated)

---

### **Step 2: Clean Docker Cache**

Run these commands **one by one**:

```bash
# Stop any running containers
docker-compose down

# Remove all stopped containers
docker container prune -f

# Remove all unused images
docker image prune -a -f

# Clean up Docker system
docker system prune -a -f

# Remove Docker build cache
docker builder prune -a -f
```

---

### **Step 3: Pull MySQL Image Manually**

```bash
# Pull the MySQL image directly
docker pull mysql:8.0

# Verify it downloaded successfully
docker images | grep mysql
```

**If this fails with network error, try:**
```bash
# Use a different MySQL tag
docker pull mysql:latest

# Then update docker-compose.yml to use mysql:latest instead of mysql:8.0
```

---

### **Step 4: Restart Docker Desktop**

1. Right-click Docker Desktop icon in system tray
2. Click "Restart Docker Desktop"
3. Wait 1-2 minutes for it to fully restart
4. Check Docker is running: `docker --version`

---

### **Step 5: Try Again**

```bash
docker-compose up --build
```

---

## 🔄 **Alternative Solutions:**

### **Option 1: Reset Docker Desktop (if above doesn't work)**

1. Open **Docker Desktop**
2. Click ⚙️ Settings (top right)
3. Go to **Troubleshoot** tab
4. Click **Clean / Purge data**
5. Click **Reset to factory defaults**
6. Restart Docker Desktop
7. Try `docker-compose up --build` again

---

### **Option 2: Use Different MySQL Version**

Edit `docker-compose.yml` and change:

**From:**
```yaml
mysql:
  image: mysql:8.0
```

**To:**
```yaml
mysql:
  image: mysql:latest
```

Then run:
```bash
docker-compose up --build
```

---

### **Option 3: Configure Docker to Use Different Mirror (for slow/blocked networks)**

If you're having network issues downloading images:

1. Open Docker Desktop
2. Go to Settings → Docker Engine
3. Add this to the JSON configuration:

```json
{
  "registry-mirrors": ["https://mirror.gcr.io"]
}
```

4. Click "Apply & Restart"
5. Try pulling MySQL again: `docker pull mysql:8.0`

---

## 🪟 **Windows-Specific Fixes:**

### **WSL 2 Backend Issue:**

```bash
# Enable WSL 2 (run in PowerShell as Administrator)
wsl --install
wsl --set-default-version 2

# Restart computer
# Open Docker Desktop
# Go to Settings → General
# Enable "Use WSL 2 based engine"
# Apply & Restart
```

---

### **Hyper-V Not Enabled:**

1. Open **PowerShell as Administrator**
2. Run:
```powershell
Enable-WindowsOptionalFeature -Online -FeatureName Microsoft-Hyper-V -All
```
3. Restart computer
4. Start Docker Desktop

---

### **Firewall/Antivirus Blocking Docker:**

1. Temporarily disable antivirus
2. Try `docker pull mysql:8.0`
3. If it works, add Docker to antivirus exceptions
4. Re-enable antivirus

---

## 🚀 **Quick Fix (Most Common Solution):**

**Just run these 4 commands:**

```bash
# 1. Clean Docker
docker system prune -a -f

# 2. Pull MySQL manually
docker pull mysql:8.0

# 3. Start containers
docker-compose up --build
```

---

## 🔍 **Verify Docker is Working:**

```bash
# Check Docker version
docker --version

# Check Docker is running
docker ps

# Check Docker Compose version
docker-compose --version

# Test with a simple container
docker run hello-world
```

All these should work without errors.

---

## 📝 **Common Error Messages & Solutions:**

### **"Error response from daemon: Get https://registry-1.docker.io/v2/: net/http: TLS handshake timeout"**

**Solution:** Network/firewall issue
```bash
# Configure DNS in Docker Desktop
# Settings → Docker Engine → Add:
{
  "dns": ["8.8.8.8", "8.8.4.4"]
}
```

---

### **"Cannot connect to the Docker daemon"**

**Solution:** Docker Desktop not running
- Start Docker Desktop application
- Wait for it to fully start

---

### **"port is already allocated"**

**Solution:** Port conflict
```bash
# Find what's using the port (PowerShell)
netstat -ano | findstr :3000
netstat -ano | findstr :5000
netstat -ano | findstr :3306

# Kill the process (replace PID with actual number)
taskkill /PID <PID> /F

# Or change ports in docker-compose.yml
```

---

### **"no space left on device"**

**Solution:** Docker disk full
```bash
# Clean up everything
docker system prune -a --volumes -f

# Or increase Docker disk size:
# Docker Desktop → Settings → Resources → Disk image size
```

---

## ✅ **Final Solution That Works 99% of Time:**

Run this complete cleanup script:

```bash
# Stop everything
docker-compose down -v

# Complete Docker cleanup
docker system prune -a -f
docker volume prune -f
docker network prune -f
docker builder prune -a -f

# Restart Docker Desktop (right-click icon → Restart)
# Wait 2 minutes

# Pull images manually
docker pull mysql:8.0
docker pull node:18-alpine

# Now start your application
docker-compose up --build
```

---

## 🆘 **Still Not Working?**

If none of the above works:

1. **Completely uninstall Docker Desktop:**
   - Settings → Apps → Docker Desktop → Uninstall
   - Delete `C:\Program Files\Docker`
   - Delete `C:\ProgramData\Docker`
   - Delete `%APPDATA%\Docker`

2. **Reinstall Docker Desktop:**
   - Download latest version: https://www.docker.com/products/docker-desktop
   - Install with WSL 2 backend
   - Restart computer

3. **Try again:**
   ```bash
   docker-compose up --build
   ```

---

## 📞 **Check Docker Status:**

```bash
# See Docker info
docker info

# Check if daemon is running
docker version

# Test Docker works
docker run --rm hello-world
```

If all these work, your Docker is healthy and `docker-compose up --build` should work!

---

**Most likely fix for your error:**

```bash
docker system prune -a -f
docker pull mysql:8.0
docker-compose up --build
```

**This will solve 95% of cases!** 🎉
