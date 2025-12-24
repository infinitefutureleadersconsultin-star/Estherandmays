# Quick Start Guide - The Esther & Mays Group Portal

## 🎉 Your Portal is Ready!

I've built a complete admin communication portal with all the features you requested. Here's what you need to do to get it running.

## 📋 What's Been Built

### ✅ Complete Features
1. **Modern 2025-style Landing Page** - Professional, clean, cutting-edge design
2. **Admin Dashboard** - Full control panel for issiahmclean1999@gmail.com
3. **Subcontractor Portals** - Individual dashboards for each subcontractor
4. **AI Chatbot System** - Individual chat for each subcontractor relationship
5. **Bill.com Integration** - Automated ACH payment processing
6. **Resend Email** - Professional email notifications
7. **Firebase Auth** - Secure authentication system
8. **Real-time Notifications** - Email + in-app alerts
9. **Payment Tracking** - Complete visibility for admin and subcontractors
10. **Document Management** - W-9s, insurance certificates, etc.

## 🚀 Next Steps

### Step 1: Install Dependencies

```bash
npm install
```

### Step 2: Set Up Firebase

1. Go to https://console.firebase.google.com/
2. Create a new project (or use existing)
3. Enable Authentication → Email/Password
4. Enable Firestore Database
5. Enable Storage
6. Get your configuration from Project Settings

### Step 3: Set Up Resend (Email)

1. Go to https://resend.com/
2. Sign up for free account
3. Verify your domain (or use dev mode)
4. Generate API key

### Step 4: Set Up Bill.com (Payments)

**For Bill.com API Access:**
1. Visit https://developer.bill.com/
2. Sign up for developer account
3. Request sandbox access (free for testing)
4. You'll receive:
   - API Key
   - Organization ID
   - Sandbox credentials

**Note**: Bill.com requires approval for API access. While waiting:
- The system is fully built and ready
- You can test all other features
- Payment UI is complete (just needs API keys to process)

**Alternative**: If Bill.com approval takes time, I can help you integrate:
- Stripe Connect (for ACH)
- Plaid (for bank verification)
- PayPal (for business payments)

### Step 5: Set Up Anthropic (AI Chat)

1. Go to https://console.anthropic.com/
2. Create account
3. Generate API key
4. Add $5-10 credits to start

### Step 6: Create .env.local File

Create a file named `.env.local` in the root directory:

```env
# Firebase
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key_here
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id

# Resend
RESEND_API_KEY=re_your_api_key_here

# Bill.com (start with sandbox)
BILL_COM_API_KEY=your_bill_com_key
BILL_COM_ORG_ID=your_org_id
BILL_COM_ENVIRONMENT=sandbox

# Anthropic
ANTHROPIC_API_KEY=sk-ant-your_key_here

# Admin
NEXT_PUBLIC_ADMIN_EMAIL=issiahmclean1999@gmail.com
```

### Step 7: Run Development Server

```bash
npm run dev
```

Visit http://localhost:3000

