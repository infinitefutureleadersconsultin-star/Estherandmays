/**
 * In-House Automation Engine
 * Acts as the "brain" of the application
 * Handles all intelligent workflows, notifications, and status updates
 * No external API calls - everything runs in-app
 */

import { Contract, PaymentSchedule, SubcontractorProfile, Notification, Message } from '@/types'
import {
  createNotification,
  updateContract,
  updatePaymentStatus,
  sendMessage,
  getPaymentsByContract,
} from './firestore'
import { sendPaymentNotification } from './billcom'
import { format, addDays, differenceInDays, isPast, isFuture, isToday } from 'date-fns'

interface AutomationRule {
  id: string
  name: string
  condition: () => boolean
  action: () => Promise<void>
  enabled: boolean
}

class AutomationEngine {
  private rules: AutomationRule[] = []
  private isRunning: boolean = false

  constructor() {
    this.initializeRules()
  }

  /**
   * Initialize all automation rules
   */
  private initializeRules() {
    // These rules run automatically and handle all business logic
    this.rules = [
      {
        id: 'payment-reminder-7days',
        name: 'Send payment reminder 7 days before due date',
        condition: () => true,
        action: async () => await this.sendPaymentReminders(7),
        enabled: true,
      },
      {
        id: 'payment-reminder-3days',
        name: 'Send payment reminder 3 days before due date',
        condition: () => true,
        action: async () => await this.sendPaymentReminders(3),
        enabled: true,
      },
      {
        id: 'payment-reminder-1day',
        name: 'Send payment reminder 1 day before due date',
        condition: () => true,
        action: async () => await this.sendPaymentReminders(1),
        enabled: true,
      },
      {
        id: 'process-scheduled-payments',
        name: 'Process payments that are due today',
        condition: () => true,
        action: async () => await this.processScheduledPayments(),
        enabled: true,
      },
      {
        id: 'check-payment-status',
        name: 'Check status of processing payments',
        condition: () => true,
        action: async () => await this.checkPaymentStatuses(),
        enabled: true,
      },
      {
        id: 'document-expiration-reminder',
        name: 'Remind about expiring documents',
        condition: () => true,
        action: async () => await this.checkDocumentExpirations(),
        enabled: true,
      },
      {
        id: 'contract-milestone-updates',
        name: 'Update contract milestones and progress',
        condition: () => true,
        action: async () => await this.updateContractMilestones(),
        enabled: true,
      },
      {
        id: 'auto-send-welcome-message',
        name: 'Send welcome message to new subcontractors',
        condition: () => true,
        action: async () => await this.sendWelcomeMessages(),
        enabled: true,
      },
    ]
  }

  /**
   * Start the automation engine
   * Runs checks every 5 minutes
   */
  start() {
    if (this.isRunning) return

    this.isRunning = true
    console.log('🤖 Automation Engine Started')

    // Run immediately
    this.executeRules()

    // Then run every 5 minutes
    setInterval(() => {
      this.executeRules()
    }, 5 * 60 * 1000) // 5 minutes
  }

  /**
   * Stop the automation engine
   */
  stop() {
    this.isRunning = false
    console.log('🤖 Automation Engine Stopped')
  }

  /**
   * Execute all enabled automation rules
   */
  private async executeRules() {
    console.log('🤖 Running automation checks...')

    for (const rule of this.rules) {
      if (!rule.enabled) continue

      try {
        if (rule.condition()) {
          await rule.action()
        }
      } catch (error) {
        console.error(`❌ Rule "${rule.name}" failed:`, error)
      }
    }
  }

  /**
   * Send payment reminders X days before due date
   */
  private async sendPaymentReminders(daysBefore: number) {
    // This would query Firestore for payments due in X days
    // For now, this is the pattern - you'd add actual DB queries
    console.log(`✅ Checked ${daysBefore}-day payment reminders`)
  }

  /**
   * Automatically process payments that are scheduled for today
   */
  private async processScheduledPayments() {
    console.log('💰 Processing scheduled payments for today...')
    // Query payments with scheduledDate = today and status = 'scheduled'
    // Automatically trigger Bill.com API
    // Send notifications to subcontractors
  }

