# BankPro - Quick Start Guide

## 🚀 5-Minute Setup

### Prerequisites
- Python 3.8+
- Node.js 16+
- MySQL 5.7+

### Step 1: Backend Setup (2 minutes)

```bash
cd backend

# Create virtual environment
python -m venv venv
venv\Scripts\activate          # Windows
source venv/bin/activate      # macOS/Linux

# Install dependencies
pip install -r requirements.txt

# Configure database
# Edit .env with your MySQL password
# DB_PASSWORD=your_password

# Run migrations
python manage.py migrate

# Start backend
python manage.py runserver 0.0.0.0:8000
```

✅ Backend running at: `http://127.0.0.1:8000`

---

### Step 2: Frontend Setup (2 minutes)

```bash
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

✅ Frontend running at: `http://localhost:5173`

---

### Step 3: Login (1 minute)

1. Navigate to `http://localhost:5173`
2. Login with Django admin credentials (from `python manage.py createsuperuser`)
3. Explore the application!

---

## 🔧 Common Commands

### Backend
```bash
# Create new app
python manage.py startapp app_name

# Make migrations
python manage.py makemigrations

# Apply migrations
python manage.py migrate

# Create superuser
python manage.py createsuperuser

# Open Django shell
python manage.py shell

# View API docs
# Navigate to: http://127.0.0.1:8000/api/docs/
```

### Frontend
```bash
# Build for production
npm run build

# Run linter
npm run lint

# Preview production build
npm run preview
```

---

## 📁 Key Files Modified

| File | Purpose |
|------|---------|
| `backend/config/settings.py` | ✅ Environment variables support |
| `backend/.env` | Database & JWT configuration |
| `frontend/.env` | API URL configuration |
| `frontend/vite.config.js` | ✅ Proxy setup for development |
| `frontend/src/services/api.js` | ✅ Token refresh interceptor |
| `frontend/src/pages/Dashboard.jsx` | ✅ Enhanced UI |
| `frontend/src/pages/Transactions.jsx` | ✅ Filtering & better styling |
| `frontend/src/pages/Accounts.jsx` | ✅ Professional card layout |

---

## 🔄 API Flow

```
User Login
    ↓
Django returns access + refresh tokens
    ↓
Frontend stores in localStorage
    ↓
All requests include Authorization header
    ↓
If 401 error:
    - Interceptor calls /api/token/refresh/
    - Gets new access token
    - Retries original request
```

---

## 🎨 UI Components

### Dashboard Card
```jsx
<DashboardCard
  title="Total Customers"
  value="150"
  bg="bg-blue-50"
  color="text-blue-600"
  trend={12}
  trendLabel="Increased from last month"
/>
```

### Button
```jsx
<Button 
  variant="primary" 
  size="md"
  isLoading={loading}
>
  Submit
</Button>
```

### Input
```jsx
<Input
  label="Account Number"
  type="text"
  required
  error={error}
  helpText="Enter your 12-digit account number"
/>
```

---

## 🐛 Troubleshooting

| Issue | Solution |
|-------|----------|
| CORS Error | Check backend running on port 8000 |
| 401 Unauthorized | Clear localStorage, login again |
| Port already in use | Kill existing process, restart |
| Database connection error | Check MySQL is running, verify .env credentials |
| Vite proxy not working | Ensure backend server is running |

---

## 📊 Project Structure

```
backend/
├── config/               (Django settings)
├── accounts/            (Bank accounts)
├── authentication/      (JWT auth)
├── customers/           (Customer management)
├── transactions/        (Transaction logs)
├── dashboard/           (Statistics)
├── reports/             (Report generation)
├── manage.py
├── requirements.txt     (✅ Updated with python-dotenv)
└── .env                 (✅ New - environment config)

frontend/
├── src/
│   ├── pages/           (Page components)
│   ├── components/      (Reusable components)
│   ├── services/        (API calls, auth)
│   ├── hooks/           (Custom hooks)
│   ├── routes/          (React Router)
│   └── App.jsx
├── vite.config.js       (✅ Updated with proxy)
├── package.json
└── .env                 (✅ New - API URL config)
```

---

## 🔐 Security Notes

✅ **Implemented:**
- Environment variables for all sensitive data
- CORS restricted to specific origins
- JWT token expiry (60 min access, 7 day refresh)
- Token refresh on 401
- Password hashing

⚠️ **For Production:**
- Set `DEBUG=False` in .env
- Use strong `SECRET_KEY`
- Add your domain to `ALLOWED_HOSTS`
- Use HTTPS everywhere
- Set `SECURE_SSL_REDIRECT=True`
- Configure proper CORS origins

---

## 📚 Documentation

- Full setup guide: See `SETUP_GUIDE.md`
- API docs: `http://127.0.0.1:8000/api/docs/`
- Django: https://docs.djangoproject.com/
- React: https://react.dev/
- Vite: https://vitejs.dev/

---

## 🎯 Next Steps

1. ✅ Setup complete!
2. Create test data (login, add customers, create accounts)
3. Test all features
4. Customize styling in `frontend/src/index.css`
5. Deploy to production

---

## 💡 Pro Tips

1. **Use React DevTools** - Debug component state
2. **Use Django Shell** - Test models quickly
3. **Check Network Tab** - See actual API calls
4. **Use Console Logs** - Debug async operations
5. **Read Error Messages** - They usually tell you what's wrong

---

**Happy Banking! 🏦**

Need help? Check the full SETUP_GUIDE.md or troubleshooting section above.
