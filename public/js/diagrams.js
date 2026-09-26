/*
 * Schematisch vouwdiagram-systeem.
 * Elke stap heeft een "stage" (het resultaat, als silhouet) en een "action"
 * (de vouwbeweging die naar dat resultaat leidt). We tekenen het silhouet van
 * de vorige stap als lichte "geest", de nieuwe vorm als gevulde vorm erbovenop,
 * plus een structuurlijn (de kiel/spine, als die zichtbaar hoort te zijn) en
 * een decoratie (vouwlijn + pijl) die bij de action hoort.
 */

const VB = '0 0 200 260';

// ---- Silhouetten per stage ---------------------------------------------------
// Elke stage = { parts: [...polygonen], spine: solide lijn of null }
const SHAPES = {
  vel: {
    parts: [{ points: '20,20 180,20 180,240 20,240', cls: 'paper' }],
    spine: null
  },
  kite: {
    parts: [{ points: '100,20 180,100 180,240 20,240 20,100', cls: 'paper' }],
    spine: null
  },
  'kite-sharp': {
    parts: [{ points: '100,70 180,100 180,240 20,240 20,100', cls: 'paper' }],
    spine: null
  },
  folded: {
    parts: [{ points: '100,70 122,240 78,240', cls: 'paper fuselage' }],
    spine: [100, 70, 100, 240]
  },
  wings: {
    parts: [
      { points: '100,108 6,232 100,232', cls: 'paper wing' },
      { points: '100,108 194,232 100,232', cls: 'paper wing' },
      { points: '100,70 122,240 78,240', cls: 'paper fuselage' }
    ],
    spine: [100, 70, 100, 240]
  },
  finished: {
    parts: [
      { points: '100,108 6,230 34,236 100,232', cls: 'paper wing' },
      { points: '100,108 194,230 166,236 100,232', cls: 'paper wing' },
      { points: '100,70 122,240 78,240', cls: 'paper fuselage' }
    ],
    spine: [100, 70, 100, 240]
  }
};

const STAGE_ORDER = ['vel', 'kite', 'kite-sharp', 'folded', 'wings', 'finished'];

function poly(points, cls) {
  return `<polygon points="${points}" class="${cls}"/>`;
}

function partsOf(stageKey) {
  return (SHAPES[stageKey] || SHAPES.vel).parts.map(p => poly(p.points, p.cls)).join('');
}

function ghostOf(stageKey) {
  return (SHAPES[stageKey] || SHAPES.vel).parts.map(p => poly(p.points, 'ghost')).join('');
}

function spineOf(stageKey) {
  const s = (SHAPES[stageKey] || SHAPES.vel).spine;
  if (!s) return '';
  return `<line x1="${s[0]}" y1="${s[1]}" x2="${s[2]}" y2="${s[3]}" class="spine"/>`;
}

// ---- Decoraties per action ---------------------------------------------------
function arrow(x1, y1, x2, y2, curve = 20) {
  const mx = (x1 + x2) / 2;
  const my = (y1 + y2) / 2 - curve;
  return `<path d="M${x1},${y1} Q${mx},${my} ${x2},${y2}" class="fold-arrow" marker-end="url(#arrowhead)"/>`;
}

function dashedLine(x1, y1, x2, y2, mountain = false) {
  return `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" class="${mountain ? 'crease-mountain' : 'crease-valley'}"/>`;
}

const DECORATIONS = {
  'crease-vertical': () => `
    ${dashedLine(100, 20, 100, 240)}
    ${arrow(60, 60, 92, 60, 26)}
    ${arrow(140, 60, 108, 60, 26)}
  `,
  'valley-diagonal-both': () => `
    ${dashedLine(20, 20, 100, 100)}
    ${dashedLine(180, 20, 100, 100)}
    ${arrow(50, 35, 85, 75, 18)}
    ${arrow(150, 35, 115, 75, 18)}
  `,
  'valley-diagonal-both-2': () => `
    ${dashedLine(20, 100, 100, 70)}
    ${dashedLine(180, 100, 100, 70)}
    ${arrow(45, 95, 85, 78, 14)}
    ${arrow(155, 95, 115, 78, 14)}
  `,
  'valley-small-tip': () => `
    ${dashedLine(82, 82, 118, 82)}
    ${arrow(100, 70, 100, 90, 10)}
  `,
  'mountain-vertical': () => `
    ${dashedLine(100, 70, 100, 240, true)}
    ${arrow(70, 150, 102, 150, 16)}
    ${arrow(130, 150, 98, 150, 16)}
  `,
  'valley-horizontal-wings': () => `
    ${dashedLine(100, 108, 6, 232)}
    ${dashedLine(100, 108, 194, 232)}
    ${arrow(60, 90, 45, 130, 14)}
    ${arrow(140, 90, 155, 130, 14)}
  `,
  'small-cuts': () => `
    <path d="M15,190 l10,8 l-10,8 M15,198 l14,0" class="scissor"/>
    <path d="M185,190 l-10,8 l10,8 M185,198 l-14,0" class="scissor"/>
  `,
  adjust: () => `
    ${arrow(20, 215, 10, 195, 10)}
    ${arrow(180, 215, 190, 195, 10)}
  `,
  none: () => ''
};

function decorationOf(action) {
  const fn = DECORATIONS[action] || DECORATIONS.none;
  return fn();
}

const DEFS = `
  <defs>
    <marker id="arrowhead" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
      <path d="M0,0 L6,3 L0,6 Z" class="fold-arrow-head"/>
    </marker>
  </defs>`;

/**
 * Render een SVG-diagram voor één vouwstap.
 * @param {string} prevStage - de stage van de vorige stap (of 'vel' voor de eerste)
 * @param {string} stage - de stage die deze stap oplevert
 * @param {string} action - het type vouwbeweging
 * @param {object} [opts] - { mini: boolean, stepNumber: number }
 */
function renderFoldDiagram(prevStage, stage, action, opts = {}) {
  const showGhost = prevStage && prevStage !== stage;
  const cls = 'fold-diagram' + (opts.mini ? ' fold-diagram-mini' : '');
  return `
  <svg viewBox="${VB}" class="${cls}" role="img" aria-label="Vouwdiagram">
    ${DEFS}
    ${showGhost ? ghostOf(prevStage) : ''}
    ${partsOf(stage)}
    ${spineOf(stage)}
    ${!opts.mini ? decorationOf(action) : ''}
  </svg>`;
}

/** Kleine legenda die de symbolen in de diagrammen uitlegt. */
function renderLegend() {
  return `
  <div class="fold-legend">
    <span class="legend-item"><i class="legend-swatch legend-valley"></i>Bergvouw naar boven (valley fold)</span>
    <span class="legend-item"><i class="legend-swatch legend-mountain"></i>Dalvouw naar achteren (mountain fold)</span>
    <span class="legend-item"><svg class="legend-arrow" viewBox="0 0 40 20"><path d="M4,16 Q20,0 36,16" class="fold-arrow" marker-end="url(#arrowhead-legend)"/><defs><marker id="arrowhead-legend" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto"><path d="M0,0 L6,3 L0,6 Z" class="fold-arrow-head"/></marker></defs></svg>Vouwrichting</span>
    <span class="legend-item"><i class="legend-swatch legend-ghost"></i>Vorige stap (ter referentie)</span>
  </div>`;
}

window.FoldDiagrams = { renderFoldDiagram, renderLegend, STAGE_ORDER };
