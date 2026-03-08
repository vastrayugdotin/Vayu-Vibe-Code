// ─────────────────────────────────────────────────────────────
// Vastrayug — SendGrid Transactional Email
// Reference: tech_stack.md §7
//
// Usage:
//   import { sendTransactionalEmail } from '@/lib/sendgrid'
//
//   await sendTransactionalEmail(
//     'customer@example.com',
//     process.env.SENDGRID_TEMPLATE_ORDER_CONFIRM!,
//     { orderNumber: 'VY-20260306-001', items: [...], total: '₹1,999' }
//   )
//
// Errors are logged but never thrown — a failed email must not
// break the order flow or crash an API route.
// ─────────────────────────────────────────────────────────────

import sgMail from "@sendgrid/mail";

sgMail.setApiKey(process.env.SENDGRID_API_KEY!);

/**
 * Send a transactional email via a SendGrid dynamic template.
 *
 * @param to          - Recipient email address.
 * @param templateId  - SendGrid dynamic template ID (e.g. `d-xxxx`).
 * @param dynamicData - Key-value data injected into the template's Handlebars variables.
 */
export async function sendTransactionalEmail(
  to: string,
  templateId: string,
  dynamicData: Record<string, unknown>,
): Promise<void> {
  try {
    await sgMail.send({
      to,
      from: {
        email: process.env.SENDGRID_FROM_EMAIL!,
        name: "Vastrayug",
      },
      templateId,
      dynamicTemplateData: dynamicData,
    });
  } catch (error) {
    console.error(
      "[SendGrid] Failed to send email",
      { to, templateId },
      error instanceof Error ? error.message : error,
    );
  }
}
