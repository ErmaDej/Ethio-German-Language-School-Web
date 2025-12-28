/**
 * Chapa Payment Gateway Service
 * Handles payment initialization and verification with Chapa API
 */

interface ChapaConfig {
  publicKey: string
  secretKey: string
  encryptionKey?: string
  baseUrl: string
}

interface InitializePaymentParams {
  amount: number // Amount in ETB
  currency: string // 'ETB'
  email: string
  first_name: string
  last_name: string
  phone_number?: string
  tx_ref: string // Unique transaction reference
  callback_url: string
  return_url: string
  customization?: {
    title?: string
    description?: string
    logo?: string
  }
}

interface ChapaInitializeResponse {
  status: string
  message: string
  data?: {
    checkout_url: string
    tx_ref: string
  }
}

interface ChapaVerifyResponse {
  status: string
  message: string
  data?: {
    status: string
    tx_ref: string
    amount: number
    currency: string
    created_at: string
  }
}

/**
 * Get Chapa configuration based on environment
 */
export function getChapaConfig(): ChapaConfig {
  const isProduction = process.env.NODE_ENV === 'production'
  
  return {
    publicKey: process.env.NEXT_PUBLIC_CHAPA_PUBLIC_KEY || '',
    secretKey: process.env.CHAPA_SECRET_KEY || '',
    encryptionKey: process.env.CHAPA_ENCRYPTION_KEY,
    baseUrl: isProduction 
      ? 'https://api.chapa.co/v1' 
      : 'https://api.chapa.co/v1' // Chapa uses same URL for test and production, controlled by keys
  }
}

/**
 * Initialize a payment with Chapa
 */
export async function initializePayment(
  params: InitializePaymentParams
): Promise<{ paymentUrl: string; txRef: string }> {
  const config = getChapaConfig()
  
  if (!config.secretKey) {
    throw new Error('Chapa secret key is not configured')
  }

  const payload = {
    amount: params.amount.toString(),
    currency: params.currency,
    email: params.email,
    first_name: params.first_name,
    last_name: params.last_name,
    phone_number: params.phone_number || '',
    tx_ref: params.tx_ref,
    callback_url: params.callback_url,
    return_url: params.return_url,
    customization: params.customization || {}
  }

  try {
    const response = await fetch(`${config.baseUrl}/transaction/initialize`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${config.secretKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new Error(
        errorData.message || `Chapa API error: ${response.statusText}`
      )
    }

    const data: ChapaInitializeResponse = await response.json()

    if (data.status !== 'success' || !data.data?.checkout_url) {
      throw new Error(data.message || 'Failed to initialize payment')
    }

    return {
      paymentUrl: data.data.checkout_url,
      txRef: data.data.tx_ref,
    }
  } catch (error) {
    console.error('Chapa payment initialization error:', error)
    throw error instanceof Error 
      ? error 
      : new Error('Failed to initialize payment with Chapa')
  }
}

/**
 * Verify a payment transaction with Chapa
 */
export async function verifyPayment(
  txRef: string
): Promise<{
  status: 'success' | 'failed' | 'pending'
  amount: number
  currency: string
  createdAt: string
}> {
  const config = getChapaConfig()
  
  if (!config.secretKey) {
    throw new Error('Chapa secret key is not configured')
  }

  try {
    const response = await fetch(`${config.baseUrl}/transaction/verify/${txRef}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${config.secretKey}`,
        'Content-Type': 'application/json',
      },
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new Error(
        errorData.message || `Chapa API error: ${response.statusText}`
      )
    }

    const data: ChapaVerifyResponse = await response.json()

    if (data.status !== 'success' || !data.data) {
      throw new Error(data.message || 'Failed to verify payment')
    }

    // Map Chapa status to our payment status
    let status: 'success' | 'failed' | 'pending' = 'pending'
    if (data.data.status === 'successful' || data.data.status === 'success') {
      status = 'success'
    } else if (data.data.status === 'failed' || data.data.status === 'cancelled') {
      status = 'failed'
    }

    return {
      status,
      amount: data.data.amount,
      currency: data.data.currency,
      createdAt: data.data.created_at,
    }
  } catch (error) {
    console.error('Chapa payment verification error:', error)
    throw error instanceof Error 
      ? error 
      : new Error('Failed to verify payment with Chapa')
  }
}

/**
 * Generate a unique transaction reference
 */
export function generateTxRef(enrollmentId: string): string {
  const timestamp = Date.now()
  const random = Math.random().toString(36).substring(2, 9)
  return `ETHIOGERMAN-${enrollmentId.substring(0, 8)}-${timestamp}-${random}`.toUpperCase()
}

/**
 * Verify webhook signature (if Chapa provides signature verification)
 * Note: Check Chapa documentation for webhook signature verification method
 */
export function verifyWebhookSignature(
  payload: string,
  signature: string
): boolean {
  // TODO: Implement webhook signature verification based on Chapa documentation
  // This is a placeholder - Chapa may use HMAC or other signature methods
  const webhookSecret = process.env.CHAPA_WEBHOOK_SECRET
  
  if (!webhookSecret) {
    console.warn('Chapa webhook secret not configured, skipping signature verification')
    return true // Allow in development, but should verify in production
  }

  // Implement signature verification here based on Chapa's method
  // Example (adjust based on actual Chapa implementation):
  // const crypto = require('crypto')
  // const expectedSignature = crypto
  //   .createHmac('sha256', webhookSecret)
  //   .update(payload)
  //   .digest('hex')
  // return crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expectedSignature))

  return true // Placeholder - implement actual verification
}

