# 🚀 READY TO GO - Step-by-Step Setup Guide
## The Esther & Mays Group LLC

---

## ✅ WHAT'S ALREADY DONE (You Don't Need to Touch):

1. ✅ **Code automatically recognizes admin**: `estherandmays@gmail.com` is hardcoded as admin
2. ✅ **All environment variables are in YOUR_ENV_VARS.txt**
3. ✅ **Input text is visible** (fixed the white text issue)
4. ✅ **Navigation works** (all buttons redirect properly)
5. ✅ **All code is committed and pushed**

---

## 📋 STEP-BY-STEP: What You Need to Do NOW

### **STEP 1: Add Environment Variables to Vercel** ⚡

1. Go to: https://vercel.com/dashboard
2. Click on your **"Estherandmays"** project
3. Click **"Settings"** tab at the top
4. Click **"Environment Variables"** in the left sidebar
5. For each of the 11 variables below, click **"Add New"**:

```bash
# Copy these one by one:

Name: NEXT_PUBLIC_FIREBASE_API_KEY
Value: AIzaSyBvbE2bTr_Vq8L3Xd985Vk3nxHX9fVhFUY
Environments: Production + Preview + Development (check all 3)

Name: NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN
Value: the-esther-and-mays-group-llc.firebaseapp.com
Environments: Production + Preview + Development (check all 3)

Name: NEXT_PUBLIC_FIREBASE_PROJECT_ID
Value: the-esther-and-mays-group-llc
Environments: Production + Preview + Development (check all 3)

Name: NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET
Value: the-esther-and-mays-group-llc.firebasestorage.app
Environments: Production + Preview + Development (check all 3)

Name: NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID
Value: 989460284216
Environments: Production + Preview + Development (check all 3)

Name: NEXT_PUBLIC_FIREBASE_APP_ID
Value: 1:989460284216:web:aff46d9e1ec59f40b077cd
Environments: Production + Preview + Development (check all 3)

Name: NEXT_PUBLIC_ADMIN_EMAIL
Value: estherandmays@gmail.com
Environments: Production + Preview + Development (check all 3)

Name: RESEND_API_KEY
Value: re_jMoqWzTp_7utM7id18kpkL2kubWYoKJSw
Environments: Production + Preview + Development (check all 3)

Name: BILL_COM_API_KEY
Value: PLACEHOLDER_BILLCOM_KEY
Environments: Production + Preview + Development (check all 3)

Name: BILL_COM_ORG_ID
Value: PLACEHOLDER_ORG_ID
Environments: Production + Preview + Development (check all 3)

Name: BILL_COM_ENVIRONMENT
Value: sandbox
Environments: Production + Preview + Development (check all 3)
```

**Click "Save" after EACH variable!**

---

### **STEP 2: Set Up Firebase Security Rules** 🔒

1. Go to: https://console.firebase.google.com/project/the-esther-and-mays-group-llc/firestore/rules

2. **Replace ALL the rules** with this:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Allow admin (estherandmays@gmail.com) to read/write everything
    match /{document=**} {
      allow read, write: if request.auth != null &&
        request.auth.token.email == 'estherandmays@gmail.com';
    }

    // Allow vendors to read/write their own profile
    match /subcontractors/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }

    // Allow authenticated users to read contracts
    match /contracts/{contractId} {
      allow read: if request.auth != null;
    }
  }
}
```

3. Click **"Publish"**

---

### **STEP 3: Set Up Firebase Storage Rules** 📁

1. Go to: https://console.firebase.google.com/project/the-esther-and-mays-group-llc/storage/rules

2. **Replace ALL the rules** with this:

```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    // Allow authenticated users to read/write their own documents
    match /documents/{userId}/{allPaths=**} {
      allow read: if request.auth != null;
      allow write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

3. Click **"Publish"**

---

### **STEP 4: Redeploy on Vercel** 🔄

1. Go back to your Vercel dashboard
2. Click **"Deployments"** tab
3. Find your latest deployment
4. Click the **"..."** (three dots) button
5. Click **"Redeploy"**
6. Wait for deployment to complete (usually 1-2 minutes)

---

### **STEP 5: Sign Up as Admin** 👤

1. Once deployment is done, visit your live site URL
2. Click **"Sign Up"** or **"Get Started"**
3. Fill in the form:

   **Full Name**: `Esther & Mays Admin` (or whatever you prefer)
   **Email**: `estherandmays@gmail.com`
   **Password**: `755491sT`
   **Confirm Password**: `755491sT`

4. Click **"Create Account"**

---

### **STEP 6: You're Done!** 🎉

You should be **automatically redirected** to the **Admin Dashboard**!

The code automatically detects that `estherandmays@gmail.com` is the admin email and gives you admin privileges.

---

## 🔐 YOUR LOGIN CREDENTIALS (Save These!)

**Email**: estherandmays@gmail.com
**Password**: 755491sT
**Role**: Admin (automatically assigned)

**Next time**: Just use the "Login" page with these credentials

---

## ✅ VERIFICATION CHECKLIST

After you complete the steps above, verify:

- [ ] All 11 environment variables added to Vercel
- [ ] Firestore security rules published
- [ ] Storage security rules published
- [ ] Project redeployed on Vercel
- [ ] Signed up with estherandmays@gmail.com
- [ ] Seeing the Admin Dashboard (not vendor portal)

---

## 🚨 TROUBLESHOOTING

**"Email already in use"**
→ You already deleted the user in Firebase, so this shouldn't happen
→ If it does, go to Firebase Console → Authentication → Users → Delete the user again

**"Firebase is not configured"**
→ Make sure you added ALL 11 environment variables
→ Make sure you clicked "Save" after each one
→ Make sure you redeployed after adding them

**Can't see what I'm typing**
→ This is now fixed! Make sure you've redeployed the latest code

**Redirected to vendor portal instead of admin dashboard**
→ This means the admin email detection isn't working
→ Make sure you used exactly: `estherandmays@gmail.com`

---

## 📞 NEED HELP?

If you get stuck, let me know:
1. What step you're on
2. What error message you see (if any)
3. Screenshot if possible

---

**🎯 Bottom Line**: After you complete these 6 steps, you'll be logged in as admin and can start using the platform!

---

**Created for The Esther & Mays Group LLC**
Admin Email: estherandmays@gmail.com
