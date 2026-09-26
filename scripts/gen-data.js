// Genereert data/planes.json. Eenmalig uit te voeren met: node scripts/gen-data.js
const fs = require('fs');
const path = require('path');

// Herbruikbare stap-bouwstenen -------------------------------------------------
const creaseVert = (extra = '') => ({
  stage: 'vel',
  action: 'crease-vertical',
  title: 'Vouw een middenlijn',
  text: `Leg het vel voor je met de lange zijde verticaal. Vouw het in de lengte dubbel en vouw het weer open. Je hebt nu een duidelijke middenvouw.${extra ? ' ' + extra : ''}`
});

const cornersIn = (extra = '') => ({
  stage: 'kite',
  action: 'valley-diagonal-both',
  title: 'Vouw de bovenhoeken naar binnen',
  text: `Vouw de twee bovenhoeken naar de middenlijn, zodat je een puntdak (huisvorm) krijgt.${extra ? ' ' + extra : ''}`
});

const cornersInAgain = (extra = '') => ({
  stage: 'kite-sharp',
  action: 'valley-diagonal-both-2',
  title: 'Maak de neus scherper',
  text: `Vouw de schuine zijden nogmaals naar de middenlijn toe, zodat de neus smaller en scherper wordt.${extra ? ' ' + extra : ''}`
});

const noseLock = () => ({
  stage: 'kite-sharp',
  action: 'valley-small-tip',
  title: 'Vergrendel de neus',
  text: 'Vouw het uiterste puntje van de neus een klein stukje terug omhoog en druk het plat. Dit "slot" houdt de vouwen van de neus stevig op hun plaats.'
});

const foldClosed = (extra = '') => ({
  stage: 'folded',
  action: 'mountain-vertical',
  title: 'Vouw het model dubbel',
  text: `Vouw het hele model van je af, dubbel langs de middenlijn, zodat de gevouwen kant naar boven wijst.${extra ? ' ' + extra : ''}`
});

const wings = (extra = '') => ({
  stage: 'wings',
  action: 'valley-horizontal-wings',
  title: 'Vouw de vleugels',
  text: `Vouw aan beide zijden een vleugel naar beneden. Houd ongeveer 1,5-2 cm over voor de romp (kiel) van het toestel.${extra ? ' ' + extra : ''}`
});

const finishFlat = (tip) => ({
  stage: 'finished',
  action: 'none',
  title: 'Klaar om te vliegen',
  text: tip
});

const finishAdjust = (tip) => ({
  stage: 'finished',
  action: 'adjust',
  title: 'Laatste finetuning',
  text: tip
});

const flapCuts = () => ({
  stage: 'wings',
  action: 'small-cuts',
  title: 'Knip stuurkleppen (elevons)',
  text: 'Knip aan de achterrand van beide vleugels een klein driehoekig inkepingetje, ongeveer een derde vanaf de vleugeltip. Dit worden je stuurkleppen.'
});

const bendFlaps = (dir) => ({
  stage: 'wings',
  action: 'adjust',
  title: 'Zet de stuurkleppen',
  text: `Buig de zojuist geknipte klepjes lichtjes ${dir}. Hiermee stuur je het toestel tijdens de vlucht.`
});

const noseWeight = () => ({
  stage: 'kite-sharp',
  action: 'small-cuts',
  title: 'Vouw een neusgewichtje',
  text: 'Vouw het neuspuntje eenmaal extra dubbel om een klein beetje gewicht vooraan te concentreren. Dat houdt de neus tijdens de vlucht naar beneden gericht.'
});

const curlTrailingEdge = () => ({
  stage: 'wings',
  action: 'adjust',
  title: 'Krul de achterrand',
  text: 'Krul de achterrand van beide vleugels voorzichtig iets omhoog met je duimnagel of een potlood, zoals bij een echte vliegtuigvleugel.'
});

const dihedral = () => ({
  stage: 'wings',
  action: 'adjust',
  title: 'Zet de V-vorm (dihedraal)',
  text: 'Open het model iets vanuit de kielvouw, zodat de vleugels een lichte V-vorm (dihedraal) maken ten opzichte van elkaar. Dit geeft extra stabiliteit.'
});

