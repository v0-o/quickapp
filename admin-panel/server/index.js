import express from 'express';
import cors from 'cors';
import { readFile, writeFile } from 'fs/promises';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = 3001;

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' }));

// Path to config.json
// From admin-panel/server/index.js -> go up 2 levels -> quickapp/template/public/config.json
const configPath = join(__dirname, '..', '..', 'template', 'public', 'config.json');

// GET /config.json - Serve config file
app.get('/config.json', async (req, res) => {
  try {
    const config = await readFile(configPath, 'utf-8');
    res.setHeader('Content-Type', 'application/json');
    res.send(config);
  } catch (error) {
    console.error('Error reading config:', error);
    res.status(500).json({ error: 'Failed to read config' });
  }
});

// PUT /api/config - Update config file
app.put('/api/config', async (req, res) => {
  try {
    const newConfig = req.body;
    await writeFile(configPath, JSON.stringify(newConfig, null, 2), 'utf-8');
    console.log('✅ Config saved successfully');
    res.json({ success: true });
  } catch (error) {
    console.error('Error writing config:', error);
    res.status(500).json({ error: 'Failed to write config' });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 API Server running on http://localhost:${PORT}`);
  console.log(`📁 Config path: ${configPath}`);
});

