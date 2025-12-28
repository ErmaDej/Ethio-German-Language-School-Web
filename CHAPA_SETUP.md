# Chapa Payment Integration Setup Guide

This guide will help you set up the Chapa payment gateway integration for the EthioGerman Language School web application.

## Prerequisites

1. Chapa account with test credentials
2. Supabase project with database access
3. Environment variables configured

## Step 1: Database Setup

Run the following SQL scripts in your Supabase SQL Editor in order:

1. **`scripts/008_add_payment_integration.sql`** - Creates payments table, updates schema
2. **`scripts/009_create_cancel_unpaid_function.sql`** - Creates utility functions and views

### Important Notes:
- The migration script will convert `price_usd` to `price_etb` using a conversion rate of 55 ETB per USD
- Update the conversion rate in the script if needed before running
- After verifying the migration, you can drop the `price_usd` column manually

## Step 2: Environment Variables

Add the following environment variables to your `.env.local` file:

```env
# Chapa Payment Gateway Configuration
NEXT_PUBLIC_CHAPA_PUBLIC_KEY=your_test_public_key
CHAPA_SECRET_KEY=your_test_secret_key
CHAPA_ENCRYPTION_KEY=your_encryption_key
CHAPA_WEBHOOK_SECRET=your_webhook_secret

# Payment Settings
PAYMENT_TIMEOUT_HOURS=24
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Cron Job Secret (for auto-cancellation)
CRON_SECRET=your_random_secret_string
```

### For Production:
- Replace test keys with production keys from Chapa dashboard
- Update `NEXT_PUBLIC_APP_URL` to your production domain
- Ensure `CHAPA_WEBHOOK_SECRET` matches your Chapa webhook configuration

## Step 3: Configure Chapa Webhook

1. Log in to your Chapa dashboard
2. Navigate to Webhooks section
3. Add webhook URL: `https://yourdomain.com/api/webhooks/chapa`
4. Copy the webhook secret and add it to `CHAPA_WEBHOOK_SECRET`

## Step 4: Set Up Auto-Cancellation Cron Job

You have two options:

### Option A: Vercel Cron (Recommended for Vercel deployments)

Add to `vercel.json`:
```json
{
  "crons": [{
    "path": "/api/cron/cancel-unpaid-enrollments",
    "schedule": "0 * * * *"
  }]
}
```

### Option B: External Cron Service

Set up a cron job to call:
```
POST https://yourdomain.com/api/cron/cancel-unpaid-enrollments
Authorization: Bearer YOUR_CRON_SECRET
```

Schedule: Every hour (`0 * * * *`)

## Step 5: Testing

1. **Test Payment Flow:**
   - Enroll in a course
   - Click "Pay Now" button
   - Use Chapa test credentials to complete payment
   - Verify enrollment status changes to "confirmed"

2. **Test Webhook:**
   - Complete a test payment
   - Check webhook logs in Chapa dashboard
   - Verify payment status updated in database

3. **Test Auto-Cancellation:**
   - Create a test enrollment
   - Wait for payment timeout (or manually set `payment_timeout` to past date)
   - Call the cancellation endpoint or wait for cron job
   - Verify enrollment status changes to "cancelled"

## Payment Flow

1. Student enrolls → Enrollment created with `pending` status
2. Payment timeout set (default: 24 hours)
3. Student clicks "Pay Now" → Payment initialized with Chapa
4. Student redirected to Chapa payment page
5. After payment → Webhook updates payment and enrollment status
6. If payment not completed within timeout → Auto-cancellation

## Troubleshooting

### Payment Initialization Fails
- Check Chapa API keys are correct
- Verify `NEXT_PUBLIC_APP_URL` is set correctly
- Check browser console for errors

### Webhook Not Working
- Verify webhook URL is accessible
- Check webhook secret matches Chapa configuration
- Review webhook logs in Chapa dashboard
- Check server logs for errors

### Auto-Cancellation Not Working
- Verify cron job is configured correctly
- Check `CRON_SECRET` matches in request
- Review database function `cancel_unpaid_enrollments()`
- Check payment timeout is set correctly

## Security Notes

1. **Never commit `.env.local`** - It's already in `.gitignore`
2. **Use different keys for test and production**
3. **Verify webhook signatures** (implemented in code)
4. **Protect cron endpoint** with `CRON_SECRET`
5. **Use HTTPS in production** for webhook endpoints

## Support

For Chapa API documentation, visit: https://developer.chapa.co/

For issues with this integration, check:
- Server logs
- Chapa dashboard webhook logs
- Database payment records
- Browser console errors

