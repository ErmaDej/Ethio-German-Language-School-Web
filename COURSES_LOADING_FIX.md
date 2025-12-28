# Courses Loading Issue - Troubleshooting Guide

## Problem
Courses are not loading in production (Vercel deployment) but work in local development.

## Solutions Applied

### 1. Enhanced Error Logging
- Added detailed console logging to help identify the exact error
- Check browser console (F12) for detailed error messages

### 2. Improved RLS Policies
Two SQL scripts are available:
- `scripts/010_fix_courses_rls_policies.sql` - Basic fix
- `scripts/011_comprehensive_courses_rls_fix.sql` - Comprehensive fix (RECOMMENDED)

### 3. Diagnostic API Route
- Created `/api/debug/courses` to test server-side Supabase connectivity
- Visit: `https://your-domain.vercel.app/api/debug/courses`

## Step-by-Step Fix

### Step 1: Run the RLS Policy Fix Script
1. Go to your Supabase Dashboard
2. Navigate to SQL Editor
3. Run `scripts/011_comprehensive_courses_rls_fix.sql`
4. Verify the output shows policies were created

### Step 2: Verify Environment Variables in Vercel
1. Go to Vercel Dashboard → Your Project → Settings → Environment Variables
2. Verify these are set for **Production**:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
3. If missing, add them and redeploy

### Step 3: Test the Diagnostic Endpoint
After deployment, visit:
```
https://your-domain.vercel.app/api/debug/courses
```

This will show:
- Whether environment variables are set
- Whether Supabase connection works
- Any RLS policy errors
- Sample course data if successful

### Step 4: Check Browser Console
1. Open your production site
2. Open Developer Tools (F12)
3. Go to Console tab
4. Navigate to `/courses` page
5. Look for error messages with details like:
   - Missing environment variables
   - Supabase connection errors
   - RLS policy errors (code: 42501 or PGRST301)

## Common Issues and Solutions

### Issue: "Missing Supabase environment variables"
**Solution**: Add environment variables in Vercel and redeploy

### Issue: "permission denied for table courses" (Error code: 42501)
**Solution**: Run the RLS policy fix script in Supabase

### Issue: "new row violates row-level security policy" (Error code: PGRST301)
**Solution**: The RLS policy is too restrictive. Run the comprehensive fix script.

### Issue: Environment variables show as undefined
**Solution**: 
- Ensure variables start with `NEXT_PUBLIC_`
- Redeploy after adding variables
- Check that variables are set for the correct environment (Production)

## Testing Checklist

- [ ] RLS policy script executed successfully
- [ ] Environment variables verified in Vercel
- [ ] Diagnostic endpoint returns success
- [ ] Browser console shows no errors
- [ ] Courses load on `/courses` page
- [ ] Featured courses show on homepage

## Additional Notes

- The `sharp@0.34.5` warning is unrelated to this issue
- It's about build scripts and won't affect functionality
- You can ignore it or run `pnpm approve-builds` in Vercel if desired