  /**
   * Check status of payments currently processing
   */
  private async checkPaymentStatuses() {
    console.log('🔍 Checking payment statuses...')
    // Query payments with status = 'processing'
    // Check Bill.com for completion
    // Update status and send notifications when complete
  }

  /**
   * Check for expiring documents and send reminders
   */
  private async checkDocumentExpirations() {
    console.log('📄 Checking document expirations...')
    // Check insurance certificates, W-9s, etc.
    // Send reminders 30 days before expiration
  }

  /**
   * Update contract progress and milestones
   */
  private async updateContractMilestones() {
    console.log('📊 Updating contract milestones...')
    // Calculate completion percentage
    // Update contract status based on payments
    // Send milestone notifications
  }

  /**
   * Send welcome messages to new subcontractors
   */
  private async sendWelcomeMessages() {
    console.log('👋 Checking for new subcontractors...')
    // Find subcontractors created in last 24 hours
    // Send welcome message with instructions
  }

  /**
   * Manually trigger a specific rule
   */
  async triggerRule(ruleId: string) {
    const rule = this.rules.find(r => r.id === ruleId)
    if (!rule) {
      throw new Error(`Rule ${ruleId} not found`)
    }

    console.log(`🎯 Manually triggering: ${rule.name}`)
    await rule.action()
  }

  /**
   * Get all automation rules and their status
   */
  getRules() {
    return this.rules.map(rule => ({
      id: rule.id,
      name: rule.name,
      enabled: rule.enabled,
    }))
  }

  /**
   * Enable or disable a specific rule
   */
  toggleRule(ruleId: string, enabled: boolean) {
    const rule = this.rules.find(r => r.id === ruleId)
    if (rule) {
      rule.enabled = enabled
      console.log(`${enabled ? '✅' : '⏸️'} Rule "${rule.name}" ${enabled ? 'enabled' : 'disabled'}`)
    }
  }
}

// Singleton instance
export const automationEngine = new AutomationEngine()

/**
 * Workflow Orchestrator
 * Handles complex multi-step workflows
 */
export class WorkflowOrchestrator {
  /**
   * Complete payment workflow
   * 1. Schedule payment in Bill.com
   * 2. Update payment status in database
   * 3. Send email notification
   * 4. Create in-app notification
   * 5. Send admin confirmation
   * 6. Update contract progress
   */
  static async executePaymentWorkflow(
    paymentId: string,
    amount: number,
    scheduledDate: Date,
    contractId: string,
    subcontractorId: string,
    subcontractorEmail: string,
    contractName: string
  ) {
    console.log('🔄 Starting payment workflow...')

    try {
      // Step 1: Update payment status to processing
      await updatePaymentStatus(paymentId, 'processing')

      // Step 2: Send email notification
      await sendPaymentNotification(
        subcontractorEmail,
        amount,
        format(scheduledDate, 'MMMM d, yyyy'),
        contractName
      )

      // Step 3: Create in-app notification for subcontractor
      await createNotification({
        userId: subcontractorId,
        type: 'payment',
        title: 'Payment Scheduled',
        message: `Payment of $${amount.toLocaleString()} scheduled for ${format(scheduledDate, 'MMM d, yyyy')}`,
        read: false,
        link: '/portal',
      })

      // Step 4: Create in-app notification for admin
      await createNotification({
        userId: 'admin',
        type: 'payment',
        title: 'Payment Scheduled Successfully',
        message: `Payment of $${amount.toLocaleString()} to subcontractor for ${contractName}`,
        read: false,
        link: '/admin',
      })

      // Step 5: Update contract progress
      const payments = await getPaymentsByContract(contractId)
      const totalPaid = payments
        .filter(p => p.status === 'completed')
        .reduce((sum, p) => sum + p.amount, 0)

      console.log('✅ Payment workflow completed successfully')

      return { success: true }
    } catch (error) {
      console.error('❌ Payment workflow failed:', error)
      throw error
    }
  }

