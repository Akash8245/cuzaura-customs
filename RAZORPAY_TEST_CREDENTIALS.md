# Razorpay Test Credentials & Payment Methods

## 🔑 API Keys (Test Mode)
- **Key ID**: `rzp_test_SWwiIXRvzALwRG` (Already configured in `.env` as `VITE_RAZORPAY_KEY_ID`)
- **Key Secret**: Required server-side (not exposed to client)
- **Mode**: Test/Sandbox

---

## ✅ Test Payment Methods (UPI - RECOMMENDED)

### UPI Payment - SUCCESS (Instant)
- **UPI ID**: `success@razorpay`
- **Result**: ✅ Payment succeeds immediately
- **Use this for testing successful transactions**

### Example UPI Payment Flow:
1. Enter amount during checkout
2. Click "Pay Securely"
3. Razorpay modal opens
4. Select "UPI" payment method
5. Enter `success@razorpay` when prompted for UPI ID
6. ✅ Payment completes instantly - no OTP required
7. Order is created automatically

---

## 💳 Alternative Test Payment Methods

### Test Debit/Credit Card (if needed)
- **Card Number**: `4111 1111 1111 1111`
- **Expiry**: Any future date (e.g., `12/28`)
- **CVV**: `123`
- **OTP**: `111111` (required on some flows)
- **Result**: Success after OTP verification

### Test Wallets
- **PayTM, PhonePe, GooglePay, BHIM**: Use test numbers in your region

---

## 🚀 Using UPI in Production

When moving to production:
1. Update `.env` with live Razorpay Key ID: `rzp_live_xxxxxxx`
2. Users can use any valid UPI ID: `username@bankname`
3. Popular UPI apps in India:
   - Google Pay (@okaxis, @okhdfcbank)
   - PhonePe (@ybl)
   - Paytm (@paytm)
   - BHIM (@upi)

---

## 📋 Payment Flow Summary

### Current Implementation (Test Mode)
```
User Checkout → Enter Address → Click "Pay Securely" 
  → Razorpay Modal Opens 
  → Select UPI Method 
  → Enter: success@razorpay 
  → ✅ Instant Success 
  → Order Created 
  → Success Screen
```

### Notes:
- **UPI is most popular in India** - Recommended primary payment method
- **No OTP required** for `success@razorpay` test ID
- **Instant confirmation** - Payment is verified immediately in Supabase
- **Immutable records** - All payments logged securely with RLS protection

---

## 🔒 Security Features Implemented

✅ Payment verified in Supabase before order creation
✅ RLS policies prevent unauthorized payment access
✅ Immutable payment records (no updates/deletes)
✅ Signature validation stored
✅ Payment status tracking

---

## ⚠️ Common Issues

**"Verification failed because of incorrect OTP"**
- Don't use OTP step - just click confirm
- Or use `success@razorpay` UPI ID (no OTP needed)
- For cards, use OTP: `111111`

**Payment not appearing in Supabase**
- Check RLS policies are enabled on `payment_records` table
- Verify user is authenticated in Supabase Auth
- Check browser console for errors

**Razorpay modal not opening**
- Ensure `.env` has correct `VITE_RAZORPAY_KEY_ID`
- Check HTTPS is used (required for Razorpay SDK)
- Verify Razorpay script loads (check Network tab in DevTools)
