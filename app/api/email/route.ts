import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'

// Lazy initialization - only create Resend client when actually needed (not during build)
let resendClient: Resend | null = null

function getResendClient(): Resend {
  if (!resendClient) {
    const apiKey = process.env.RESEND_API_KEY
    if (!apiKey) {
      throw new Error('RESEND_API_KEY environment variable is not set')
    }
    resendClient = new Resend(apiKey)
  }
  return resendClient
}

export async function POST(request: NextRequest) {
  try {
    const { to, subject, html } = await request.json()

    const resend = getResendClient()
    const data = await resend.emails.send({
      from: 'The Esther & Mays Group <notifications@estherandmays.com>',
      to: to,
      subject: subject,
      html: html,
    })

    return NextResponse.json({ success: true, data })
  } catch (error: any) {
    console.error('Email error:', error)
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    )
  }
}
