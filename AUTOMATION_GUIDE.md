# In-House Automation Engine Guide

## What is the Automation Engine?

The Automation Engine is the **"brain" of your application** - an intelligent system that runs entirely in-house, **without any external API calls**. It automatically manages workflows, updates statuses, sends notifications, and handles business logic.

Think of it as your **virtual assistant** that never sleeps, constantly monitoring your contracts, payments, and subcontractors to ensure everything runs smoothly.

## Key Features

### 🤖 Fully Automated Workflows

The engine handles complex multi-step processes automatically:

**Payment Processing Workflow**:
1. Receives payment instruction from admin
2. Updates payment status in database
3. Sends email notification to subcontractor
4. Creates in-app notification
5. Sends confirmation to admin
6. Updates contract progress automatically

**Onboarding Workflow**:
1. New subcontractor signs up
2. Welcome message sent automatically
3. Document upload reminders created
4. Onboarding checklist generated
5. Admin notified of new partner

**Contract Completion Workflow**:
1. Last payment marked complete
2. Contract status automatically updated
3. Completion notifications sent
4. Summary report generated
5. Archive process initiated

### 📅 Smart Scheduling

Automation rules run on a schedule (every 5 minutes by default):

- **7-Day Payment Reminders**: Notifies subcontractors 1 week before payment
- **3-Day Payment Reminders**: Second reminder 3 days out
- **1-Day Payment Reminders**: Final reminder day before
- **Same-Day Processing**: Automatically processes scheduled payments
- **Document Expiration Alerts**: Reminds 30 days before documents expire
- **Milestone Tracking**: Updates contract progress automatically

### 🎯 Rule-Based Intelligence

Each automation rule has:
- **Condition**: When should it run?
- **Action**: What should it do?
- **Status**: Active, paused, or error
- **Execution History**: Track what's been done

### 📊 Real-Time Status Management

The Smart Status Manager automatically:
- Updates contract status based on payment progress
- Marks payments as overdue if past due date
- Calculates completion percentages
- Transitions contracts through lifecycle stages
- Detects and flags issues

## How to Access

### Admin Dashboard:
1. Log in to your admin account
2. Go to Dashboard → Quick Actions
3. Click "Automation Engine"

Or visit directly: `/admin/automation`

## Automation Dashboard

The dashboard shows you:

### Stats Overview
- **Total Executions**: How many times rules have run
- **Active Rules**: Currently enabled automations
- **System Health**: Overall performance metric
- **Last Run Time**: Most recent execution

### Automation Rules List

Each rule shows:
- **Name**: What it does
- **Status**: Active, paused, or error
- **Last Run**: When it last executed
- **Execution Count**: Total times run
- **Controls**: Enable/disable, run manually

### Manual Triggers

You can manually execute workflows:
- **Process Payment**: Trigger payment workflow for specific contract
- **Onboard Subcontractor**: Start onboarding process
- **Send Reminder**: Manual reminder to subcontractor
- **Update Contract**: Run contract update workflow

## Available Workflows

### 1. Payment Workflow
```typescript
WorkflowOrchestrator.executePaymentWorkflow(
  paymentId,
  amount,
  scheduledDate,
  contractId,
  subcontractorId,
  subcontractorEmail,
  contractName
)
```

**What it does**:
- Updates payment status to "processing"
- Sends beautiful email with payment details
- Creates in-app notification for subcontractor
- Notifies admin of successful scheduling
- Updates contract payment progress

### 2. Onboarding Workflow
```typescript
WorkflowOrchestrator.executeOnboardingWorkflow(
  subcontractorId,
  subcontractorEmail,
  contractId
)
```

**What it does**:
- Sends personalized welcome message
- Creates document upload reminders
- Sets up initial contract visibility
- Notifies admin of new partner

### 3. Contract Completion Workflow
```typescript
WorkflowOrchestrator.executeContractCompletionWorkflow(
  contractId,
  subcontractorId,
  contractName
)
```

**What it does**:
- Marks contract as completed
- Sends completion congratulations to subcontractor
- Notifies admin with summary
- Archives contract data

### 4. Document Reminder Workflow
```typescript
WorkflowOrchestrator.executeDocumentReminderWorkflow(
  subcontractorId,
  documentType,
  expirationDate
)
```

**What it does**:
- Checks document expiration dates
- Sends reminder notifications
- Creates task for document upload
- Escalates if ignored

## Automation Rules

### Payment Reminders
- **7-Day Reminder**: "Payment of $25,000 coming up on Dec 3"
- **3-Day Reminder**: "Reminder: Payment scheduled in 3 days"
- **1-Day Reminder**: "Your payment arrives tomorrow!"

### Process Scheduled Payments
- Runs daily at midnight
- Finds all payments due today
- Triggers Bill.com API automatically
- Sends notifications

### Payment Status Checker
- Monitors "processing" payments
- Checks Bill.com for completion
- Updates status when complete
- Notifies all parties

### Document Expiration Checker
- Scans all subcontractor documents
- Flags expirations within 30 days
- Sends renewal reminders
- Escalates if critical

### Contract Milestone Updates
- Calculates payment progress
- Updates completion percentages
- Transitions contract stages
- Notifies on milestones (25%, 50%, 75%, 100%)

