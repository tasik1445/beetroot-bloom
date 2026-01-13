-- Fix function search path security warnings
CREATE OR REPLACE FUNCTION generate_order_number()
RETURNS TEXT AS $$
DECLARE
    new_order_number TEXT;
    number_exists BOOLEAN;
BEGIN
    LOOP
        new_order_number := 'BO-' || TO_CHAR(NOW(), 'YYYYMMDD') || '-' ||
            LPAD(FLOOR(RANDOM() * 10000)::TEXT, 4, '0');
        SELECT EXISTS(SELECT 1 FROM public.orders WHERE order_number = new_order_number) INTO number_exists;
        EXIT WHEN NOT number_exists;
    END LOOP;
    RETURN new_order_number;
END;
$$ LANGUAGE plpgsql
SET search_path = public;

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql
SET search_path = public;

CREATE OR REPLACE FUNCTION set_order_number()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.order_number IS NULL OR NEW.order_number = '' THEN
        NEW.order_number := generate_order_number();
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql
SET search_path = public;

CREATE OR REPLACE FUNCTION track_order_status_change()
RETURNS TRIGGER AS $$
BEGIN
    IF OLD.order_status IS DISTINCT FROM NEW.order_status THEN
        INSERT INTO public.order_status_history (order_id, old_status, new_status, notes)
        VALUES (NEW.id, OLD.order_status, NEW.order_status, 'Status updated');

        IF NEW.order_status = 'Delivered' AND OLD.order_status != 'Delivered' THEN
            NEW.delivered_at = NOW();
        END IF;

        IF NEW.order_status = 'Cancelled' AND OLD.order_status != 'Cancelled' THEN
            NEW.cancelled_at = NOW();
        END IF;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql
SET search_path = public;