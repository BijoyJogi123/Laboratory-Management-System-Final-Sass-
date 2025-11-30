# 🚀 Quick Start with Docker

Run the entire Laboratory Management System with just **ONE COMMAND**!

## Prerequisites
- Install Docker Desktop: https://docs.docker.com/get-docker/

## Start the Application

```bash
docker-compose up --build
```

That's it! Wait 2-3 minutes for everything to start.

## Access the Application

Open your browser to: **http://localhost:3000**

**Login Credentials:**
- Email: `test@lab.com`
- Password: `Test@123`

## What's Running?

- 🗄️ **MySQL Database** on port 3306
- 🔧 **Backend API** on port 5000
- 🎨 **Frontend App** on port 3000

## Stop the Application

Press `Ctrl+C` or run:
```bash
docker-compose down
```

## Need Help?

See full documentation: [DOCKER_SETUP.md](./DOCKER_SETUP.md)

---

**That's all you need!** The database is automatically created and initialized with the schema. Everything just works! 🎉
