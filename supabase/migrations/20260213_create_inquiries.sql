CREATE TABLE IF NOT EXISTS inquiries (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  company TEXT,
  inquiry_type TEXT DEFAULT '기타',
  message TEXT NOT NULL,
  privacy_agreed BOOLEAN DEFAULT false,
  status TEXT DEFAULT 'pending',
  admin_reply TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  replied_at TIMESTAMPTZ
);

ALTER TABLE inquiries ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public insert" ON inquiries FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow service read" ON inquiries FOR SELECT USING (auth.role() = 'service_role');
CREATE POLICY "Allow service update" ON inquiries FOR UPDATE USING (auth.role() = 'service_role');
CREATE POLICY "Allow service delete" ON inquiries FOR DELETE USING (auth.role() = 'service_role');
