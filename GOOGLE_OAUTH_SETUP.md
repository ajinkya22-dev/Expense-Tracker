# Google OAuth Setup Guide 🔐

## ✅ What You Need to Configure in Google Cloud Console

### 1️⃣ Authorized JavaScript Origins
Add this URL where your **frontend** is running:
```
http://localhost:5173
```
⚠️ **Note:** This is port **5173** (Vite default), NOT 3000!

### 2️⃣ Authorized Redirect URIs  
Add this URL where your **backend OAuth callback** is:
```
http://localhost:5000/api/auth/google/callback
```

---

## 🎯 Complete Setup Steps

### Step 1: Get Google OAuth Credentials

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Enable **Google+ API**
4. Go to **Credentials** → **Create Credentials** → **OAuth 2.0 Client ID**
5. Choose **Web application**
6. Add the URLs mentioned above
7. Copy your **Client ID** and **Client Secret**

### Step 2: Update Backend Environment Variables

Open `Backend/.env` and fill in your credentials:

```env
# Google OAuth Configuration
GOOGLE_CLIENT_ID=your_actual_google_client_id_here
GOOGLE_CLIENT_SECRET=your_actual_google_client_secret_here
GOOGLE_CALLBACK_URL=http://localhost:5000/api/auth/google/callback
```

### Step 3: Start Your Servers

**Terminal 1 - Backend:**
```bash
cd Backend
npm run dev
```

**Terminal 2 - Frontend:**
```bash
cd Frontend
npm run dev
```

---

## 🚀 How It Works

### Flow Diagram:
```
User clicks "Sign in with Google"
    ↓
Frontend redirects to: http://localhost:5000/api/auth/google
    ↓
Backend redirects to Google OAuth page
    ↓
User authenticates with Google
    ↓
Google redirects to: http://localhost:5000/api/auth/google/callback
    ↓
Backend creates/finds user in MongoDB
    ↓
Backend generates JWT token
    ↓
Backend redirects to: http://localhost:5173/auth/callback?token=xxx
    ↓
Frontend stores token and user data
    ↓
User is logged in! 🎉
```

---

## 📁 Files Created/Modified

### Backend:
- ✅ `config/passport.js` - Passport Google OAuth strategy
- ✅ `models/User.js` - Added `googleId` field
- ✅ `controllers/authController.js` - Added `googleCallback` function
- ✅ `routes/authRoutes.js` - Added Google OAuth routes
- ✅ `server.js` - Added passport middleware
- ✅ `.env` - Added Google OAuth variables

### Frontend:
- ✅ `Components/GoogleLoginButton.jsx` - Reusable Google login button
- ✅ `Components/GoogleAuthCallback.jsx` - Handles OAuth redirect
- ✅ `Components/login.jsx` - Added Google login button
- ✅ `Components/signUp.jsx` - Added Google signup button
- ✅ `App.jsx` - Added `/auth/callback` route

---

## 🎨 Using Google Login

### On Login Page:
```jsx
<GoogleLoginButton text="Continue with Google" />
```

### On Signup Page:
```jsx
<GoogleLoginButton text="Sign up with Google" />
```

The button automatically redirects to the backend OAuth endpoint!

---

## 🔧 Backend API Endpoints

### New Google OAuth Routes:

1. **Initiate Google OAuth**
   ```
   GET /api/auth/google
   ```
   - Redirects to Google login page

2. **OAuth Callback**
   ```
   GET /api/auth/google/callback
   ```
   - Handles Google's response
   - Creates/finds user
   - Generates JWT token
   - Redirects to frontend with token

---

## 🗄️ Database Schema Updates

### User Model Changes:
```javascript
{
  googleId: String (optional, unique) // Google OAuth ID
  name: String,
  email: String,
  password: String (not required for Google users),
  profilePicture: String (auto-filled from Google),
  ...
}
```

---

## 🧪 Testing

### Test Google Login:
1. Go to http://localhost:5173/login
2. Click "Google" button
3. Sign in with your Google account
4. You should be redirected to dashboard
5. Check if profile picture appears from Google

### Verify in MongoDB:
```javascript
// User document should have:
{
  googleId: "1234567890...",
  name: "Your Name",
  email: "you@gmail.com",
  profilePicture: "https://lh3.googleusercontent.com/...",
  password: "[random-hash]" // Auto-generated
}
```

---

## ⚠️ Common Issues

### Issue 1: "redirect_uri_mismatch"
**Solution:** Make sure redirect URI in Google Console exactly matches:
```
http://localhost:5000/api/auth/google/callback
```

### Issue 2: "Access blocked: This app's request is invalid"
**Solution:** 
- Add test users in Google Console OAuth consent screen
- Make sure APIs are enabled

### Issue 3: User not redirected after login
**Solution:**
- Check backend console for errors
- Verify FRONTEND_URL in backend .env
- Check browser console for errors

### Issue 4: "Unauthorized" after Google login
**Solution:**
- Clear localStorage
- Check JWT_SECRET is set
- Verify token is being stored correctly

---

## 🔒 Security Notes

### For Development:
- ✅ Using http://localhost is okay
- ✅ Session cookies are not secure (httpOnly: false)

### For Production:
1. ⚠️ Use HTTPS for all URLs
2. ⚠️ Set secure cookies: `secure: true`
3. ⚠️ Add production URLs to Google Console:
   ```
   https://yourdomain.com
   https://api.yourdomain.com/auth/google/callback
   ```
4. ⚠️ Update environment variables
5. ⚠️ Restrict API key usage in Google Console

---

## 📊 Environment Variables Summary

### Backend `.env`:
```env
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
JWT_EXPIRE=7d
NODE_ENV=development
FRONTEND_URL=http://localhost:5173

# Google OAuth
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GOOGLE_CALLBACK_URL=http://localhost:5000/api/auth/google/callback
```

### Frontend `.env`:
```env
VITE_API_URL=http://localhost:5000/api
```

---

## ✨ Features

- 🔐 Secure OAuth 2.0 authentication
- 👤 Auto-creates user account from Google profile
- 🖼️ Profile picture from Google account
- 🔄 Works with existing email/password login
- 📱 Fully responsive design
- 🎨 Beautiful UI with icons

---

## 🎉 You're All Set!

Just fill in your Google OAuth credentials in the `.env` file and start using Google login!

**Questions?** Check the common issues section or review the code in:
- `Backend/config/passport.js`
- `Frontend/src/Components/GoogleLoginButton.jsx`
