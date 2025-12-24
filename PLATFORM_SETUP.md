# Platform Setup Guide
## The Esther & Mays Group LLC - Admin Communication Portal

Admin Email: **estherandmays@gmail.com**

---

## 1. Firebase Setup

### Step 1: Create Firebase Project
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click **"Add project"** or **"Create a project"**
3. Project name: `esther-mays-admin-portal` (or your preferred name)
4. Disable Google Analytics (optional for this project)
5. Click **"Create project"**

### Step 2: Enable Authentication
1. In Firebase Console, click **"Authentication"** in left sidebar
2. Click **"Get started"**
3. Click on **"Email/Password"** tab
4. Enable **"Email/Password"** (toggle ON)
5. Click **"Save"**

### Step 3: Add Admin User
1. Still in Authentication, click **"Users"** tab
2. Click **"Add user"**
3. Email: `estherandmays@gmail.com`
4. Password: Create a secure password (you'll use this to login)
5. Click **"Add user"**

### Step 4: Create Firestore Database
1. Click **"Firestore Database"** in left sidebar
2. Click **"Create database"**
3. Select **"Start in production mode"** (we'll add rules next)
4. Choose your location: `us-east1` or closest to Charlotte, NC
5. Click **"Enable"**

### Step 5: Set Firestore Security Rules
1. In Firestore Database, click **"Rules"** tab
2. Replace the rules with:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Allow authenticated users to read/write their own data
    match /subcontractors/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }

    // Allow admin to read/write everything
    match /{document=**} {
      allow read, write: if request.auth != null &&
        request.auth.token.email == 'estherandmays@gmail.com';
    }

    // Allow authenticated users to read their own contracts
    match /contracts/{contractId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null &&
        request.auth.token.email == 'estherandmays@gmail.com';
    }
  }
}
```

3. Click **"Publish"**

### Step 6: Create Storage Bucket
1. Click **"Storage"** in left sidebar
2. Click **"Get started"**
3. Use default security rules for now
4. Click **"Done"**

### Step 7: Set Storage Security Rules
1. In Storage, click **"Rules"** tab
2. Replace with:

```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /documents/{userId}/{allPaths=**} {
      allow read: if request.auth != null;
      allow write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

3. Click **"Publish"**

### Step 8: Get Firebase Configuration
1. Click the **gear icon** ⚙️ next to "Project Overview"
2. Click **"Project settings"**
3. Scroll down to **"Your apps"** section
4. Click the **web icon** `</>`
5. App nickname: `Esther Mays Portal`
6. Don't check "Firebase Hosting"
7. Click **"Register app"**
8. **COPY** the config object - you'll need these values:

```javascript
const firebaseConfig = {
  apiKey: "AIza...",              // NEXT_PUBLIC_FIREBASE_API_KEY
  authDomain: "xxx.firebaseapp.com",  // NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN
  projectId: "xxx",                   // NEXT_PUBLIC_FIREBASE_PROJECT_ID
  storageBucket: "xxx.appspot.com",   // NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET
  messagingSenderId: "123...",        // NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID
  appId: "1:123..."                   // NEXT_PUBLIC_FIREBASE_APP_ID
};
```

---

## 2. Resend Setup

### Step 1: Create Resend Account
1. Go to [Resend](https://resend.com/)
2. Click **"Sign Up"**
3. Email: `estherandmays@gmail.com`
4. Verify your email

### Step 2: Get API Key
1. Login to Resend dashboard
2. Click **"API Keys"** in left sidebar
3. Click **"Create API Key"**
4. Name: `Esther Mays Portal`
5. Permission: **"Full access"**
6. Click **"Create"**
7. **COPY** the API key immediately (shown only once!)
   - Format: `re_xxxxxxxxxxxxx`
   - This is your `RESEND_API_KEY`

### Step 3: Add Domain (Optional - Recommended)
1. Click **"Domains"** in left sidebar
2. Click **"Add Domain"**
3. Enter your domain: `estherandmays.com` (if you have one)
4. Follow DNS verification steps
5. **OR** use Resend's test domain for now (emails will come from `onboarding@resend.dev`)

### Step 4: Update Email From Address (if using custom domain)
If you verified a custom domain, update the email sender in:
- `app/api/email/route.ts` line 17: Change `from: 'The Esther & Mays Group <notifications@estherandmays.com>'`

---

## 3. Bill.com Setup

### Step 1: Create Bill.com Account
1. Go to [Bill.com](https://www.bill.com/)
2. Click **"Get Started"** or **"Sign Up"**
3. Business email: `estherandmays@gmail.com`
4. Company name: `The Esther & Mays Group LLC`
5. Complete the registration process

### Step 2: Get Sandbox Access (for testing)
1. Email Bill.com support: developer@bill.com
2. Request: "API access for developer integration"
3. They'll provide:
   - Sandbox account credentials
   - API documentation link
   - Developer portal access

### Step 3: Get API Credentials
Once you have developer access:

1. Login to [Bill.com Developer Portal](https://developer.bill.com/)
2. Navigate to **"API Keys"**
3. Create new API key
4. **COPY** the following:
   - `BILL_COM_API_KEY` (your API key)
   - `BILL_COM_ORG_ID` (your organization ID)

### Step 4: Choose Environment
- **Sandbox (Testing)**: Use for development
  - Set `BILL_COM_ENVIRONMENT=sandbox`
- **Production**: Use for real payments
  - Set `BILL_COM_ENVIRONMENT=production`

**IMPORTANT**: Start with sandbox for testing!

---

## 4. Environment Variables for Vercel

Copy these values to your Vercel project:

### How to Add to Vercel:
1. Go to [Vercel Dashboard](https://vercel.com/)
2. Select your project: `Estherandmays`
3. Click **"Settings"** tab
4. Click **"Environment Variables"** in left sidebar
5. Add each variable below:
   - Click **"Add New"**
   - Name: (variable name)
   - Value: (your actual value)
   - Environment: Select **"Production"**, **"Preview"**, and **"Development"** (all three)
   - Click **"Save"**

---

## Complete Environment Variables List

```bash
# ============================================
# FIREBASE CONFIGURATION (from Firebase Console)
# ============================================
NEXT_PUBLIC_FIREBASE_API_KEY=AIza...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
NEXT_PUBLIC_FIREBASE_APP_ID=1:123456789:web:abc123

# ============================================
# ADMIN EMAIL
# ============================================
NEXT_PUBLIC_ADMIN_EMAIL=estherandmays@gmail.com

# ============================================
# RESEND (Email Service)
# ============================================
RESEND_API_KEY=re_xxxxxxxxxxxxxxxxxxxxx

# ============================================
# BILL.COM (Payment Processing)
# ============================================
BILL_COM_API_KEY=your_billcom_api_key_here
BILL_COM_ORG_ID=your_billcom_org_id_here
BILL_COM_ENVIRONMENT=sandbox
# Change to 'production' when ready for real payments

```

---

## 5. Local Development Setup (Optional)

If you want to test locally:

1. Create `.env.local` file in project root
2. Copy all environment variables above into it
3. Replace placeholder values with your actual values
4. **NEVER** commit `.env.local` to git (already in `.gitignore`)

---

## 6. Verification Steps

After adding all environment variables to Vercel:

1. **Redeploy** your Vercel project:
   - Go to Vercel dashboard
   - Click **"Deployments"** tab
   - Click **"..."** on latest deployment
   - Click **"Redeploy"**

2. **Test Authentication**:
   - Go to your deployed site
   - Click **"Login"**
   - Use: `estherandmays@gmail.com` + your Firebase password
   - You should see the Admin Dashboard

3. **Test Email** (in Admin Dashboard):
   - Try sending a message to a test vendor
   - Check Resend dashboard for delivery status

4. **Test Bill.com** (when ready):
   - Start with sandbox environment
   - Test payment scheduling
   - Verify in Bill.com sandbox dashboard

---

## 7. Post-Setup Checklist

- [ ] Firebase project created
- [ ] Firebase Authentication enabled
- [ ] Admin user created in Firebase
- [ ] Firestore database created with security rules
- [ ] Firebase Storage configured
- [ ] Firebase config values copied
- [ ] Resend account created
- [ ] Resend API key obtained
- [ ] Bill.com account created
- [ ] Bill.com API credentials obtained
- [ ] All environment variables added to Vercel
- [ ] Project redeployed on Vercel
- [ ] Admin login tested successfully

---

## Troubleshooting

### Firebase Auth Error
- Check that all `NEXT_PUBLIC_FIREBASE_*` variables are set correctly
- Verify Firebase Authentication is enabled
- Check Firestore security rules allow admin access

### Resend Email Not Sending
- Verify `RESEND_API_KEY` is correct
- Check Resend dashboard for error logs
- If using custom domain, ensure DNS is verified

### Bill.com Connection Issues
- Verify you're using `sandbox` environment for testing
- Check API credentials are correct
- Contact Bill.com support if needed

---

## Need Help?

- **Firebase**: https://firebase.google.com/docs
- **Resend**: https://resend.com/docs
- **Bill.com API**: https://developer.bill.com/hc/en-us
- **Vercel**: https://vercel.com/docs

---

**Created for The Esther & Mays Group LLC**
Admin: estherandmays@gmail.com
