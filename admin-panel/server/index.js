import express from 'express';
import cors from 'cors';
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Initialize Supabase client
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.warn('⚠️ Supabase credentials not configured. Some features may not work.');
}

const supabase = createClient(supabaseUrl || '', supabaseServiceKey || '', {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' }));

// Helper to verify auth token
const verifyAuth = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const token = authHeader.substring(7);
  try {
    const { data: { user }, error } = await supabase.auth.getUser(token);
    if (error || !user) {
      return res.status(401).json({ error: 'Invalid token' });
    }
    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({ error: 'Invalid token' });
  }
};

// GET /api/projects - List user's projects
app.get('/api/projects', verifyAuth, async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .eq('user_id', req.user.id)
      .order('created_at', { ascending: false });

    if (error) throw error;
    res.json(data || []);
  } catch (error) {
    console.error('Error fetching projects:', error);
    res.status(500).json({ error: error.message });
  }
});

// POST /api/projects - Create new project
app.post('/api/projects', verifyAuth, async (req, res) => {
  try {
    const { name, config = {} } = req.body;
    if (!name) {
      return res.status(400).json({ error: 'Project name is required' });
    }

    // Generate slug from name
    const slug = name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '') + '-' + Date.now().toString(36);

    const { data, error } = await supabase
      .from('projects')
      .insert({
        user_id: req.user.id,
        name: name,
        slug: slug,
        config: config,
        status: 'active',
      })
      .select()
      .single();

    if (error) throw error;
    res.json(data);
  } catch (error) {
    console.error('Error creating project:', error);
    res.status(500).json({ error: error.message });
  }
});

// GET /api/projects/:id - Get project by ID
app.get('/api/projects/:id', verifyAuth, async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .eq('id', req.params.id)
      .eq('user_id', req.user.id)
      .single();

    if (error) throw error;
    if (!data) {
      return res.status(404).json({ error: 'Project not found' });
    }
    res.json(data);
  } catch (error) {
    console.error('Error fetching project:', error);
    res.status(500).json({ error: error.message });
  }
});

// PUT /api/projects/:id - Update project
app.put('/api/projects/:id', verifyAuth, async (req, res) => {
  try {
    const { name, config, status } = req.body;
    const updates = { updated_at: new Date().toISOString() };
    
    if (name !== undefined) updates.name = name;
    if (config !== undefined) updates.config = config;
    if (status !== undefined) updates.status = status;

    const { data, error } = await supabase
      .from('projects')
      .update(updates)
      .eq('id', req.params.id)
      .eq('user_id', req.user.id)
      .select()
      .single();

    if (error) throw error;
    if (!data) {
      return res.status(404).json({ error: 'Project not found' });
    }
    res.json(data);
  } catch (error) {
    console.error('Error updating project:', error);
    res.status(500).json({ error: error.message });
  }
});

// DELETE /api/projects/:id - Delete project
app.delete('/api/projects/:id', verifyAuth, async (req, res) => {
  try {
    const { error } = await supabase
      .from('projects')
      .delete()
      .eq('id', req.params.id)
      .eq('user_id', req.user.id);

    if (error) throw error;
    res.json({ success: true });
  } catch (error) {
    console.error('Error deleting project:', error);
    res.status(500).json({ error: error.message });
  }
});

// GET /api/config/:slug - Get public config by slug (for template)
app.get('/api/config/:slug', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('projects')
      .select('config')
      .eq('slug', req.params.slug)
      .eq('status', 'active')
      .single();

    if (error || !data) {
      return res.status(404).json({ error: 'Config not found' });
    }
    res.setHeader('Content-Type', 'application/json');
    res.json(data.config);
  } catch (error) {
    console.error('Error fetching config:', error);
    res.status(500).json({ error: error.message });
  }
});

// Legacy endpoint for backward compatibility
app.get('/config.json', async (req, res) => {
  // Try to get default project or return empty config
  res.setHeader('Content-Type', 'application/json');
  res.json({});
});

// Legacy endpoint for backward compatibility
app.put('/api/config', verifyAuth, async (req, res) => {
  try {
    // This should update the current project's config
    // For now, we'll need the project ID in the request
    const { projectId, config } = req.body;
    
    if (!projectId) {
      return res.status(400).json({ error: 'projectId is required' });
    }

    const { data, error } = await supabase
      .from('projects')
      .update({ config: config || req.body, updated_at: new Date().toISOString() })
      .eq('id', projectId)
      .eq('user_id', req.user.id)
      .select()
      .single();

    if (error) throw error;
    res.json({ success: true, data });
  } catch (error) {
    console.error('Error saving config:', error);
    res.status(500).json({ error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 API Server running on http://localhost:${PORT}`);
  if (supabaseUrl) {
    console.log(`✅ Supabase connected`);
  } else {
    console.log(`⚠️  Supabase not configured`);
  }
});