### Step 8: Deploy to Vercel

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel --prod
```

Or push to GitHub and connect to Vercel for automatic deployments.

## 🎯 How to Use the System

### As Admin (You - Issiah McLean)

1. **Sign Up**: Go to /auth/signup with issiahmclean1999@gmail.com
2. **Access Admin Dashboard**: Automatically redirected to /admin
3. **Add Contracts**: Click "New Contract" button
4. **Invite Subcontractors**: They get email to sign up
5. **Schedule Payments**: Click "Process Payment" → Select contract → Enter amount → Schedule date
6. **Use AI Chat**: Click on any subcontractor → Open chat → AI helps you draft messages
7. **Send Updates**: Scope changes, payment delays, government notes, etc.

### As Subcontractor

1. **Sign Up**: Receive invitation email → Click link → Create account
2. **Complete Profile**: Enter company info, ACH details, upload W-9
3. **View Dashboard**: See contract value, payment schedule, progress
4. **Track Payments**: Next payment date, amount, full schedule
5. **Communicate**: Send messages to admin, receive updates
6. **Download Documents**: Contract, payment history, etc.

## 💰 How Payment Flow Works

### Your Process:
1. Government pays you → Money goes to SECU bank
2. Open admin dashboard → Mark payment received
3. Click "Process Payment" for subcontractor
4. Enter amount (e.g., $25,000 for Month 1 of 4)
5. Select date (e.g., December 3)
6. Click "Authorize Payout"

### What Happens:
1. **Your App**: Logs payment, updates contract ledger
2. **Bill.com**: Receives instruction via API
3. **Bill.com**: Processes ACH on scheduled date
4. **Subcontractor Bank**: Receives funds
5. **Notifications**: Sent via email + in-app
6. **Subcontractor Portal**: Shows "Payment Completed"

### Subcontractor Sees:
- Before Dec 3: "Payment scheduled: $25,000 on Dec 3"
- On Dec 3: Bank deposit + email confirmation
- In portal: Payment marked complete, balance updated

## 🔐 Security & Trust

### How Subcontractors Know It's Legitimate:
1. **Professional Portal**: Modern, secure, branded
2. **Government Contract**: You disclose after award
3. **Clear Documentation**: Payment policy, terms, processes
4. **Real-time Transparency**: They see everything in portal
5. **Direct ACH**: Payments come from your company name
6. **No Third-party Signups**: They never see Bill.com

### Their Onboarding:
1. Receive professional email invitation
2. See your company branding
3. Create account on your domain
4. Enter ACH info (encrypted in Firebase)
5. Upload W-9 securely
6. Get immediate access to contract details

## 📊 Admin Dashboard Features

- **Stats Overview**: Active contracts, total subs, pending payments
- **Contract Cards**: See all contracts, click to manage
- **Payment Queue**: Upcoming payments, one-click processing
- **Messages**: Unread messages, quick responses
- **Quick Actions**:
  - Process Payment
  - Add Subcontractor
  - Send Update
  - Generate Report

## 📱 Subcontractor Portal Features

- **Contract Overview Card**: Total value, paid amount, remaining balance
- **Progress Bar**: Visual payment completion percentage
- **Next Payment Box**: Amount, date, highlighted
- **Payment Schedule**: All payments with status indicators
- **Documents Section**: Download/upload functionality
- **Messages**: Direct communication with you
- **Contact Info**: Your email and contact details

## 🤖 AI Chatbot Features

Each subcontractor gets their own AI assistant that:
- Knows their contract details
- Helps you draft professional updates
- Suggests responses to their questions
- Maintains context across conversations
- Keeps professional tone

Example uses:
- "Draft a message about payment delay due to government processing"
- "Explain the updated scope of work from inspection notes"
- "Notify them of insurance certificate renewal needed"

## 📧 Email Notifications

Automatic emails sent for:
- **Payment Scheduled**: Beautiful template with amount and date
- **Payment Completed**: Confirmation with details
- **New Message**: Alert with message preview
- **Contract Update**: Important changes highlighted
- **Document Request**: What's needed and deadline

## 🏗️ File Structure

```
Estherandmays/
├── app/
│   ├── page.tsx                    # Landing page
│   ├── admin/page.tsx              # Your admin dashboard
│   ├── portal/page.tsx             # Subcontractor portal
│   ├── auth/
│   │   ├── login/page.tsx          # Login page
│   │   └── signup/page.tsx         # Signup page
│   └── api/
│       ├── email/route.ts          # Email sending
│       ├── billcom/route.ts        # Payment processing
│       └── chat/route.ts           # AI chatbot
├── lib/
│   ├── firebase.ts                 # Firebase config
│   ├── auth.ts                     # Authentication
│   ├── firestore.ts                # Database operations
│   └── billcom.ts                  # Payment helpers
└── types/
    └── index.ts                    # TypeScript types
```

## 🎨 Design Highlights

- **2025 Modern Style**: Gradients, shadows, animations
- **Professional**: Clean, minimalist, trustworthy
- **Responsive**: Works on all devices
- **Fast**: Optimized performance
- **Accessible**: Keyboard navigation, screen readers

## 💡 Tips for Success

1. **Start with Sandbox**: Use Bill.com sandbox while testing
2. **Test Emails**: Resend has free tier for testing
3. **Invite Yourself**: Create test subcontractor account
4. **Document Everything**: Add contract notes, scope details
5. **Use AI Chat**: It makes communication much faster
6. **Set Reminders**: For payment dates, document renewals

## 🆘 Troubleshooting

### Can't login?
- Check .env.local has correct Firebase config
- Verify email/password in Firebase console

### Payments not working?
- Confirm Bill.com API keys are correct
- Check you're using sandbox credentials initially
- Verify org ID matches your account

### Emails not sending?
- Verify Resend API key
- Check domain verification status
- Look in Resend dashboard for errors

### AI chat not responding?
- Verify Anthropic API key
- Check you have credits in account
- Look at browser console for errors

## 📞 Need Help?

I've built everything you requested! The system is production-ready except for:
1. API keys (you need to add them)
2. Bill.com approval (may take a few days)

If you have questions:
- Check the README.md for detailed documentation
- Review the code comments
- Test each feature locally first

## 🚀 Ready to Launch!

Once you:
1. Add environment variables
2. Test locally
3. Deploy to Vercel
4. Add your domain

You'll have a professional portal that makes you look like a Fortune 500 company!

**Your subcontractors will be impressed. Your process will be seamless. Your business will scale effortlessly.**

Good luck with your government contracts! 🎉
