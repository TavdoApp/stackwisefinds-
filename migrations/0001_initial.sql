-- StakDock Cloudflare D1 Migration 0001
-- Table: affiliate_clicks (Privacy-safe, zero PII)
CREATE TABLE IF NOT EXISTS affiliate_clicks (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  tool_id TEXT NOT NULL,
  affiliate_destination TEXT NOT NULL,
  referrer TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Table: vendor_submissions
CREATE TABLE IF NOT EXISTS vendor_submissions (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  vendor_name TEXT NOT NULL,
  software_name TEXT NOT NULL,
  software_website TEXT NOT NULL,
  vendor_email TEXT NOT NULL,
  status TEXT DEFAULT 'pending', -- pending, approved, rejected, needs_changes
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Table: editorial_reviews
CREATE TABLE IF NOT EXISTS editorial_reviews (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  submission_id INTEGER NOT NULL,
  reviewer_notes TEXT,
  decision TEXT NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (submission_id) REFERENCES vendor_submissions(id)
);

CREATE INDEX IF NOT EXISTS idx_clicks_tool ON affiliate_clicks(tool_id);
CREATE INDEX IF NOT EXISTS idx_clicks_date ON affiliate_clicks(created_at);
CREATE INDEX IF NOT EXISTS idx_submissions_status ON vendor_submissions(status);
