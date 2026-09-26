# Papieren Vliegtuigjes ✈️

Een fancy webcollectie van 16 papieren vliegtuigjes met stap-voor-stap
vouwinstructies, geïllustreerde vouwdiagrammen, en filters op vliegstijl
(ver vliegen, zweven, stunts, snelheid).

## Draaien met Docker (aanbevolen)

Zorg dat [Docker Desktop](https://www.docker.com/products/docker-desktop/)
draait, open dan een terminal in deze map en voer uit:

```bash
docker compose up --build
```

De site is daarna te bereiken op **http://localhost:8080**.

Stoppen doe je met `Ctrl+C`, of in een andere terminal met:

```bash
docker compose down
```

### Zonder docker-compose (losse Docker-commando's)

```bash
docker build -t papervliegtuigjes .
docker run -p 8080:3000 papervliegtuigjes
```

## Draaien zonder Docker (lokale Node.js)

Vereist Node.js 18+.

```bash
npm install
npm start
```

De site draait dan op **http://localhost:3000**.

## Projectstructuur

```
├── Dockerfile              # Container-definitie (Node 20 alpine)
├── docker-compose.yml      # Poort 8080 -> container poort 3000
├── server.js               # Express-server: serveert de site + een kleine JSON-API
├── data/planes.json        # Alle 16 vliegtuigjes met stats en vouwstappen
├── scripts/gen-data.js     # Genereert data/planes.json (alleen nodig als je de data aanpast)
└── public/
    ├── index.html
    ├── css/style.css       # Het "fancy" ontwerp (donker thema, glaseffecten, animaties)
    └── js/
        ├── app.js          # Galerij, filters, detail-stepper
        └── diagrams.js     # Genereert de SVG-vouwdiagrammen per stap
```

## Een vliegtuigje toevoegen of aanpassen

De inhoud staat in `data/planes.json`. Je kunt dit bestand direct bewerken,
of `scripts/gen-data.js` aanpassen (overzichtelijker voor herbruikbare
stappen) en opnieuw genereren met:

```bash
node scripts/gen-data.js
```

Elke stap heeft een `stage` (het resultaat, bv. `kite`, `folded`, `wings`)
en een `action` (de vouwbeweging, bv. `valley-diagonal-both`). Deze twee
samen bepalen welk schematisch diagram `diagrams.js` tekent — er zijn geen
losse afbeeldingen nodig.
