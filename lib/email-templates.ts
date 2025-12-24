/**
 * Email Templates
 * Professional email templates for notifications
 */

export const emailTemplates = {
  paymentScheduled: (amount: number, date: string, contractName: string) => `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #2563eb 0%, #0891b2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f8fafc; padding: 30px; border-radius: 0 0 10px 10px; }
          .payment-box { background: white; border: 2px solid #10b981; border-radius: 10px; padding: 25px; margin: 20px 0; text-align: center; }
          .amount { font-size: 36px; font-weight: bold; color: #10b981; margin: 10px 0; }
          .date { font-size: 18px; color: #0891b2; font-weight: 600; }
          .footer { text-align: center; margin-top: 30px; color: #64748b; font-size: 14px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Payment Scheduled</h1>
          </div>
          <div class="content">
            <p>Good news! Your payment has been scheduled.</p>
            <div class="payment-box">
              <p style="margin: 0; color: #64748b;">Payment Amount</p>
              <div class="amount">$${amount.toLocaleString()}</div>
              <p style="margin: 0; color: #64748b; margin-top: 15px;">Scheduled Date</p>
              <div class="date">${date}</div>
            </div>
            <p><strong>Contract:</strong> ${contractName}</p>
            <p>Funds will be deposited via ACH to your registered bank account on the scheduled date.</p>
            <p>You'll receive another notification once the payment has been processed.</p>
          </div>
          <div class="footer">
            <p>The Esther & Mays Group</p>
            <p>Professional Procurement Solutions</p>
          </div>
        </div>
      </body>
    </html>
  `,

  messageNotification: (senderName: string, message: string, contractName: string) => `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #2563eb 0%, #0891b2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f8fafc; padding: 30px; border-radius: 0 0 10px 10px; }
          .message-box { background: white; border-left: 4px solid #2563eb; padding: 20px; margin: 20px 0; border-radius: 5px; }
          .cta-button { display: inline-block; background: #2563eb; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; margin-top: 20px; }
          .footer { text-align: center; margin-top: 30px; color: #64748b; font-size: 14px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>New Message</h1>
          </div>
          <div class="content">
            <p>You have a new message from <strong>${senderName}</strong></p>
            <p><strong>Contract:</strong> ${contractName}</p>
            <div class="message-box">
              <p style="margin: 0;">${message}</p>
            </div>
            <a href="https://estherandmays.com/portal" class="cta-button">View in Portal</a>
          </div>
          <div class="footer">
            <p>The Esther & Mays Group</p>
            <p>Professional Procurement Solutions</p>
          </div>
        </div>
      </body>
    </html>
  `,

  contractUpdate: (contractName: string, updateDetails: string) => `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #2563eb 0%, #0891b2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f8fafc; padding: 30px; border-radius: 0 0 10px 10px; }
          .update-box { background: white; border: 2px solid #f59e0b; border-radius: 10px; padding: 20px; margin: 20px 0; }
          .footer { text-align: center; margin-top: 30px; color: #64748b; font-size: 14px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Contract Update</h1>
          </div>
          <div class="content">
            <p><strong>Contract:</strong> ${contractName}</p>
            <div class="update-box">
              <h3 style="margin-top: 0; color: #f59e0b;">Important Update</h3>
              <p>${updateDetails}</p>
            </div>
            <p>Please review this update and contact us if you have any questions.</p>
          </div>
          <div class="footer">
            <p>The Esther & Mays Group</p>
            <p>Professional Procurement Solutions</p>
          </div>
        </div>
      </body>
    </html>
  `,
}
