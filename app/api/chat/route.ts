import { NextRequest, NextResponse } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY || '',
})

export async function POST(request: NextRequest) {
  try {
    const { messages, contractContext, subcontractorName } = await request.json()

    const systemPrompt = `You are an AI assistant for The Esther & Mays Group, a professional procurement and business development firm. You are helping facilitate communication between the admin (Issiah McLean) and subcontractors.

Current Context:
- Subcontractor: ${subcontractorName}
- Contract: ${contractContext.contractName || 'N/A'}
- Contract Value: ${contractContext.totalAmount ? '$' + contractContext.totalAmount.toLocaleString() : 'N/A'}
- Status: ${contractContext.status || 'N/A'}

Your role:
1. Be professional, clear, and helpful
2. Provide information about contracts, payments, and schedules
3. Help draft messages for the admin to send to subcontractors
4. Answer questions about the payment process and timeline
5. Keep responses concise and actionable

Guidelines:
- Always maintain a professional tone
- For payment questions, reference the scheduled dates and amounts
- For contract questions, reference the scope of work
- If you don't have specific information, acknowledge it
- Suggest when admin should follow up personally`

    const response = await anthropic.messages.create({
      model: 'claude-3-5-sonnet-20241022',
      max_tokens: 1024,
      system: systemPrompt,
      messages: messages,
    })

    const content = response.content[0]
    const textContent = content.type === 'text' ? content.text : ''

    return NextResponse.json({
      success: true,
      message: textContent,
      usage: response.usage,
    })
  } catch (error: any) {
    console.error('AI Chat error:', error)
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    )
  }
}