### Welcome Messages
- Detects new subcontractor signups
- Sends welcome message within 1 hour
- Provides onboarding instructions
- Sets expectations

## How It Makes the Process Seamless

### For Subcontractors:
They **never need to contact customer service** because:

1. **Payment Visibility**: They see exact payment schedule, amounts, dates
2. **Automatic Reminders**: Get notified before each payment
3. **Status Updates**: Real-time progress tracking
4. **Document Prompts**: Reminded before documents expire
5. **Clear Next Steps**: Always know what to do next

### For You (Admin):
You **never have to manually remember** to:

1. Send payment reminders
2. Update contract statuses
3. Notify about documents
4. Track milestones
5. Follow up on tasks

**Everything happens automatically!**

## Customization

### Enable/Disable Rules
- Click toggle button next to any rule
- Disabled rules won't run automatically
- Can still trigger manually

### Manual Execution
- Click "Run Now" to execute immediately
- Useful for testing or one-off needs
- Doesn't affect automatic schedule

### Configure Timing
Edit in `lib/automation.ts`:
```typescript
// Current: runs every 5 minutes
setInterval(() => {
  this.executeRules()
}, 5 * 60 * 1000)

// Change to run every hour:
setInterval(() => {
  this.executeRules()
}, 60 * 60 * 1000)
```

## Technical Details

### Architecture
- **Singleton Pattern**: One engine instance across the app
- **Rule-Based System**: Each rule has condition and action
- **Event-Driven**: Responds to database changes
- **Stateless**: Doesn't maintain state between runs
- **Idempotent**: Safe to run multiple times

### Server-Side Execution
The automation engine runs **server-side only**:
```typescript
if (typeof window === 'undefined') {
  // Only runs on server, not in browser
  automationEngine.start()
}
```

### Error Handling
- Failed rules log errors but don't crash the system
- Continues executing other rules
- Errors visible in admin dashboard
- Retry logic for transient failures

## Monitoring

### View Execution History
Check the automation dashboard to see:
- How many times each rule has run
- When it last executed
- Current status
- Any errors

### System Health
Overall health score based on:
- Rule success rate
- Execution frequency
- Error count
- Response time

## Adding New Rules

To add a custom automation rule:

1. **Open** `lib/automation.ts`

2. **Add to** `initializeRules()`:
```typescript
{
  id: 'my-custom-rule',
  name: 'My Custom Automation',
  condition: () => true, // When to run
  action: async () => {
    // What to do
    console.log('Running my custom rule!')
  },
  enabled: true,
}
```

3. **Deploy** and the new rule automatically appears in dashboard

## Best Practices

### ✅ Do:
- Keep rules focused on single responsibility
- Use descriptive names
- Log important actions
- Handle errors gracefully
- Test rules manually first

### ❌ Don't:
- Create rules that conflict
- Make external API calls in rules (use workflows)
- Store state in rules
- Skip error handling
- Create duplicate logic

## Troubleshooting

### Rule Not Running
1. Check if rule is enabled
2. Verify condition returns true
3. Check server logs for errors
4. Try manual execution

### Action Not Working
1. Check database permissions
2. Verify API keys (for email, etc.)
3. Look for error messages
4. Test workflow in isolation

### Performance Issues
1. Reduce check frequency
2. Disable unused rules
3. Optimize database queries
4. Monitor execution time

## Examples

### Example: Send Custom Message to All Subcontractors
```typescript
const rule = {
  id: 'monthly-update',
  name: 'Send monthly update to all subs',
  condition: () => {
    // Run on 1st of each month
    return new Date().getDate() === 1
  },
  action: async () => {
    const subs = await getAllSubcontractors()
    for (const sub of subs) {
      await sendMessage({
        contractId: sub.activeContractId,
        senderId: 'admin',
        senderName: 'Issiah McLean',
        senderRole: 'admin',
        content: 'Monthly update: All contracts progressing smoothly!',
        type: 'update',
        read: false,
      })
    }
  },
  enabled: true,
}
```

### Example: Auto-Complete Contracts
```typescript
const rule = {
  id: 'auto-complete-contracts',
  name: 'Mark contracts complete when all payments done',
  condition: () => true,
  action: async () => {
    const contracts = await getAllContracts()
    for (const contract of contracts) {
      const payments = await getPaymentsByContract(contract.id)
      const allPaid = payments.every(p => p.status === 'completed')

      if (allPaid && contract.status !== 'completed') {
        await WorkflowOrchestrator.executeContractCompletionWorkflow(
          contract.id,
          contract.subcontractorId,
          contract.contractNumber
        )
      }
    }
  },
  enabled: true,
}
```

## Summary

The In-House Automation Engine is your **virtual operations manager** that:

✅ Runs 24/7 automatically
✅ Handles complex workflows
✅ Sends timely notifications
✅ Updates statuses intelligently
✅ Ensures nothing falls through cracks
✅ Makes the process seamless for subcontractors
✅ Saves you hours of manual work

**No external API calls. No extra costs. Fully under your control.**

It's the reason subcontractors won't need customer service - because the system is so smart, transparent, and proactive that everything just works.
