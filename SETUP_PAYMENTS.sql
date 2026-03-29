-- Payment Records Table for Razorpay Integration
CREATE TABLE IF NOT EXISTS payment_records (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  razorpay_payment_id TEXT NOT NULL UNIQUE,
  razorpay_order_id TEXT NOT NULL,
  razorpay_signature TEXT NOT NULL,
  order_id TEXT NOT NULL UNIQUE,
  amount DECIMAL(10, 2) NOT NULL,
  currency TEXT NOT NULL DEFAULT 'INR',
  customer_email TEXT NOT NULL,
  customer_phone TEXT,
  payment_status TEXT NOT NULL DEFAULT 'completed',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Enable RLS Security
ALTER TABLE payment_records ENABLE ROW LEVEL SECURITY;

-- Create RLS Policy: Users can view their own payment records
CREATE POLICY "Users can view their payment records"
  ON payment_records FOR SELECT
  USING (auth.uid() IS NOT NULL);

-- Create RLS Policy: Authenticated users can create payment records
CREATE POLICY "Authenticated users can create payment records"
  ON payment_records FOR INSERT
  WITH CHECK (auth.uid() IS NOT NULL);

-- Create RLS Policy: Prevent updates to payment records
CREATE POLICY "Payment records are immutable"
  ON payment_records FOR UPDATE
  USING (FALSE);

-- Create RLS Policy: Prevent deletes to payment records
CREATE POLICY "Payment records cannot be deleted"
  ON payment_records FOR DELETE
  USING (FALSE);

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_payment_order_id ON payment_records(order_id);
CREATE INDEX IF NOT EXISTS idx_payment_status ON payment_records(payment_status);
CREATE INDEX IF NOT EXISTS idx_razorpay_payment_id ON payment_records(razorpay_payment_id);

-- Function to update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_payment_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for updated_at
CREATE TRIGGER payment_updated_at_trigger
BEFORE UPDATE ON payment_records
FOR EACH ROW
EXECUTE FUNCTION update_payment_updated_at();
