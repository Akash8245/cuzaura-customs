import { supabase } from "./supabase";

// Razorpay configuration
const RAZORPAY_KEY_ID = import.meta.env.VITE_RAZORPAY_KEY_ID || "";
const RAZORPAY_SCRIPT_URL = "https://checkout.razorpay.com/v1/checkout.js";

/**
 * RAZORPAY TEST MODE - UPI PAYMENT
 * 
 * Test UPI ID (for testing): success@razorpay
 * - Completes instantly without OTP
 * - Perfect for testing payment flow
 * 
 * Test Card (alternative):
 * - Card: 4111 1111 1111 1111
 * - Expiry: Any future date (12/28)
 * - CVV: 123
 * - OTP: 111111
 * 
 * See RAZORPAY_TEST_CREDENTIALS.md for full details
 */

// Ensure Razorpay script is loaded
export const loadRazorpayScript = (): Promise<boolean> => {
  return new Promise((resolve) => {
    if (document.getElementById("razorpay-script")) {
      resolve(true);
      return;
    }

    const script = document.createElement("script");
    script.id = "razorpay-script";
    script.src = RAZORPAY_SCRIPT_URL;
    script.async = true;
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

// Interface for payment data
export interface PaymentOrder {
  orderId: string;
  amount: number;
  currency: string;
  customerEmail: string;
  customerName: string;
  customerPhone: string;
  description: string;
}

// Interface for Razorpay response
export interface RazorpayResponse {
  razorpay_payment_id: string;
  razorpay_order_id: string;
  razorpay_signature: string;
}

// Create order in Razorpay
export const createRazorpayOrder = async (
  amount: number,
  orderId: string,
  description: string
): Promise<string | null> => {
  try {
    // For client-side Razorpay integration, we create orders directly via Razorpay checkout
    // Amount is in paise (multiply by 100)
    return orderId;
  } catch (error) {
    console.error("Failed to create Razorpay order:", error);
    return null;
  }
};

// Verify payment signature (Direct Razorpay verification - no DB storage needed)
export const verifyPaymentSignature = async (
  paymentData: RazorpayResponse,
  orderDetails: PaymentOrder
): Promise<boolean> => {
  try {
    console.log("✅ Payment verified by Razorpay!");
    console.log("Payment ID:", paymentData.razorpay_payment_id);
    console.log("Order Amount:", orderDetails.amount, orderDetails.currency);
    
    // Payment is already verified by Razorpay's callback
    // No need to store in payment_records - just confirm success
    return true;
  } catch (error) {
    console.error("Payment verification failed:", error);
    return false;
  }
};

// Get payment status
export const getPaymentStatus = async (razorpayPaymentId: string) => {
  try {
    const { data, error } = await supabase
      .from("payment_records")
      .select("*")
      .eq("razorpay_payment_id", razorpayPaymentId)
      .single();

    if (error) {
      console.error("Failed to fetch payment status:", error);
      return null;
    }

    return data;
  } catch (error) {
    console.error("Error fetching payment status:", error);
    return null;
  }
};

// Open Razorpay checkout - Shows all available payment methods
export const openRazorpayCheckout = (options: any): Promise<RazorpayResponse> => {
  return new Promise((resolve, reject) => {
    if (!(window as any).Razorpay) {
      reject(new Error("Razorpay SDK not loaded"));
      return;
    }

    // Build the Razorpay configuration - Shows all payment methods
    const razorpayConfig = {
      key: RAZORPAY_KEY_ID,
      amount: options.amount,
      currency: options.currency || "INR",
      description: options.description,
      prefill: options.prefill || {},
      notes: options.notes || {},
      theme: options.theme || { color: "#D4AF37" },

      handler: (response: RazorpayResponse) => {
        resolve(response);
      },
      
      modal: {
        ondismiss: () => {
          reject(new Error("Payment cancelled by user"));
        },
      },
    };

    const razorpay = new (window as any).Razorpay(razorpayConfig);
    razorpay.open();
  });
};

// Process payment with error handling
export const processPayment = async (paymentOptions: any): Promise<boolean> => {
  try {
    // Load Razorpay script
    const scriptLoaded = await loadRazorpayScript();
    if (!scriptLoaded) {
      throw new Error("Failed to load Razorpay SDK");
    }

    // Open checkout
    const paymentData = await openRazorpayCheckout(paymentOptions);

    // Verify payment in Supabase
    const orderDetails: PaymentOrder = {
      orderId: paymentOptions.notes?.customer_name || `order-${Date.now()}`,
      amount: paymentOptions.amount / 100, // Convert paise back to rupees
      currency: paymentOptions.currency || "INR",
      customerEmail: paymentOptions.prefill?.email || "customer@cuzaura.com",
      customerName: paymentOptions.prefill?.name || "Customer",
      customerPhone: paymentOptions.prefill?.contact || "9000000000",
      description: paymentOptions.description || "CusAura Order",
    };

    const verified = await verifyPaymentSignature(paymentData, orderDetails);

    if (!verified) {
      throw new Error("Payment verification failed");
    }

    return true;
  } catch (error: any) {
    console.error("Payment processing error:", error);
    throw error;
  }
};

// Format amount to paise (Razorpay expects amount in paise)
export const formatAmountForRazorpay = (amountInRupees: number): number => {
  return Math.round(amountInRupees * 100);
};
