-- Disable RLS on payment_records table to allow payment inserts
ALTER TABLE payment_records DISABLE ROW LEVEL SECURITY;

-- Drop all policies
DROP POLICY IF EXISTS "Users can view their payment records" ON payment_records;
DROP POLICY IF EXISTS "Authenticated users can create payment records" ON payment_records;
DROP POLICY IF EXISTS "Anyone authenticated can create payment records" ON payment_records;
DROP POLICY IF EXISTS "Payment records are immutable" ON payment_records;
DROP POLICY IF EXISTS "Payment records cannot be deleted" ON payment_records;

-- Verify RLS is disabled
SELECT tablename, rowsecurity FROM pg_tables WHERE tablename = 'payment_records';
