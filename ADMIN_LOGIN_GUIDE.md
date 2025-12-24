# Admin Login Instructions
## The Esther & Mays Group LLC

## 🔐 HOW TO LOGIN AS ADMIN

You have **TWO OPTIONS** to create your admin account:

---

### **OPTION 1: Use Signup Page (Recommended - Easiest)**

1. Go to your deployed site
2. Click **"Sign Up"** or **"Get Started"**
3. Enter your details:
   - **Name**: Your name (e.g., "Esther & Mays Admin")
   - **Email**: `estherandmays@gmail.com`
   - **Password**: Choose a secure password (at least 6 characters)
   - **Confirm Password**: Same as above
4. Click **"Create Account"**
5. You'll be **automatically logged in** and redirected to the **Admin Dashboard** ✅

**The app automatically detects** that `estherandmays@gmail.com` is the admin email and gives you admin privileges!

---

### **OPTION 2: Manually Create User in Firebase Console**

1. Go to: https://console.firebase.google.com/project/the-esther-and-mays-group-llc/authentication/users
2. Click **"Add user"**
3. Enter:
   - **Email**: `estherandmays@gmail.com`
   - **Password**: Your chosen password
4. Click **"Add user"**
5. Now go to your deployed site
6. Click **"Login"**
7. Enter your email and password
8. You'll be redirected to the **Admin Dashboard** ✅

---

## ✅ AFTER CREATING YOUR ACCOUNT

Once you've created your admin account using **either option above**, you can:

- **Login** anytime at: `your-site.com/auth/login`
- You'll see the **Admin Dashboard** (not the vendor portal)
- You can manage vendors, send messages, schedule payments, etc.

---

## 🎯 RECOMMENDED: Use Option 1 (Signup Page)

**Why?**
- Faster (one step instead of multiple)
- Creates your user profile automatically
- Tests that the signup flow works correctly
- You're logged in immediately after signup

---

## 🔑 YOUR ADMIN CREDENTIALS

**Email**: `estherandmays@gmail.com`
**Password**: Whatever you choose (at least 6 characters)

**Note**: The app recognizes this email as the admin automatically. No additional configuration needed!

---

## 🚨 TROUBLESHOOTING

**"Firebase is not configured" error?**
- Make sure you added all environment variables to Vercel
- Make sure you redeployed after adding variables
- See `YOUR_ENV_VARS.txt` for the complete list

**Can't see what I'm typing?**
- This is now FIXED! Input text is now black and visible.

**Forgot password?**
- Go to Firebase Console → Authentication → Users
- Find your user and click the 3 dots → Reset password
- Or delete and recreate the user

---

**Created for The Esther & Mays Group LLC**
Admin Email: estherandmays@gmail.com
