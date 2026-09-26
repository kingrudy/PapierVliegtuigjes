const express = require('express');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;

// API: alle vliegtuigjes
app.get('/api/planes', (req, res) => {
  const data = JSON.parse(fs.readFileSync(path.join(__dirname, 'data', 'planes.json'), 'utf8'));
  res.json(data);
});

// API: een specifiek vliegtuigje
app.get('/api/planes/:id', (req, res) => {
  const data = JSON.parse(fs.readFileSync(path.join(__dirname, 'data', 'planes.json'), 'utf8'));
  const plane = data.planes.find(p => p.id === req.params.id);
  if (!plane) return res.status(404).json({ error: 'Niet gevonden' });
  res.json(plane);
});

app.use(express.static(path.join(__dirname, 'public'), { maxAge: '1h' }));

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Papieren Vliegtuigjes draait op poort ${PORT}`);
});
