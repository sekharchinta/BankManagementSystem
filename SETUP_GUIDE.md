# Bank Management System - Setup & Architecture Guide

## Project Overview
BankPro is a professional bank management system with a Django REST API backend and a React frontend. This guide covers the system architecture, setup process, and key improvements made.

---

## 📋 Issues Identified & Fixes Applied

### **Backend Issues Fixed**

#### 1. **CORS Configuration** ❌ → ✅
**Issue:** `CORS_ALLOW_ALL_ORIGINS = True` is a security risk and prevents proper development/production separation.

**Fix:** 
- Implemented environment-based CORS configuration
- Added `CORS_ALLOWED_ORIGINS` for specific frontend URLs
- Development: `http://localhost:5173,http://127.0.0.1:5173`
- Added `CORS_ALLOW_CREDENTIALS = True` for cookie-based authentication

#### 2. **Security - Hardcoded Database Credentials** ❌ → ✅
**Issue:** Database password exposed in `settings.py`
```python
# ❌ BEFORE
"PASSWORD": "Somu#123",
```

**Fix:**
- Migrated all sensitive data to `.env` file
- Uses `python-dotenv` for environment variable management
```python
# ✅ AFTER
"PASSWORD": os.getenv("DB_PASSWORD", ""),
```

#### 3. **ALLOWED_HOSTS Configuration** ❌ → ✅
**Issue:** `ALLOWED_HOSTS = []` prevents Django from running in production
```python
# ❌ BEFORE
ALLOWED_HOSTS = []
```

**Fix:**
- Configured dynamic host management via `.env`
```python
# ✅ AFTER
ALLOWED_HOSTS = os.getenv('ALLOWED_HOSTS', 'localhost,127.0.0.1').split(',')
```

#### 4. **JWT Configuration Missing** ❌ → ✅
**Issue:** No JWT token expiry/refresh settings configured

**Fix:** Added `SIMPLE_JWT` configuration with:
- Access token lifetime: 60 minutes (configurable)
- Refresh token lifetime: 7 days (configurable)
- Token rotation enabled
- Blacklist after rotation enabled

### **Frontend Issues Fixed**

#### 1. **API Connection & Proxy Configuration** ❌ → ✅
**Issue:** Hardcoded API URL with no proxy for development

**Fix:**
- Added Vite proxy configuration for `/api` requests
- Environment variable support for API URL
- Improved interceptor with automatic token refresh

**Before:**
```js
// ❌ Hardcoded, no refresh logic
const api = axios.create({
    baseURL: "http://127.0.0.1:8000/api/",
});
```

**After:**
```js
// ✅ Environment-based, with refresh logic
const API_BASE_URL = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000/api/";

api.interceptors.response.use(
    (response) => response,
    async (error) => {
        if (error.response?.status === 401 && !originalRequest._retry) {
            // Auto-refresh expired tokens
        }
    }
);
```

#### 2. **Dashboard Loading State** ❌ → ✅
**Issue:** Shows plain text "Loading Dashboard..." instead of professional UI

**Fix:**
- Replaced with `LoadingSpinner` component
- Added error handling and retry functionality
- Improved data display with formatting

#### 3. **Removed Duplicate Titles** ❌ → ✅
**Issue:** Pages had redundant h1 titles (navbar already shows page title)

**Fix:** Removed duplicate titles from:
- Dashboard.jsx
- Customers.jsx
- Other pages

#### 4. **Improved HTML Meta Tags** ❌ → ✅
**Issue:** `<title>frontend</title>` and missing meta information

**Fix:**
```html
<title>BankPro - Bank Management System</title>
<meta name="description" content="BankPro - Professional Bank Management System" />
<meta name="theme-color" content="#6366f1" />
```

---

## 🎨 Professional UI Improvements

### **1. Enhanced Button Component**
```jsx
// New features:
- Loading state with spinner
- Ghost variant for secondary actions
- Better color scheme (indigo primary)
- Improved accessibility

<Button 
  variant="primary" 
  size="md" 
  isLoading={loading}
>
  Submit
</Button>
```

