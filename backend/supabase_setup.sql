-- Create users table
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
  full_name TEXT,
  is_super_admin BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create user_permissions table
CREATE TABLE IF NOT EXISTS user_permissions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  page TEXT NOT NULL,
  permission TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, page, permission)
);

-- Create comments table
CREATE TABLE IF NOT EXISTS comments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  page TEXT NOT NULL,
  author_id UUID REFERENCES users(id) ON DELETE SET NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create comment_history table
CREATE TABLE IF NOT EXISTS comment_history (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  comment_id UUID REFERENCES comments(id) ON DELETE CASCADE,
  previous_content TEXT,
  modified_by UUID REFERENCES users(id) ON DELETE SET NULL,
  action TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add row level security policies
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_permissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE comment_history ENABLE ROW LEVEL SECURITY;

-- Create policies for users table
CREATE POLICY "Super admins can do everything with users" ON users
  FOR ALL TO authenticated
  USING (EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND is_super_admin = true));

CREATE POLICY "Users can read their own data" ON users
  FOR SELECT TO authenticated
  USING (id = auth.uid());

-- Create policies for user_permissions table
CREATE POLICY "Super admins can do everything with permissions" ON user_permissions
  FOR ALL TO authenticated
  USING (EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND is_super_admin = true));

CREATE POLICY "Users can read their own permissions" ON user_permissions
  FOR SELECT TO authenticated
  USING (user_id = auth.uid());

-- Create policies for comments table
CREATE POLICY "Anyone can read comments" ON comments
  FOR SELECT TO authenticated
  USING (true);

CREATE POLICY "Users can create comments if they have permission" ON comments
  FOR INSERT TO authenticated
  WITH CHECK (EXISTS (
    SELECT 1 FROM user_permissions 
    WHERE user_id = auth.uid() AND page = comments.page AND permission = 'create'
  ) OR EXISTS (
    SELECT 1 FROM users WHERE id = auth.uid() AND is_super_admin = true
  ));

CREATE POLICY "Users can update comments if they have permission" ON comments
  FOR UPDATE TO authenticated
  USING (EXISTS (
    SELECT 1 FROM user_permissions 
    WHERE user_id = auth.uid() AND page = comments.page AND permission = 'edit'
  ) OR EXISTS (
    SELECT 1 FROM users WHERE id = auth.uid() AND is_super_admin = true
  ));

CREATE POLICY "Users can delete comments if they have permission" ON comments
  FOR DELETE TO authenticated
  USING (EXISTS (
    SELECT 1 FROM user_permissions 
    WHERE user_id = auth.uid() AND page = comments.page AND permission = 'delete'
  ) OR EXISTS (
    SELECT 1 FROM users WHERE id = auth.uid() AND is_super_admin = true
  ));

-- Create policies for comment_history table
CREATE POLICY "Super admins can read comment history" ON comment_history
  FOR SELECT TO authenticated
  USING (EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND is_super_admin = true));