// Vliegtuig-definities ----------------------------------------------------------
const planes = [
  {
    id: 'de-pijl',
    name: 'De Pijl',
    tagline: 'De klassieker die iedereen kent',
    category: 'snelheid',
    difficulty: 1,
    stats: { afstand: 4, hoogte: 2, stabiliteit: 4, moeilijkheid: 1 },
    description: 'Het bekendste papieren vliegtuigje ter wereld. Snel te vouwen, snel te vliegen, en de perfecte instap voor beginners.',
    tips: 'Gooi met een vlakke, snelle worp op schouderhoogte voor het beste resultaat.',
    steps: [
      creaseVert(),
      cornersIn(),
      cornersInAgain(),
      foldClosed(),
      wings(),
      finishFlat('Gooi stevig en recht naar voren. Dit toestel is gebouwd voor snelheid, niet voor zweefvluchten.')
    ]
  },
  {
    id: 'de-zweefvlieger',
    name: 'De Zweefvlieger',
    tagline: 'Lange, rustige zweefvluchten',
    category: 'zweven',
    difficulty: 2,
    stats: { afstand: 3, hoogte: 3, stabiliteit: 5, moeilijkheid: 2 },
    description: 'Brede vleugels en een lichte neus zorgen voor lange, sierlijke zweefvluchten in plaats van een snelle rechte vlucht.',
    tips: 'Gooi zacht en licht omhoog. Een harde worp duwt de neus te snel naar beneden.',
    steps: [
      creaseVert(),
      cornersIn('Maak de hoeken extra breed voor grotere vleugels.'),
      foldClosed(),
      wings('Vouw de vleugels breder uit dan bij een gewone pijl, tot bijna aan de kiel.'),
      curlTrailingEdge(),
      dihedral(),
      finishFlat('Gooi horizontaal en zacht, bijna alsof je hem laat "zweven" in plaats van gooien.')
    ]
  },
  {
    id: 'de-concorde',
    name: 'De Concorde',
    tagline: 'Delta-vleugels voor topsnelheid',
    category: 'snelheid',
    difficulty: 3,
    stats: { afstand: 5, hoogte: 2, stabiliteit: 3, moeilijkheid: 3 },
    description: 'Geïnspireerd op de gelijknamige straaljager, met een lange, smalle delta-vorm die door de lucht snijdt.',
    tips: 'Werkt het best met stevig papier (80-100 g/m²) door de lange, smalle vorm.',
    steps: [
      creaseVert(),
      cornersIn(),
      cornersInAgain(),
      noseLock(),
      foldClosed(),
      wings('Vouw de vleugels smal en lang, met een scherpe delta-hoek.'),
      finishFlat('Gooi hard en volledig recht — de smalle vleugels houden niet van een zijwaartse worp.')
    ]
  },
  {
    id: 'de-stuntvlieger',
    name: 'De Stuntvlieger',
    tagline: 'Loopings en duikvluchten',
    category: 'stunt',
    difficulty: 3,
    stats: { afstand: 2, hoogte: 4, stabiliteit: 3, moeilijkheid: 3 },
    description: 'Met verstelbare stuurkleppen aan de achterrand van de vleugels kan dit toestel loopings, rollen en duikvluchten maken.',
    tips: 'Experimenteer met de hoek van de stuurkleppen: omhoog voor een looping, omlaag voor een duik.',
    steps: [
      creaseVert(),
      cornersIn(),
      foldClosed(),
      wings(),
      flapCuts(),
      bendFlaps('omhoog voor een looping'),
      finishAdjust('Gooi krachtig en recht omhoog voor de beste stunt-resultaten.')
    ]
  },
  {
    id: 'de-delta',
    name: 'De Delta',
    tagline: 'Strak, symmetrisch, snel',
    category: 'snelheid',
    difficulty: 2,
    stats: { afstand: 4, hoogte: 2, stabiliteit: 4, moeilijkheid: 2 },
    description: 'Een strakke driehoeksvorm zonder franje. Simpel, robuust en verrassend snel.',
    tips: 'Ideaal vliegtuigje om buiten te testen — het is minder gevoelig voor windvlagen dan smallere modellen.',
    steps: [
      creaseVert(),
      cornersIn(),
      foldClosed(),
      wings('Vouw de vleugels in één keer breed uit tot vlak boven de kiel.'),
      finishFlat('Gooi stevig op ooghoogte, licht naar boven gericht.')
    ]
  },
  {
    id: 'de-valk',
    name: 'De Valk',
    tagline: 'Gebouwd voor afstand',
    category: 'ver',
    difficulty: 3,
    stats: { afstand: 5, hoogte: 3, stabiliteit: 3, moeilijkheid: 3 },
    description: 'Een slank model met een extra vouw voor gewicht in de neus, waardoor het verrassend ver kan vliegen.',
    tips: 'Zoek een lange, rechte ruimte binnen of een windstille dag buiten voor recordpogingen.',
    steps: [
      creaseVert(),
      cornersIn(),
      cornersInAgain(),
      noseWeight(),
      foldClosed(),
      wings('Vouw de vleugels smal, met de vouwrand strak tegen de kiel.'),
      finishFlat('Gooi met een vloeiende, krachtige worp licht omhoog voor maximale afstand.')
    ]
  },
  {
    id: 'de-adelaar',
    name: 'De Adelaar',
    tagline: 'Brede spanwijdte, statige vlucht',
    category: 'zweven',
    difficulty: 3,
    stats: { afstand: 3, hoogte: 4, stabiliteit: 4, moeilijkheid: 3 },
    description: 'Extra brede vleugels met opgekrulde randen geven dit model een statige, bijna zwevende vliegstijl.',
    tips: 'Gooi vanaf een verhoging (trap, balkon) voor het meest indrukwekkende effect.',
    steps: [
      creaseVert(),
      cornersIn('Maak de vouw extra breed voor een grotere spanwijdte.'),
      foldClosed(),
      wings('Vouw de vleugels zo breed mogelijk uit.'),
      curlTrailingEdge(),
      dihedral(),
      finishAdjust('Gooi zacht en gelijkmatig; de brede vleugels doen de rest van het werk.')
    ]
  },
  {
    id: 'de-speerpunt',
    name: 'De Speerpunt',
    tagline: 'Smal, scherp, doelgericht',
    category: 'snelheid',
    difficulty: 2,
    stats: { afstand: 4, hoogte: 1, stabiliteit: 3, moeilijkheid: 2 },
    description: 'Een extreem smal model dat vliegt als een speer: recht, snel en zonder omwegen.',
    tips: 'Perfect voor doelgooien — de smalle neus is verrassend precies.',
    steps: [
      creaseVert(),
      cornersIn(),
      cornersInAgain(),
      foldClosed(),
      wings('Vouw de vleugels smal, dicht tegen de romp.'),
      finishFlat('Gooi met een korte, snelle polsbeweging, volledig recht vooruit.')
    ]
  },
  {
    id: 'de-zwaluw',
    name: 'De Zwaluw',
    tagline: 'Wendbaar en sierlijk',
    category: 'stunt',
    difficulty: 4,
    stats: { afstand: 3, hoogte: 3, stabiliteit: 3, moeilijkheid: 4 },
    description: 'Naar het voorbeeld van de vogel: gespleten, naar achteren geplaatste vleugels voor sierlijke bochten in de vlucht.',
    tips: 'Buig de vleugeltips lichtjes omhoog voor extra draai in de vlucht.',
    steps: [
      creaseVert(),
      cornersIn(),
      cornersInAgain(),
      foldClosed(),
      wings('Plaats de vleugels iets verder naar achteren dan gebruikelijk.'),
      flapCuts(),
      bendFlaps('licht omhoog aan één kant voor een draaiende vlucht'),
      finishAdjust('Gooi met een lichte draai in je pols voor een sierlijke boog.')
    ]
  },
  {
    id: 'de-vleermuis',
    name: 'De Vleermuis',
    tagline: 'Brede, dramatische vleugelslag',
    category: 'stunt',
    difficulty: 4,
    stats: { afstand: 2, hoogte: 3, stabiliteit: 2, moeilijkheid: 4 },
    description: 'Extra brede, puntige vleugels zorgen voor een dramatische, onvoorspelbare vliegstijl vol wendingen.',
    tips: 'Geen twee vluchten zijn hetzelfde — dat is precies het idee.',
    steps: [
      creaseVert(),
      cornersIn('Maak de hoeken extra ver naar buiten voor puntige vleugeltips.'),
      foldClosed(),
      wings('Vouw de vleugels breed en met een duidelijke punt aan het uiteinde.'),
      flapCuts(),
      bendFlaps('in tegengestelde richtingen voor extra dramatiek'),
      finishAdjust('Gooi hoog en laat het toestel zelf zijn weg zoeken.')
    ]
  },
  {
    id: 'de-straaljager',
    name: 'De Straaljager',
    tagline: 'Agressieve neus, hoge snelheid',
    category: 'snelheid',
    difficulty: 3,
    stats: { afstand: 4, hoogte: 2, stabiliteit: 3, moeilijkheid: 3 },
    description: 'Met een extra scherp gevouwen neus en compacte vleugels oogt dit model als een echte straaljager.',
    tips: 'Gebruik iets zwaarder papier voor een stabielere, snellere vlucht.',
    steps: [
      creaseVert(),
      cornersIn(),
      cornersInAgain(),
      noseLock(),
      foldClosed(),
      wings('Vouw de vleugels compact en strak tegen de romp.'),
      finishFlat('Gooi met kracht en volledig horizontaal voor de snelste vlucht.')
    ]
  },
  {
    id: 'de-papieren-raket',
    name: 'De Papieren Raket',
    tagline: 'Recht omhoog, recht omlaag',
    category: 'snelheid',
    difficulty: 2,
    stats: { afstand: 3, hoogte: 5, stabiliteit: 2, moeilijkheid: 2 },
    description: 'Minder vleugeloppervlak, meer romp: dit model is gemaakt om steil omhoog te schieten.',
    tips: 'Gooi bijna verticaal omhoog voor het echte raket-effect.',
    steps: [
      creaseVert(),
      cornersIn(),
      cornersInAgain(),
      foldClosed(),
      wings('Vouw de vleugels smal, zodat de romp dominant blijft.'),
      finishFlat('Gooi met een snelle, verticale worp recht omhoog.')
    ]
  },
  {
    id: 'de-kraanvogel-vlieger',
    name: 'De Kraanvogel-vlieger',
    tagline: 'Origami-elegantie ontmoet aerodynamica',
    category: 'zweven',
    difficulty: 4,
    stats: { afstand: 3, hoogte: 3, stabiliteit: 4, moeilijkheid: 4 },
    description: 'Geïnspireerd op de klassieke origami-kraanvogel, met extra vouwen voor een verfijnde, gebalanceerde zweefvlucht.',
    tips: 'Neem de tijd voor nette, scherpe vouwen — dit model is gevoelig voor slordigheid.',
    steps: [
      creaseVert(),
      cornersIn(),
      cornersInAgain(),
      noseLock(),
      foldClosed(),
      wings('Vouw de vleugels in twee rustige stappen, eerst breed, dan iets terug.'),
      curlTrailingEdge(),
      dihedral(),
      finishAdjust('Gooi laag en zacht — dit model wil rustig glijden, niet snel vliegen.')
    ]
  },
  {
    id: 'de-bumerang',
    name: 'De Bumerang',
    tagline: 'Komt (soms) terug naar je toe',
    category: 'stunt',
    difficulty: 4,
    stats: { afstand: 1, hoogte: 2, stabiliteit: 2, moeilijkheid: 4 },
    description: 'Sterk opgekrulde vleugelranden zorgen ervoor dat dit toestel een lus in de lucht maakt en soms terugkeert naar de werper.',
    tips: 'Gooi tegen de wind in op een rustige dag voor de grootste kans op een terugkerende vlucht.',
    steps: [
      creaseVert(),
      cornersIn(),
      foldClosed(),
      wings(),
      curlTrailingEdge(),
      { stage: 'wings', action: 'adjust', title: 'Krul nogmaals, steviger', text: 'Krul de achterranden van de vleugels nu nog verder om, tot ze een duidelijke haak vormen.' },
      finishAdjust('Gooi schuin omhoog met een lichte draai — het toestel maakt dan een boog terug.')
    ]
  },
  {
    id: 'de-nakamura-lock',
    name: 'De Nakamura Lock',
    tagline: 'De legendarische afstandskampioen',
    category: 'ver',
    difficulty: 5,
    stats: { afstand: 5, hoogte: 2, stabiliteit: 4, moeilijkheid: 5 },
    description: 'Vernoemd naar de vouwtechniek die de neus "vergrendelt". Een van de bekendste ontwerpen voor recordpogingen op afstand.',
    tips: 'Deze vouwtechniek staat aan de basis van veel wereldrecordpogingen verre-afstandvliegen.',
    steps: [
      creaseVert(),
      cornersIn(),
      cornersInAgain(),
      noseLock(),
      noseWeight(),
      foldClosed(),
      wings('Vouw de vleugels smal en strak, met de voorrand strak tegen de vergrendelde neus.'),
      dihedral(),
      finishFlat('Gooi met een krachtige, vloeiende worp op een lichte opwaartse hoek voor maximale afstand.')
    ]
  },
  {
    id: 'de-torpedo',
    name: 'De Torpedo',
    tagline: 'Compact en doelgericht',
    category: 'snelheid',
    difficulty: 3,
    stats: { afstand: 4, hoogte: 1, stabiliteit: 4, moeilijkheid: 3 },
    description: 'Een compacte, zware neus en korte vleugels maken dit model bijzonder stabiel bij hoge snelheid.',
    tips: 'Werkt uitstekend in ruimtes met tocht, waar lichtere modellen afdwalen.',
    steps: [
      creaseVert(),
      cornersIn(),
      cornersInAgain(),
      noseWeight(),
      foldClosed(),
      wings('Vouw de vleugels kort en breed voor extra stabiliteit.'),
      finishFlat('Gooi recht en stevig — dit toestel houdt vrijwel altijd zijn koers.')
    ]
  }
];

fs.writeFileSync(
  path.join(__dirname, '..', 'data', 'planes.json'),
  JSON.stringify({ planes }, null, 2)
);

console.log(`Geschreven: ${planes.length} vliegtuigjes naar data/planes.json`);
