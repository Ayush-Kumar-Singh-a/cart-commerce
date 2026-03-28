-- Create orders table
CREATE TABLE public.orders (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  order_id TEXT NOT NULL UNIQUE,
  items JSONB NOT NULL,
  total NUMERIC NOT NULL,
  full_name TEXT NOT NULL,
  phone TEXT NOT NULL,
  address_line1 TEXT NOT NULL,
  address_line2 TEXT,
  city TEXT NOT NULL,
  state TEXT NOT NULL,
  pincode TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'Confirmed',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

-- Since no auth, allow public read/insert
CREATE POLICY "Anyone can insert orders" ON public.orders FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can read orders" ON public.orders FOR SELECT USING (true);