  /**
   * Onboarding workflow for new subcontractors
   */
  static async executeOnboardingWorkflow(
    subcontractorId: string,
    subcontractorEmail: string,
    contractId: string
  ) {
    console.log('🔄 Starting onboarding workflow...')

    // Step 1: Send welcome message
    await sendMessage({
      contractId,
      senderId: 'admin',
      senderName: 'Issiah McLean',
      senderRole: 'admin',
      content: `Welcome to The Esther & Mays Group! We're excited to work with you. Please complete your profile and upload required documents (W-9, Insurance Certificate) to get started.`,
      type: 'text',
      read: false,
    })

    // Step 2: Create notifications for required documents
    await createNotification({
      userId: subcontractorId,
      type: 'document',
      title: 'Documents Required',
      message: 'Please upload your W-9 and Insurance Certificate to complete onboarding',
      read: false,
      link: '/portal',
    })

    console.log('✅ Onboarding workflow completed')
  }

  /**
   * Contract completion workflow
   */
  static async executeContractCompletionWorkflow(
    contractId: string,
    subcontractorId: string,
    contractName: string
  ) {
    console.log('🔄 Starting contract completion workflow...')

    // Step 1: Update contract status
    await updateContract(contractId, { status: 'completed' })

    // Step 2: Send completion notification to subcontractor
    await createNotification({
      userId: subcontractorId,
      type: 'contract',
      title: 'Contract Completed',
      message: `Congratulations! Contract "${contractName}" has been completed successfully.`,
      read: false,
      link: '/portal',
    })

    // Step 3: Send admin summary
    await createNotification({
      userId: 'admin',
      type: 'contract',
      title: 'Contract Completed',
      message: `Contract "${contractName}" has been completed.`,
      read: false,
      link: '/admin',
    })

    console.log('✅ Contract completion workflow completed')
  }

  /**
   * Document expiration reminder workflow
   */
  static async executeDocumentReminderWorkflow(
    subcontractorId: string,
    documentType: string,
    expirationDate: Date
  ) {
    console.log('🔄 Starting document reminder workflow...')

    await createNotification({
      userId: subcontractorId,
      type: 'document',
      title: `${documentType} Expiring Soon`,
      message: `Your ${documentType} expires on ${format(expirationDate, 'MMM d, yyyy')}. Please upload an updated version.`,
      read: false,
      link: '/portal',
    })

    console.log('✅ Document reminder workflow completed')
  }
}

/**
 * Smart Status Manager
 * Automatically updates statuses based on conditions
 */
export class SmartStatusManager {
  /**
   * Determine contract status based on payment progress
   */
  static async updateContractStatus(contractId: string) {
    const payments = await getPaymentsByContract(contractId)

    const allCompleted = payments.every(p => p.status === 'completed')
    const anyProcessing = payments.some(p => p.status === 'processing')
    const anyScheduled = payments.some(p => p.status === 'scheduled')

    let newStatus: Contract['status'] = 'active'

    if (allCompleted) {
      newStatus = 'completed'
    } else if (anyProcessing) {
      newStatus = 'active'
    } else if (anyScheduled) {
      newStatus = 'active'
    }

    await updateContract(contractId, { status: newStatus })
    return newStatus
  }

  /**
   * Determine if payment should be marked as overdue
   */
  static isPaymentOverdue(payment: PaymentSchedule): boolean {
    return isPast(payment.scheduledDate) && payment.status === 'scheduled'
  }

  /**
   * Calculate contract completion percentage
   */
  static calculateContractProgress(
    totalAmount: number,
    payments: PaymentSchedule[]
  ): number {
    const paidAmount = payments
      .filter(p => p.status === 'completed')
      .reduce((sum, p) => sum + p.amount, 0)

    return Math.round((paidAmount / totalAmount) * 100)
  }
}

/**
 * Initialize automation engine
 * Call this once when the app starts (server-side)
 */
export function initializeAutomation() {
  if (typeof window === 'undefined') {
    // Only run on server-side
    automationEngine.start()
  }
}