### **2. Enhanced Input Component**
```jsx
// New features:
- Success state indicator
- Error icons with better styling
- Help text support
- Required field indicator
- Disabled state styling
```

### **3. Professional Dashboard Cards**
- Larger icons with hover effects
- Trend indicators with icons
- Better color coding
- Action buttons support
- Improved typography

### **4. Dashboard Table Styling**
- Alternating row colors on hover
- Color-coded debit/credit transactions
- Status badges with icons
- Better spacing and typography
- Responsive design

### **5. Customer Page Improvements**
- Collapsible form with toggle button
- Toast notifications for actions
- Loading states
- Better error handling
- Improved layout structure

---

## 📁 Folder Structure Overview

```
BankManagementSystem/
├── backend/                      # Django REST API
│   ├── config/                   # Django configuration
│   │   ├── settings.py          # ✨ Now with env variables
│   │   ├── urls.py              # API routes
│   │   ├── wsgi.py              # WSGI config
│   │   └── asgi.py              # ASGI config
│   ├── accounts/                 # Bank accounts management
│   ├── authentication/           # JWT authentication
│   ├── customers/                # Customer records
│   ├── transactions/             # Transaction handling
│   ├── dashboard/                # Dashboard statistics
│   ├── reports/                  # Report generation
│   ├── .env                      # ✨ Environment variables
│   ├── .env.example              # ✨ Template for .env
│   ├── requirements.txt          # ✨ Updated with python-dotenv
│   └── manage.py
│
└── frontend/                     # React + Vite
    ├── src/
    │   ├── pages/                # Page components
    │   │   ├── Dashboard.jsx     # ✨ Improved with better loading
    │   │   ├── Customers.jsx     # ✨ Enhanced UI
    │   │   ├── Accounts.jsx
    │   │   ├── Login.jsx
    │   │   └── ...
    │   ├── components/
    │   │   ├── layout/           # Layout components
    │   │   ├── common/           # Shared components
    │   │   ├── ui/               # ✨ Enhanced UI components
    │   │   └── ...
    │   ├── services/
    │   │   ├── api.js            # ✨ Improved with interceptors
    │   │   ├── authService.js
    │   │   └── ...
    │   ├── routes/
    │   │   └── AppRoutes.jsx
    │   ├── App.jsx
    │   ├── main.jsx
    │   └── index.css
    ├── .env                      # ✨ Environment variables
    ├── .env.example              # ✨ Template for .env
    ├── vite.config.js            # ✨ Improved with proxy
    ├── package.json
    └── index.html                # ✨ Updated meta tags
```

---

## 🚀 Setup Instructions

### **1. Backend Setup**

```bash
# Navigate to backend
cd backend

# Create virtual environment (if not exists)
python -m venv venv

# Activate virtual environment
# Windows:
venv\Scripts\activate
# macOS/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Create .env file (copy from .env.example)
copy .env.example .env
# Or on macOS/Linux:
cp .env.example .env

# Edit .env with your database credentials
# DB_PASSWORD=your_mysql_password

# Run migrations
python manage.py migrate

# Create superuser (optional)
python manage.py createsuperuser

# Start development server
python manage.py runserver 0.0.0.0:8000
```

### **2. Frontend Setup**

```bash
# Navigate to frontend
cd frontend

# Install dependencies
npm install

# Create .env file
copy .env.example .env
# Or on macOS/Linux:
cp .env.example .env

# Start development server (Vite runs on port 5173)
npm run dev

# Production build
npm run build
```

---

## 🔌 API Connection & Routing

### **Development Setup**

1. **Vite Proxy** (Frontend to Backend):
   - Requests to `/api/*` are proxied to `http://127.0.0.1:8000/api/*`
   - Eliminates CORS issues in development
   - Config in `vite.config.js`

2. **Backend CORS**:
   - Allows requests from `http://localhost:5173` and `http://127.0.0.1:5173`
   - Configured in `.env` file
   - Can be extended for additional origins

### **Production Setup**

1. Frontend build files served from CDN or separate domain
2. Backend API URL in `.env`:
   ```
   VITE_API_URL=https://api.yourdomain.com/api/
   ```
