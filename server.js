const express = require('express');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;

const { version: APP_VERSION } = require('./package.json');

// Verandert bij elke herstart van de container (dus bij elke deploy), en
// wordt als ?v=... achter de CSS/JS-bestanden geplakt. Zo forceren we dat
// browsers na een update altijd de nieuwe versie ophalen, in plaats van een
// gecachete oude versie te blijven tonen. Dezelfde waarde wordt ook zichtbaar
// onderaan de pagina getoond, zodat je meteen kunt zien of een nieuwe deploy
// ook echt is aangekomen.
const BUILD_ID = Date.now().toString(36);
const BUILT_AT = new Date().toISOString();

function renderIndexHtml() {
  const raw = fs.readFileSync(path.join(__dirname, 'public', 'index.html'), 'utf8');
  return raw
    .replace(/(href|src)="(\/(?:css|js)\/[^"]+)"/g, `$1="$2?v=${BUILD_ID}"`)
    .replace('__APP_VERSION__', `v${APP_VERSION} · build ${BUILD_ID}`);
}

// API: versie-informatie, handig om te checken of een deploy is aangekomen
app.get('/api/version', (req, res) => {
  res.json({ version: APP_VERSION, buildId: BUILD_ID, builtAt: BUILT_AT });
});

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

// Statische bestanden mogen lang gecachet worden: de ?v=... in de HTML
// verandert bij elke deploy, dus een nieuwe versie krijgt vanzelf een
// nieuwe URL en omzeilt zo de cache van de browser.
//
// index: false is cruciaal: zonder deze optie serveert express.static
// public/index.html automatisch en ongewijzigd (met dezelfde lange
// cache-header!) zodra iemand "/" opvraagt, nog vóórdat de catch-all route
// hieronder de kans krijgt om de ?v=... en het versienummer erin te zetten.
app.use(express.static(path.join(__dirname, 'public'), { maxAge: '7d', index: false }));

app.get('*', (req, res) => {
  // index.html zelf nooit cachen, anders blijft een browser een oude
  // ?v=... verwijzing tonen na een nieuwe deploy.
  res.set('Cache-Control', 'no-cache');
  res.send(renderIndexHtml());
});

app.listen(PORT, () => {
  console.log(`Papieren Vliegtuigjes draait op poort ${PORT}`);
});
