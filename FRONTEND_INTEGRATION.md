# 🔗 Frontend Integration Guide

## 🎯 Quick Setup for React Frontend

### 1. Update Your API Configuration

Make sure your `laboratory/src/utils/api.js` is configured correctly:

```javascript
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests automatically
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle token expiration
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;
```

### 2. Update Login Component

Ensure your login component uses the correct endpoint:

```javascript
// In your Login.js component
import api from '../utils/api';

const handleLogin = async (email, password) => {
  try {
    const response = await api.post('/auth/login-user', {
      email,
      password
    });
    
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
      // Redirect to dashboard
      navigate('/');
    }
  } catch (error) {
    console.error('Login failed:', error.response?.data?.message);
    // Show error to user
  }
};
```

### 3. Test Credentials

Use these exact credentials in your login form:
- **Email**: `test@lab.com`
- **Password**: `Test@123`

### 4. Start Both Servers

**Terminal 1 - Backend:**
```bash
cd backend
npm start
```

**Terminal 2 - Frontend:**
```bash
cd laboratory
npm start
```

### 5. Test the Flow

1. Go to http://localhost:3000/login
2. Enter: test@lab.com / Test@123
3. Click "Sign in"
4. You should be redirected to the dashboard
5. All API calls should now work with authentication

## ✅ Verification Checklist

- [ ] Backend running on port 5000
- [ ] Frontend running on port 3000
- [ ] Login page accessible
- [ ] Can login with test credentials
- [ ] Redirected to dashboard after login
- [ ] Protected routes work
- [ ] API calls include authentication headers

## 🎉 You're All Set!

Your authentication system is now fully functional and ready to use!