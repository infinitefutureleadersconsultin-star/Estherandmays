import { NextRequest, NextResponse } from 'next/server'

const BILL_COM_API_URL = process.env.BILL_COM_ENVIRONMENT === 'production'
  ? 'https://api.bill.com/api/v2'
  : 'https://api-sandbox.bill.com/api/v2'

const BILL_COM_API_KEY = process.env.BILL_COM_API_KEY
const BILL_COM_ORG_ID = process.env.BILL_COM_ORG_ID

interface BillComPaymentRequest {
  vendorId: string
  amount: number
  scheduledDate: string
  description: string
  contractId: string
}

export async function POST(request: NextRequest) {
  try {
    const paymentData: BillComPaymentRequest = await request.json()

    // Bill.com API call to create payment
    const response = await fetch(`${BILL_COM_API_URL}/CreateBillPayment`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        devKey: BILL_COM_API_KEY,
        orgId: BILL_COM_ORG_ID,
        data: {
          vendorId: paymentData.vendorId,
          amount: paymentData.amount,
          processDate: paymentData.scheduledDate,
          description: paymentData.description,
          // Additional Bill.com specific fields
        },
      }),
    })

    const result = await response.json()

    if (result.response_status === 0) {
      return NextResponse.json({
        success: true,
        transactionId: result.response_data.id,
        data: result.response_data,
      })
    } else {
      throw new Error(result.response_message || 'Bill.com payment failed')
    }
  } catch (error: any) {
    console.error('Bill.com payment error:', error)
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    )
  }
}

// Get payment status
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const transactionId = searchParams.get('transactionId')

    if (!transactionId) {
      return NextResponse.json(
        { success: false, error: 'Transaction ID required' },
        { status: 400 }
      )
    }

    const response = await fetch(`${BILL_COM_API_URL}/GetBillPayment`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        devKey: BILL_COM_API_KEY,
        orgId: BILL_COM_ORG_ID,
        data: {
          id: transactionId,
        },
      }),
    })

    const result = await response.json()

    if (result.response_status === 0) {
      return NextResponse.json({
        success: true,
        status: result.response_data.status,
        data: result.response_data,
      })
    } else {
      throw new Error(result.response_message || 'Failed to get payment status')
    }
  } catch (error: any) {
    console.error('Bill.com status check error:', error)
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    )
  }
}
