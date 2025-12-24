# The Esther & Mays Group - Admin Communication Portal

A comprehensive admin communication and payment management portal for professional procurement and business development.

## Features

### For Admins (issiahmclean1999@gmail.com)
- **Unified Dashboard**: Monitor all contracts, subcontractors, and payments in one place
- **AI-Powered Communication**: Individual AI chatbots for each subcontractor relationship
- **Payment Processing**: Integrated Bill.com for automated ACH payments
- **Contract Management**: Track contract lifecycle from award to completion
- **Real-Time Notifications**: Email and in-app alerts for all activities
- **Document Management**: Secure storage for W-9s, insurance certificates, and contracts

### For Subcontractors
- **Individual Portals**: Each subcontractor gets their own secure dashboard
- **Payment Transparency**: View payment schedules, history, and next payment dates
- **Direct Communication**: Two-way messaging with admin
- **Document Access**: Download and upload required documents
- **Real-Time Updates**: Instant notifications for payments and messages

## Tech Stack

- **Frontend**: Next.js 14, React 18, TypeScript, Tailwind CSS, Framer Motion
- **Authentication**: Firebase Authentication
- **Database**: Cloud Firestore
- **Storage**: Firebase Storage
- **Payments**: Bill.com API
- **Email**: Resend
- **AI Chat**: Anthropic Claude API
- **Deployment**: Vercel

## Setup Instructions

### 1. Clone the Repository

```bash
git clone <repository-url>
cd Estherandmays
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Environment Variables

Create a `.env.local` file in the root directory:

```env
# Firebase Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id

# Resend Email API
RESEND_API_KEY=your_resend_api_key

# Bill.com API
BILL_COM_API_KEY=your_bill_com_api_key
BILL_COM_ORG_ID=your_bill_com_org_id
BILL_COM_ENVIRONMENT=sandbox  # or 'production'

# Anthropic API for AI Chatbot
ANTHROPIC_API_KEY=your_anthropic_api_key

# Admin Email
NEXT_PUBLIC_ADMIN_EMAIL=issiahmclean1999@gmail.com
```

### 4. Firebase Setup

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project
3. Enable Authentication (Email/Password)
4. Enable Cloud Firestore
5. Enable Cloud Storage
6. Copy your configuration to `.env.local`

### 5. Resend Setup

1. Go to [Resend](https://resend.com/)
2. Create an account
3. Verify your domain (or use test mode)
4. Generate an API key
5. Add to `.env.local`

### 6. Bill.com Setup

1. Go to [Bill.com](https://www.bill.com/)
2. Create a developer account
3. Get API credentials
4. Start with sandbox environment
5. Add credentials to `.env.local`

**Note**: To get Bill.com API access:
- Visit: https://developer.bill.com/
- Sign up for a developer account
- Complete the application process
- You'll receive sandbox credentials for testing
- Later, apply for production access

### 7. Anthropic API Setup

1. Go to [Anthropic Console](https://console.anthropic.com/)
2. Create an account
3. Generate an API key
4. Add to `.env.local`

### 8. Run Development Server

```bash
npm run dev
```

Visit `http://localhost:3000`

### 9. Deploy to Vercel

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel --prod
```

Or connect your GitHub repository to Vercel for automatic deployments.

## How It Works

### Payment Flow

1. **Admin** wins a government contract
2. **Admin** enters contract details in the portal
3. **Admin** invites subcontractor (they receive email to sign up)
4. **Subcontractor** creates account and submits ACH info
5. **Admin** schedules payments via the portal
6. **System** sends payment instruction to Bill.com
7. **Bill.com** processes ACH on scheduled date
8. **Subcontractor** receives email and in-app notification
9. **Money** is deposited to subcontractor's bank account

### Communication Flow

1. **Admin** opens AI chat for specific subcontractor
2. **Admin** drafts message using AI assistance
3. **Admin** sends update (scope change, payment delay, etc.)
4. **Subcontractor** receives email notification
5. **Subcontractor** logs in to portal to view message
6. **Subcontractor** can reply via messaging system
7. **Admin** sees unread message notification

## Admin Features

### Dashboard
- View all active contracts at a glance
- Monitor upcoming payments
- Track unread messages
- See contract statistics

### Contract Management
- Add new contracts with detailed information
- Set payment schedules (monthly, milestone-based, etc.)
- Track contract status (pending, active, completed)
- Calculate margins and tax reserves automatically

### Subcontractor Management
- View all subcontractors
- See verification status (pending, verified, suspended)
- Access submitted documents (W-9, insurance, etc.)
- View payment history for each subcontractor

### AI Chat
- Individual chat instance for each subcontractor
- AI helps draft professional updates
- Context-aware responses based on contract details
- Message history and threading

### Payment Processing
- Schedule payments with one click
- Review payment queue
- Track Bill.com transaction status
- Automatic email notifications to subcontractors

## Subcontractor Features

### Dashboard
- View contract overview
- See payment progress bar
- Track next payment date and amount
- Access quick actions

### Payments
- Complete payment schedule visibility
- Payment history with status indicators
- ACH deposit tracking
- Email confirmations

### Documents
- Download contract copy
- Download payment schedules
- Upload required documents
- View document approval status

### Messages
- Direct communication with admin
- Receive updates about contract
- Ask questions about payments
- Get scope of work clarifications

## Security

- Firebase Authentication with email/password
- Admin access restricted to issiahmclean1999@gmail.com
- All sensitive data encrypted in Firestore
- Bank information stored securely
- ACH processing via Bill.com (PCI compliant)
- HTTPS only in production

## File Structure

```
Estherandmays/
├── app/
│   ├── admin/              # Admin dashboard
│   ├── auth/               # Login and signup pages
│   ├── portal/             # Subcontractor portal
│   ├── api/                # API routes
│   │   ├── email/          # Resend email integration
│   │   ├── billcom/        # Bill.com payment API
│   │   └── chat/           # AI chatbot API
│   ├── globals.css         # Global styles
│   ├── layout.tsx          # Root layout
│   └── page.tsx            # Landing page
├── components/             # Reusable components
├── lib/
│   ├── firebase.ts         # Firebase config
│   ├── auth.ts             # Authentication helpers
│   ├── firestore.ts        # Database operations
│   ├── billcom.ts          # Payment helpers
│   └── store.ts            # Zustand state management
├── types/
│   └── index.ts            # TypeScript types
├── public/                 # Static assets
├── .env.local              # Environment variables (create this)
├── .env.example            # Environment template
├── next.config.js          # Next.js configuration
├── tailwind.config.js      # Tailwind CSS configuration
├── tsconfig.json           # TypeScript configuration
└── package.json            # Dependencies

```

## Support

For questions or issues:
- **Email**: issiahmclean1999@gmail.com
- **Admin**: Issiah McLean
- **Company**: The Esther & Mays Group
- **Location**: Charlotte, North Carolina

## License

© 2025 The Esther & Mays Group. All rights reserved.
