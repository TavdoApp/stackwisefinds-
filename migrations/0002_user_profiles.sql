-- StakDock Cloudflare D1 Migration 0002: User Profiles & Maker Hub
CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  email TEXT UNIQUE NOT NULL,
  name TEXT,
  handle TEXT,
  avatar_url TEXT,
  role TEXT DEFAULT 'buyer', -- buyer, maker, admin
  twitter_handle TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS user_stacks (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_email TEXT NOT NULL,
  stack_name TEXT NOT NULL,
  stack_slug TEXT,
  tool_ids TEXT NOT NULL, -- JSON array of tool IDs
  is_public INTEGER DEFAULT 1,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS claimed_tools (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_email TEXT NOT NULL,
  tool_id TEXT NOT NULL,
  software_name TEXT NOT NULL,
  domain TEXT NOT NULL,
  verified INTEGER DEFAULT 1,
  claimed_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(user_email, tool_id)
);

CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_stacks_user ON user_stacks(user_email);
CREATE INDEX IF NOT EXISTS idx_claimed_user ON claimed_tools(user_email);
