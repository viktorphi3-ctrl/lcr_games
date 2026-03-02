-- ============================================================
-- LCR GAMERS Collection Vault — Initial Schema
-- Run this in your Supabase SQL Editor
-- ============================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================
-- Table: items
-- ============================================================
CREATE TABLE IF NOT EXISTS public.items (
  id            UUID          PRIMARY KEY DEFAULT uuid_generate_v4(),
  type          TEXT          NOT NULL CHECK (type IN ('console', 'game')),
  title         TEXT          NOT NULL,
  description   TEXT,
  release_year  INTEGER,
  platform      TEXT          NOT NULL,
  condition     TEXT          NOT NULL CHECK (condition IN ('CIB', 'Loose', 'Sealed', 'Damaged', 'Restored')),
  purchase_price NUMERIC(10,2) NOT NULL DEFAULT 0,
  image_urls    TEXT[]        DEFAULT ARRAY[]::TEXT[],
  user_id       UUID          NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at    TIMESTAMPTZ   NOT NULL DEFAULT NOW(),
  updated_at    TIMESTAMPTZ   NOT NULL DEFAULT NOW()
);

-- Performance indexes
CREATE INDEX IF NOT EXISTS items_user_id_idx    ON public.items(user_id);
CREATE INDEX IF NOT EXISTS items_type_idx       ON public.items(type);
CREATE INDEX IF NOT EXISTS items_platform_idx   ON public.items(platform);
CREATE INDEX IF NOT EXISTS items_created_at_idx ON public.items(created_at DESC);

-- ============================================================
-- Row Level Security
-- ============================================================
ALTER TABLE public.items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own items"
  ON public.items FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own items"
  ON public.items FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own items"
  ON public.items FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own items"
  ON public.items FOR DELETE
  USING (auth.uid() = user_id);

-- ============================================================
-- Auto-update updated_at
-- ============================================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_items_updated_at
  BEFORE UPDATE ON public.items
  FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();

-- ============================================================
-- Storage: item-images bucket
-- Run separately in Supabase Dashboard > Storage
-- ============================================================
-- INSERT INTO storage.buckets (id, name, public)
-- VALUES ('item-images', 'item-images', false)
-- ON CONFLICT (id) DO NOTHING;

-- Storage RLS (run after creating the bucket)
-- CREATE POLICY "Users upload own images"
--   ON storage.objects FOR INSERT
--   WITH CHECK (
--     bucket_id = 'item-images'
--     AND auth.uid()::text = (storage.foldername(name))[1]
--   );

-- CREATE POLICY "Users view own images"
--   ON storage.objects FOR SELECT
--   USING (
--     bucket_id = 'item-images'
--     AND auth.uid()::text = (storage.foldername(name))[1]
--   );

-- CREATE POLICY "Users delete own images"
--   ON storage.objects FOR DELETE
--   USING (
--     bucket_id = 'item-images'
--     AND auth.uid()::text = (storage.foldername(name))[1]
--   );
