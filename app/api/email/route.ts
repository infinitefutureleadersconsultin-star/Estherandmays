import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(request: NextRequest) {
  try {
    const { to, subject, html } = await request.json()

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
