import { NextRequest, NextResponse } from 'next/server'
import { automationEngine, WorkflowOrchestrator } from '@/lib/automation'

// Get all automation rules
export async function GET(request: NextRequest) {
  try {
    const rules = automationEngine.getRules()
    return NextResponse.json({ success: true, rules })
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    )
  }
}

// Trigger automation rules or workflows
export async function POST(request: NextRequest) {
  try {
    const { action, ruleId, workflow, data } = await request.json()

    if (action === 'trigger-rule') {
      await automationEngine.triggerRule(ruleId)
      return NextResponse.json({ success: true, message: 'Rule triggered successfully' })
    }

    if (action === 'toggle-rule') {
      const { enabled } = data
      automationEngine.toggleRule(ruleId, enabled)
      return NextResponse.json({ success: true, message: 'Rule toggled successfully' })
    }

    if (action === 'execute-workflow') {
      switch (workflow) {
        case 'payment':
          await WorkflowOrchestrator.executePaymentWorkflow(
            data.paymentId,
            data.amount,
            new Date(data.scheduledDate),
            data.contractId,
            data.subcontractorId,
            data.subcontractorEmail,
            data.contractName
          )
          break

        case 'onboarding':
          await WorkflowOrchestrator.executeOnboardingWorkflow(
            data.subcontractorId,
            data.subcontractorEmail,
            data.contractId
          )
          break

        case 'contract-completion':
          await WorkflowOrchestrator.executeContractCompletionWorkflow(
            data.contractId,
            data.subcontractorId,
            data.contractName
          )
          break

        case 'document-reminder':
          await WorkflowOrchestrator.executeDocumentReminderWorkflow(
            data.subcontractorId,
            data.documentType,
            new Date(data.expirationDate)
          )
          break

        default:
          throw new Error(`Unknown workflow: ${workflow}`)
      }

      return NextResponse.json({ success: true, message: 'Workflow executed successfully' })
    }

    throw new Error('Invalid action')
  } catch (error: any) {
    console.error('Automation API error:', error)
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    )
  }
}
