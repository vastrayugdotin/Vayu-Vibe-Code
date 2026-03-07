// ─────────────────────────────────────────────────────────────
// Vastrayug — Razorpay Server-Side Client & Webhook Verification
// Reference: tech_stack.md §6
//
// Usage:
//   import { razorpay, verifyWebhookSignature } from '@/lib/razorpay'
//
//   // Create an order
//   const order = await razorpay.orders.create({ amount, currency: 'INR', receipt })
//
//   // Verify webhook
//   const valid = verifyWebhookSignature(rawBody, req.headers['x-razorpay-signature'])
// ─────────────────────────────────────────────────────────────

import Razorpay from 'razorpay'
import crypto from 'crypto'

export const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID!,
  key_secret: process.env.RAZORPAY_KEY_SECRET!,
})

/**
 * Verify the signature on an incoming Razorpay webhook request.
 * Razorpay signs the raw request body with the webhook secret using HMAC SHA-256.
 *
 * @param body      - The raw request body string (NOT parsed JSON).
 * @param signature - The `x-razorpay-signature` header value.
 * @returns `true` if the signature is valid.
 */
export function verifyWebhookSignature(
  body: string,
  signature: string
): boolean {
  const expected = crypto
    .createHmac('sha256', process.env.RAZORPAY_WEBHOOK_SECRET!)
    .update(body)
    .digest('hex')

  return crypto.timingSafeEqual(
    Buffer.from(expected, 'hex'),
    Buffer.from(signature, 'hex')
  )
}

/**
 * Verify the payment signature returned by Razorpay Checkout on the client.
 * Used in POST /api/checkout/verify-payment after the user completes payment.
 *
 * @param orderId   - The `razorpay_order_id` from the checkout response.
 * @param paymentId - The `razorpay_payment_id` from the checkout response.
 * @param signature - The `razorpay_signature` from the checkout response.
 * @returns `true` if the signature is valid.
 */
export function verifyPaymentSignature(
  orderId: string,
  paymentId: string,
  signature: string
): boolean {
  const body = orderId + '|' + paymentId
  const expected = crypto
    .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET!)
    .update(body)
    .digest('hex')

  return crypto.timingSafeEqual(
    Buffer.from(expected, 'hex'),
    Buffer.from(signature, 'hex')
  )
}
