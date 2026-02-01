
# Restaurant Managment (Frontend+Backend)

A full-stack restaurant management application with a modern admin panel, built with MongoDB, Mongoose, Node.js, AdminJS, and React/Next.js. Designed to manage all aspects of a restaurant, from menu items to tables and orders, while providing interactive statistics and analytics for administrators.


## Demo

![DEMO 1](./assets/demo1.gif)
![DEMO 2](./assets/demo2.gif)


## Features

- **User Management**: Add, edit, and manage restaurant staff and customers.
- **Menu Management**: Organize categories and products with images, prices, and units.
- **Order & Table Management**: Track active orders, reservations, table assignments, and statuses.
- **Interactive Dashboard**:
  - Line chart for daily orders and revenue
  - Pie chart for orders by type
  - Doughnut chart for orders by status
  - Tables showing top users and top-selling products
- **Modern UI**: Responsive, compact cards and charts with gradients, shadows, and hover effects.

### Backend
- **MongoDB + Mongoose**: Efficient database models for users, tables, orders, products, and categories.
- **Node.js + Express**: RESTful APIs for managing all resources and analytics.
- **Secure Authentication**: User passwords hashed using bcrypt.

### Frontend
- **React / Next.js**: Clean and responsive interface for customers, staff, and admins.
- **Real-time Data**: Fetches live analytics and updates from backend APIs.
- **Modern Design**: Intuitive UI that matches the admin panel’s professional look.

### Additional Features
- **CRUD Operations**: Full create, read, update, delete capabilities for all resources.
- **Statistics & Analytics**: Key KPIs displayed for quick insights.
## Setup & Environment Variables

This project uses **Docker**, **Docker Compose**, **Next.js (frontend)**, **Express (backend)**, and **MongoDB**. Two Docker configurations are provided:

* **Default (Production-like)** – optimized for running the app normally
* **Development** – hot reload, mounted volumes, and dev servers

---

## Prerequisites

Make sure you have the following installed:

* **Docker** (v20+ recommended)
* **Docker Compose** (v2+)
* **Git**

---

## Project Structure

```
restaurant-management/
├── backend/
│   ├── Dockerfile
│   ├── Dockerfile.dev
│   └── ...
├── frontend/
│   ├── Dockerfile
│   ├── Dockerfile.dev
│   └── ...
├── docker-compose.yml        # default / production-like
├── docker-compose.dev.yml    # development
└── README.md
```

---

## Environment Variables

### Backend

| Variable         | Description               | Example                               |
| ---------------- | ------------------------- | ------------------------------------- |
| `MONGODB_URL`    | MongoDB connection string | `mongodb://mongo:27017/restaurant-db` |
| `PORT`           | Backend server port       | `8000`                                |
| `ADMIN_LOGIN`    | Initial AdminJS login     | `admin`                               |
| `ADMIN_PASSWORD` | Initial AdminJS password  | `admin`                               |
| `PRIVATE_KEY`    | JWT / auth private key    | `dev-secret-key`                      |
| `NODE_ENV`       | Environment mode          | `development` / `production`          |

### Frontend

| Variable   | Description          | Example                      |
| ---------- | -------------------- | ---------------------------- |
| `API_URL`  | Backend API base URL | `http://backend:8000`        |
| `NODE_ENV` | Environment mode     | `development` / `production` |

> ⚠️ **Security Note**: Never use default credentials or weak secrets in production.

---

## Running with Docker (Default / Production-like)

This setup builds optimized production images.

### Start the application

```bash
docker compose up --build
```

### Services

* **Frontend** → [http://localhost:3000](http://localhost:3000)
* **Backend API** → [http://localhost:8000](http://localhost:8000)
* **MongoDB** → localhost:27017

### Default Docker Compose

```yaml
services:
  mongo:
    image: mongo:6
    container_name: restaurant-mongo
    restart: unless-stopped
    ports:
      - "27017:27017"
    volumes:
      - mongo-data:/data/db

  backend:
    build: ./backend
    container_name: restaurant-backend
    restart: unless-stopped
    ports:
      - "8000:8000"
    environment:
      - MONGODB_URL=mongodb://mongo:27017/restaurant-db
      - PORT=8000
      - ADMIN_LOGIN=admin
      - ADMIN_PASSWORD=admin
      - PRIVATE_KEY=dev-secret-key
    depends_on:
      - mongo

  frontend:
    build: ./frontend
    container_name: restaurant-frontend
    ports:
      - "3000:3000"
    environment:
      - API_URL=http://backend:8000
    depends_on:
      - backend

volumes:
  mongo-data: {}
```

---

## Running in Development Mode

Development mode enables **hot reload**, **mounted volumes**, and faster iteration.

### Start development environment

```bash
docker compose -f docker-compose.dev.yml up --build
```

### Development Docker Compose

```yaml
services:
  mongo:
    image: mongo:6
    container_name: restaurant-mongo-dev
    restart: unless-stopped
    ports:
      - "27017:27017"
    volumes:
      - mongo-data:/data/db

  backend:
    image: restaurant-backend-dev
    build:
      context: ./backend
      dockerfile: Dockerfile.dev
    container_name: restaurant-backend-dev
    ports:
      - "8000:8000"
    environment:
      MONGODB_URL: mongodb://mongo:27017/restaurant-db
      PORT: 8000
      ADMIN_LOGIN: admin
      ADMIN_PASSWORD: admin
      PRIVATE_KEY: dev-secret-key
      NODE_ENV: development
    depends_on:
      - mongo
    volumes:
      - ./backend:/app
      - /app/node_modules
    command: npm run dev

  frontend:
    image: restaurant-frontend-dev
    build:
      context: ./frontend
      dockerfile: Dockerfile.dev
    container_name: restaurant-frontend-dev
    ports:
      - "3000:3000"
    environment:
      API_URL: http://backend:8000
      NODE_ENV: development
    depends_on:
      - backend
    volumes:
      - ./frontend:/app
      - /app/node_modules
    command: npm run dev

volumes:
  mongo-data:
```

---

## Admin Panel Access

After startup, access the AdminJS panel using:

* **URL**: `http://localhost:8000/admin`
* **Login**: `ADMIN_LOGIN`
* **Password**: `ADMIN_PASSWORD`

---

## Stopping Containers

```bash
docker compose down
```

To remove volumes (⚠️ deletes database data):

```bash
docker compose down -v
```

---

## Notes

* MongoDB data is persisted using Docker volumes
* Backend waits for MongoDB via Docker dependency order
* Frontend communicates with backend using internal Docker networking

This setup is suitable for **local development**, **portfolio demos**, and **production deployment** with minimal changes.
