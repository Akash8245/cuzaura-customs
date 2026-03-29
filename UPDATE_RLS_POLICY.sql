-- Drop existing INSERT policy if it exists
DROP POLICY IF EXISTS "Authenticated users can create payment records" ON payment_records;

-- Create new, more permissive INSERT policy
-- This allows any authenticated user to insert payment records
CREATE POLICY "Anyone authenticated can create payment records"
  ON payment_records 
  FOR INSERT 
  WITH CHECK (true);

-- Verify policies exist
SELECT schemaname, tablename, policyname 
FROM pg_policies 
WHERE tablename = 'payment_records' 
ORDER BY policyname;