3. Backend CORS updated to accept production URL:
   ```
   CORS_ALLOWED_ORIGINS=https://yourdomain.com,https://www.yourdomain.com
   ```

---

## 🔐 Environment Variables

### **Backend `.env` Template**
```
SECRET_KEY=your_django_secret_key
DEBUG=False (for production)
ALLOWED_HOSTS=yourdomain.com,www.yourdomain.com

DB_NAME=bank_management_system
DB_USER=root
DB_PASSWORD=your_password
DB_HOST=localhost
DB_PORT=3306

CORS_ALLOWED_ORIGINS=https://yourdomain.com
JWT_ACCESS_TOKEN_LIFETIME=60
JWT_REFRESH_TOKEN_LIFETIME=7
```

### **Frontend `.env` Template**
```
VITE_API_URL=https://api.yourdomain.com/api/
VITE_APP_NAME=BankPro
VITE_DEBUG=false (for production)
```

---

## 🔄 Authentication Flow

1. User logs in with username/password
2. Backend returns `access` and `refresh` tokens
3. Frontend stores tokens in `localStorage`
4. API requests include `Authorization: Bearer {access_token}` header
5. If access token expires (401 error):
   - Interceptor automatically calls `/api/token/refresh/` with refresh token
   - Gets new access token
   - Retries original request
6. If refresh fails, user redirected to login

---

## 📊 Database Schema

### **Key Tables**
- **Users**: Authentication and authorization
- **Customers**: Customer information
- **Accounts**: Bank accounts with balance
- **Transactions**: All financial transactions
- **Dashboard**: Summary statistics

---

## ✨ Key Improvements Made

| Issue | Status | Solution |
|-------|--------|----------|
| CORS configuration | ✅ Fixed | Environment-based, specific origins |
| Hardcoded credentials | ✅ Fixed | Environment variables with python-dotenv |
| Empty ALLOWED_HOSTS | ✅ Fixed | Dynamic configuration via .env |
| Missing JWT config | ✅ Fixed | Added with proper token expiry |
| Dashboard loading UI | ✅ Fixed | Professional LoadingSpinner component |
| Duplicate page titles | ✅ Fixed | Removed redundant titles |
| API interceptor | ✅ Enhanced | Added automatic token refresh logic |
| UI Components | ✅ Enhanced | Modern design with better states |
| Button component | ✅ Enhanced | Added loading state and variants |
| Input component | ✅ Enhanced | Added success/error indicators |
| HTML meta tags | ✅ Fixed | Added description and theme-color |
| Vite config | ✅ Enhanced | Added proxy for development |

---

## 🧪 Testing the Application

1. Start MySQL server
2. Start backend: `python manage.py runserver`
3. Start frontend: `npm run dev`
4. Navigate to `http://localhost:5173`
5. Login with your superuser credentials
6. Test all pages and features

---

## 📝 API Documentation

Available at: `http://127.0.0.1:8000/api/docs/` (Swagger UI)

---

## 🤝 Contributing

When making changes:
1. Update `.env.example` if adding new variables
2. Follow the existing code style
3. Test both frontend and backend changes
4. Update this documentation if needed

---

## 🐛 Troubleshooting

### **CORS Error**
- Check `.env` CORS_ALLOWED_ORIGINS matches frontend URL
- Ensure backend is running on correct port
- Clear browser cache

### **Token Expiry Issues**
- Check JWT_ACCESS_TOKEN_LIFETIME in `.env`
- Clear localStorage and login again
- Check browser console for errors

### **Database Connection**
- Verify MySQL is running
- Check DB credentials in `.env`
- Run migrations: `python manage.py migrate`

### **API Not Found**
- Ensure Vite proxy is configured correctly
- Backend must be running on port 8000
- Check DevTools Network tab for actual request URL

---

## 📞 Support

For issues or questions, check the error logs:
- Backend: Django console
- Frontend: Browser console (F12)
- Database: MySQL error log

---

**Last Updated:** 2024
**Version:** 1.0
