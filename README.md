```markdown
# 🧪 Petrolab Inventory Management System

<div align="center">
  <img src="web/client/public/petrolab_icon.jpg" alt="Petrolab Logo" width="200">
  <h3>Professional Laboratory Inventory Management System</h3>
  <p>Built with Express.js, React.js, and React Native</p>
</div>

---

## 📋 Table of Contents

- [About The Project](#-about-the-project)
- [Features](#-features)
- [Technology Stack](#-technology-stack)
- [Requirements](#-requirements)
- [Installation Guide](#-installation-guide)
- [Configuration](#-configuration)
- [Database Setup](#-database-setup)
- [Running the Application](#-running-the-application)
- [Default Accounts](#-default-accounts)
- [Project Structure](#-project-structure)
- [API Documentation](#-api-documentation)
- [Troubleshooting](#-troubleshooting)
- [License](#-license)

---

## 🎯 About The Project

**Petrolab Inventory Management System** is a comprehensive inventory management solution designed for laboratory and industrial needs. This system manages inventory items with role-based access control, real-time stock tracking, and reporting capabilities.

### Key Highlights:
- ✅ Complete inventory management (CRUD operations)
- ✅ Role-based access (Admin & User)
- ✅ Real-time stock tracking
- ✅ Export reports to Excel & PDF
- ✅ JWT Authentication
- ✅ Responsive Web Design
- ✅ Mobile App Support (React Native)

---

## ✨ Features

### 🔐 Authentication System
- Multi-role authentication (Admin, User)
- JWT token-based authentication
- Secure password hashing with bcrypt
- Auto logout on token expiration

### 📊 Dashboard

#### User Dashboard
- Total items owned by user
- Total stock quantity
- Total inventory value
- Low stock alerts
- Recent items list
- Quick action buttons

#### Admin Dashboard
- Total all items across users
- Total stock quantity (all users)
- Total inventory value (all users)
- Low stock items monitoring
- Recent items from all users
- Category distribution

### 📦 Inventory Management

#### User Features
- View my items list
- Add new items to inventory
- Edit my existing items
- Delete my items
- Search and filter items
- View item details

#### Admin Features
- View ALL items (all users)
- Create items for any user
- Edit any item
- Delete any item
- Manage user accounts
- Change user roles
- Export reports

### 📋 Categories
- Free-text category input
- No predefined category limits
- Flexible categorization

### 📊 Reports (Admin Only)
- Export inventory data to **Excel** (.xlsx)
- Export inventory data to **PDF**
- Filter reports by:
  - Category
  - Search by name
  - Quantity range (min/max)
  - Price range (min/max)
  - Date range (from/to)
  - Sort by (name, category, quantity, price, date)
- Summary statistics included in exports

### 👥 Role-Based Access

| Feature | Admin | User |
|---------|-------|------|
| View own items | ✅ | ✅ |
| View all items | ✅ | ❌ |
| Create items | ✅ | ✅ |
| Edit own items | ✅ | ✅ |
| Edit all items | ✅ | ❌ |
| Delete own items | ✅ | ✅ |
| Delete all items | ✅ | ❌ |
| Manage users | ✅ | ❌ |
| Export reports | ✅ | ❌ |
| View dashboard | ✅ | ✅ |

---

## 🛠 Technology Stack

### Backend (Server)
- **Node.js** - JavaScript runtime
- **Express.js** - Web framework
- **Sequelize** - ORM for MySQL
- **MySQL** - Database
- **JWT** - Authentication
- **bcryptjs** - Password hashing
- **cors** - Cross-origin resource sharing
- **helmet** - Security headers

### Frontend Web (Client)
- **React.js** - UI library
- **Tailwind CSS** - Styling
- **Axios** - HTTP client
- **React Router DOM** - Routing
- **React Hot Toast** - Notifications
- **XLSX** - Excel export
- **jsPDF** - PDF export

### Mobile App (Coming Soon)
- **React Native** - Mobile framework
- **Expo** - Development platform

---

## 📋 Requirements

Before installing, make sure you have:

- **Node.js** >= 18.0
- **npm** >= 9.0 or **yarn** >= 1.22
- **MySQL** >= 5.7 or **MariaDB** >= 10.2
- **Git** (for cloning)

### Recommended Requirements
- **Node.js** 20 LTS or higher
- **MySQL** 8.0
- **RAM** minimum 2GB
- **Storage** minimum 500MB

---

## 🚀 Installation Guide

### Step 1: Clone the Repository

```bash
git clone https://github.com/yourusername/petrolab-inventory.git
cd petrolab-inventory
```

### Step 2: Backend Setup

```bash
# Navigate to server folder
cd server

# Install dependencies
npm install

# Copy environment file
cp .env.example .env

