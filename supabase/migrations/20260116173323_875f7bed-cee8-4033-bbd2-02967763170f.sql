-- Drop the restrictive policy
DROP POLICY IF EXISTS "Anyone can create orders" ON public.orders;

-- Create a permissive INSERT policy for anonymous order creation
CREATE POLICY "Anyone can create orders" 
ON public.orders 
FOR INSERT 
TO anon, authenticated
WITH CHECK (true);