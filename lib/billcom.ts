import { BillComPayment } from '@/types'

export async function schedulePayment(payment: BillComPayment) {
  try {
    const response = await fetch('/api/billcom', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payment),
    })

    const data = await response.json()

    if (!data.success) {
      throw new Error(data.error || 'Payment scheduling failed')
    }

    return data
  } catch (error) {
    console.error('Payment scheduling error:', error)
    throw error
  }
}

export async function getPaymentStatus(transactionId: string) {
  try {
    const response = await fetch(`/api/billcom?transactionId=${transactionId}`)
    const data = await response.json()

    if (!data.success) {
      throw new Error(data.error || 'Failed to get payment status')
    }

    return data
  } catch (error) {
    console.error('Payment status error:', error)
    throw error
  }
}

export async function sendPaymentNotification(
  recipientEmail: string,
  amount: number,
  date: string,
  contractName: string
) {
  try {
    const { emailTemplates } = await import('@/app/api/email/route')

    const response = await fetch('/api/email', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        to: recipientEmail,
        subject: `Payment Scheduled: $${amount.toLocaleString()}`,
        html: emailTemplates.paymentScheduled(amount, date, contractName),
      }),
    })

    const data = await response.json()

    if (!data.success) {
      throw new Error(data.error || 'Email notification failed')
    }

    return data
  } catch (error) {
    console.error('Email notification error:', error)
    throw error
  }
}