# If .env.example doesn't exist, create .env manually
```

### Step 3: Configure Backend Environment

Edit the `.env` file in the `server` folder:

```env
PORT=5000
NODE_ENV=development

# Database MySQL
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password_here
DB_NAME=inventory_db

# JWT Configuration
JWT_SECRET=super_secret_key_change_this_in_production_12345
JWT_EXPIRES_IN=7d

# Password Hashing
BCRYPT_ROUNDS=10

# Frontend URLs (for CORS)
CLIENT_URL=http://localhost:3000
MOBILE_URL=http://localhost:8081
```

### Step 4: Create Database

```bash
# Login to MySQL
mysql -u root -p

# Create database
CREATE DATABASE inventory_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

# Verify database created
SHOW DATABASES;

# Exit MySQL
exit;
```

### Step 5: Run Database Migrations

```bash
# In server folder
npm run migrate:latest
```

Expected output:
```
✅ Database connection established successfully.
✅ Models initialized successfully
Batch 1 run: 2 migrations
```

### Step 6: Run Seeders (Optional but Recommended)

```bash
# In server folder
npm run seed:run
```

This will create:
- Admin user (admin@example.com / admin123)
- Regular user (test@example.com / password123)
- Demo items for testing

### Step 7: Start Backend Server

```bash
# In server folder
npm run dev
```

Expected output:
```
🚀 Server running on http://localhost:5000
📝 Environment: development
📦 API Base URL: http://localhost:5000/api
💾 Auto database creation: ENABLED
✨ Ready to accept requests!
```

### Step 8: Verify Backend is Running

Open browser and go to:
```
http://localhost:5000/health
```

Or use curl:
```bash
curl http://localhost:5000/health
```

Expected response:
```json
{
  "status": "OK",
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

### Step 9: Frontend Web Setup

```bash
# Open new terminal, navigate to web client folder
cd web/client

# Install dependencies
npm install

# Create environment file
echo "REACT_APP_API_URL=http://localhost:5000/api" > .env

# Verify .env file created
cat .env
```

### Step 10: Start Frontend Web

```bash
# In web/client folder
npm start
```

Expected output:
```
Compiled successfully!

You can now view client in the browser.
Local:            http://localhost:3000
On Your Network:  http://192.168.x.x:3000
```

### Step 11: Access the Application

Open your browser and go to:
```
http://localhost:3000
```

### Step 12: Login to Application

Use one of the default accounts (see [Default Accounts](#-default-accounts) section)

---

## ⚙️ Configuration

### Backend Configuration

| Variable | Description | Default |
|----------|-------------|---------|
| `PORT` | Port server | 5000 |
| `NODE_ENV` | Environment (development/production) | development |
| `DB_HOST` | MySQL host | localhost |
| `DB_USER` | MySQL username | root |
| `DB_PASSWORD` | MySQL password | - |
| `DB_NAME` | Database name | inventory_db |
| `JWT_SECRET` | Secret key for JWT | - |
| `JWT_EXPIRES_IN` | Token expiration time | 7d |
| `BCRYPT_ROUNDS` | Salt rounds for bcrypt | 10 |

### Frontend Configuration

| Variable | Description | Default |
|----------|-------------|---------|
| `REACT_APP_API_URL` | Backend API URL | http://localhost:5000/api |
| `REACT_APP_NAME` | Application name | Petrolab Inventory |
| `REACT_APP_VERSION` | Application version | 1.0.0 |

### CORS Configuration (Backend)

For mobile app access, update CORS in `server/app.js`:

```javascript
app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:8081', 'http://192.168.x.x:3000'],
  credentials: true,
}));
```

---

## 💾 Database Setup

### Database Commands

| Command | Description |
|---------|-------------|
| `npm run migrate:latest` | Run all pending migrations |
| `npm run migrate:rollback` | Rollback last migration |
| `npm run migrate:undo:all` | Rollback all migrations |
| `npm run seed:run` | Run all seeders |
| `npm run seed:undo` | Rollback last seeder |

### Reset Database

```bash
# Method 1: Rollback and migrate
npm run migrate:undo:all
npm run migrate:latest
npm run seed:run

# Method 2: Drop and recreate database
mysql -u root -p -e "DROP DATABASE inventory_db; CREATE DATABASE inventory_db;"
npm run migrate:latest
npm run seed:run
```

### Backup Database

```bash
# Backup to SQL file
mysqldump -u root -p inventory_db > backup_inventory.sql

# Restore from backup
mysql -u root -p inventory_db < backup_inventory.sql
```

---

## 🏃 Running the Application

### Development Mode

**Terminal 1 - Backend:**
```bash
cd server
npm run dev
# Runs on http://localhost:5000
```

**Terminal 2 - Frontend Web:**
```bash
cd web/client
npm start
# Runs on http://localhost:3000
```

### Production Mode

**Backend:**
```bash
cd server
npm start
```

**Frontend Web:**
```bash
cd web/client
npm run build
# Serve the build folder with a static server like serve
npx serve -s build -l 3000
```

### Quick Start (Both Servers)

**Windows (PowerShell):**
```powershell
# Terminal 1
cd server; npm run dev

# Terminal 2 (new window)
cd web/client; npm start
```

**Mac/Linux:**
```bash
# Terminal 1
cd server && npm run dev

# Terminal 2 (new tab)
cd web/client && npm start
```

---

## 👥 Default Accounts

After running seeders, you can login with these accounts:

### Administrator (Full Access)

| Field | Value |
|-------|-------|
| Email | admin@example.com |
| Password | admin123 |
| Role | Admin |
| Username | admin |

### Regular User

| Field | Value |
|-------|-------|
| Email | test@example.com |
| Password | password123 |
| Role | User |
| Username | testuser |

### Creating New Users

**Via API (Admin only):**
```bash
curl -X POST http://localhost:5000/api/admin/users \
  -H "Authorization: Bearer ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"username":"newuser","email":"new@example.com","password":"password123","role":"user"}'
```

**Via Web Interface:**
1. Login as Admin
2. Go to Users menu
3. Click "Add New User"
4. Fill in the form
5. Submit

---

## 📁 Project Structure

```
petrolab-inventory/
│
├── server/                          # Backend API
│   ├── config/                      # Database configuration
│   │   ├── database.js
│   │   └── sequelize-config.js
│   ├── controllers/                 # Business logic
│   │   ├── authController.js
│   │   ├── itemController.js
│   │   └── userController.js
│   ├── middleware/                  # Auth & validation
│   │   ├── auth.js
│   │   └── validation.js
│   ├── models/                      # Sequelize models
│   │   ├── index.js
│   │   ├── User.js
│   │   └── Item.js
│   ├── routes/                      # API endpoints
│   │   ├── authRoutes.js
│   │   ├── itemRoutes.js
│   │   └── adminRoutes.js
│   ├── migrations/                  # Database migrations
│   ├── seeders/                     # Seed data
│   ├── .env                         # Environment variables
│   ├── .sequelizerc                 # Sequelize CLI config
│   ├── app.js                       # Main entry point
│   ├── package.json
│   └── README.md
│
├── web/                             # Frontend React
│   └── client/
│       ├── public/
│       │   └── petrolab_icon.jpg    # Petrolab logo
│       ├── src/
│       │   ├── api/                 # API calls to backend
│       │   │   ├── axios.js
│       │   │   ├── auth.js
│       │   │   ├── item.js
│       │   │   └── user.js
│       │   ├── assets/              # CSS and assets
│       │   │   └── css/
│       │   │       └── index.css
│       │   ├── components/          # Reusable components
│       │   │   ├── auth/            # PrivateRoute, AdminRoute
│       │   │   ├── common/          # Button, Card, Modal, Table, etc
│       │   │   └── layout/          # Header, Footer, Sidebar
│       │   ├── contexts/            # Context API
│       │   │   ├── AuthContext.jsx
│       │   │   └── ItemContext.jsx
│       │   ├── hooks/               # Custom hooks
│       │   │   ├── useAuth.js
│       │   │   ├── useItems.js
│       │   │   ├── useForm.js
│       │   │   ├── useModal.js
│       │   │   ├── useConfirm.js
│       │   │   └── useNotification.js
│       │   ├── pages/               # Page components
│       │   │   ├── auth/            # Login, Register
│       │   │   ├── user/            # Dashboard, Items, Profile
│       │   │   └── admin/           # AdminDashboard, AdminItems, AdminUsers, AdminReports
│       │   ├── utils/               # Utility functions
│       │   │   ├── storage.js
│       │   │   ├── formatDate.js
│       │   │   ├── formatNumber.js
│       │   │   ├── validation.js
│       │   │   └── constants.js
│       │   ├── App.js
│       │   └── index.js
│       ├── .env                     # Environment variables
│       ├── tailwind.config.js       # Tailwind CSS config
│       ├── package.json
│       └── README.md
│
└── README.md                        # This file
```

---

## 🔌 API Documentation

### Authentication Endpoints

| Method | Endpoint | Description | Body |
|--------|----------|-------------|------|
| POST | `/api/auth/register` | Register new user | `{username, email, password, role?}` |
| POST | `/api/auth/login` | Login user | `{email, password}` |
| GET | `/api/auth/me` | Get current user | - |

### Item Endpoints (User)

| Method | Endpoint | Description | Query Params |
|--------|----------|-------------|--------------|
| GET | `/api/items` | Get all items (user's own) | `?page=1&limit=10&category=Electronics&search=laptop` |
| GET | `/api/items/:id` | Get item by ID | - |
| POST | `/api/items` | Create new item | `{name, description, quantity, price, category}` |
| PUT | `/api/items/:id` | Update item | `{name, description, quantity, price, category}` |
| DELETE | `/api/items/:id` | Delete item | - |
| GET | `/api/items/categories` | Get all categories | - |

### Admin Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/admin/users` | Get all users |
| GET | `/api/admin/users/:id` | Get user by ID |
| POST | `/api/admin/users` | Create new user |
| PUT | `/api/admin/users/:id` | Update user |
| DELETE | `/api/admin/users/:id` | Delete user |
| PUT | `/api/admin/users/:id/role` | Update user role |

### Testing API with cURL

**Register User:**
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"username":"john","email":"john@example.com","password":"password123"}'
```

**Login:**
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@example.com","password":"admin123"}'
```

**Get Items (with Token):**
```bash
TOKEN="your_jwt_token_here"
curl -X GET "http://localhost:5000/api/items?page=1&limit=10" \
  -H "Authorization: Bearer $TOKEN"
```

**Create Item:**
```bash
curl -X POST http://localhost:5000/api/items \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"name":"Laptop ASUS","quantity":10,"price":15000000,"category":"Electronics"}'
```

---

## 🔧 Troubleshooting

### Common Issues and Solutions

**1. Database Connection Error**
```
Error: ER_ACCESS_DENIED_ERROR: Access denied for user 'root'@'localhost'
```
**Solution:**
- Check MySQL credentials in `.env` file
- Verify MySQL is running: `sudo systemctl status mysql`
- Reset MySQL password if needed

**2. Migration Error**
```
Error: Table 'inventory_db.users' doesn't exist
```
**Solution:**
```bash
npm run migrate:undo:all
npm run migrate:latest
```

**3. Port Already in Use**
```
Error: listen EADDRINUSE: address already in use :::5000
```
**Solution:**
```bash
# Find process using port 5000 (Mac/Linux)
lsof -i :5000
kill -9 PID

# Find process using port 5000 (Windows)
netstat -ano | findstr :5000
taskkill /PID PID /F

# Use different port
# Change PORT in .env file
```

**4. JWT Token Invalid**
```
Error: JsonWebTokenError: invalid token
```
**Solution:**
- Login again to get new token
- Clear localStorage in browser
- Check JWT_SECRET in .env matches

**5. CORS Error**
```
Access to XMLHttpRequest at 'http://localhost:5000/api/items' from origin 'http://localhost:3000' has been blocked by CORS policy
```
**Solution:**
- Ensure CORS is configured in `server/app.js`
- Add your frontend URL to CORS origins

**6. Module Not Found**
```
Error: Cannot find module 'express'
```
**Solution:**
```bash
rm -rf node_modules package-lock.json
npm install
```

**7. Tailwind CSS Not Working**
```
The `bg-green` class does not exist
```
**Solution:**
- Use valid Tailwind classes like `bg-green-500`
- Run `npm run build:css` if using custom CSS build

**8. API Returns 401 Unauthorized**
```
{"success":false,"message":"Access denied. No token provided."}
```
**Solution:**
- Login first to get token
- Include token in Authorization header: `Bearer YOUR_TOKEN`
- Check token is not expired

**9. Seeders Not Running**
```
No seeders found
```
**Solution:**
```bash
# Create seeder first
npm run seed:make demo-items

# Then run seeder
npm run seed:run
```

**10. React App Blank Page**
```
No error in console but page is blank
```
**Solution:**
- Check browser console for errors
- Verify `REACT_APP_API_URL` is set correctly
- Run `npm run build` and check for compilation errors

**11. Cannot Find Module 'XLSX'**
```
Module not found: Can't resolve 'xlsx'
```
**Solution:**
```bash
cd web/client
npm install xlsx jspdf jspdf-autotable
```

**12. Token Not Stored After Login**
```
Login successful but token not in localStorage
```
**Solution:**
- Check `src/api/auth.js` login function
- Verify token is being saved: `localStorage.setItem('token', token)`
- Check browser Application tab > Local Storage

---

## 📄 License

This project is proprietary and confidential. All rights reserved by Petrolab.

---

## 📞 Support & Contact

For technical support or inquiries:

- **Email**: support@petrolab.co.id
- **Website**: https://petrolab.co.id

### Developer Notes

- **Node.js Version**: 18+
- **MySQL Version**: 5.7+
- **React Version**: 18.2.0
- **Express Version**: 4.18.2

---

## 🙏 Acknowledgements

- **Express.js Team** - Fast, unopinionated web framework
- **React Team** - JavaScript library for building UIs
- **Tailwind CSS** - Utility-first CSS framework
- **Sequelize** - Promise-based Node.js ORM
- **MySQL** - Open-source relational database

---

<div align="center">
  <p>Made with ❤️ by Petrolab Team</p>
  <p>© 2025 Petrolab. All Rights Reserved.</p>
</div>
```