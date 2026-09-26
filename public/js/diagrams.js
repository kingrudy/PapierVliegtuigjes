/*
 * Schematisch vouwdiagram-systeem.
 * Elke stap heeft een "stage" (het resultaat, als silhouet) en een "action"
 * (de vouwbeweging die naar dat resultaat leidt). We tekenen het silhouet van
 * de vorige stap als lichte "geest", de nieuwe vorm als gevulde vorm erbovenop,
 * en een decoratie (vouwlijn + pijl) die bij de action hoort.
 */

const VB = '0 0 200 260';

// ---- Silhouetten per stage ---------------------------------------------------
const SHAPES = {
  vel: [
    { points: '20,20 180,20 180,240 20,240', cls: 'paper' }
  ],
  kite: [
    { points: '100,20 180,100 180,240 20,240 20,100', cls: 'paper' }
  ],
  'kite-sharp': [
    { points: '100,70 180,100 180,240 20,240 20,100', cls: 'paper' }
  ],
  folded: [
    { points: '100,70 130,240 70,240', cls: 'paper' }
  ],
  wings: [
    { points: '100,70 130,240 70,240', cls: 'paper fuselage' },
    { points: '70,120 8,148 8,225 70,205', cls: 'paper wing' },
    { points: '130,120 192,148 192,225 130,205', cls: 'paper wing' }
  ],
  finished: [
    { points: '100,70 130,240 70,240', cls: 'paper fuselage' },
    { points: '70,120 6,150 10,222 70,205', cls: 'paper wing' },
    { points: '130,120 194,150 190,222 130,205', cls: 'paper wing' }
  ]
};

const STAGE_ORDER = ['vel', 'kite', 'kite-sharp', 'folded', 'wings', 'finished'];

function poly(points, cls, extra = '') {
  return `<polygon points="${points}" class="${cls}" ${extra}/>`;
}

function ghostOf(stageKey) {
  return (SHAPES[stageKey] || SHAPES.vel)
    .map(p => poly(p.points, 'ghost'))
    .join('');
}

function shapeOf(stageKey) {
  return (SHAPES[stageKey] || SHAPES.vel)
    .map(p => poly(p.points, p.cls))
    .join('');
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
    ${arrow(70, 150, 100, 150, 16)}
    ${arrow(130, 150, 100, 150, 16)}
  `,
  'valley-horizontal-wings': () => `
    ${dashedLine(70, 120, 8, 148)}
    ${dashedLine(130, 120, 192, 148)}
    ${arrow(45, 100, 35, 135, 12)}
    ${arrow(155, 100, 165, 135, 12)}
  `,
  'small-cuts': () => `
    <path d="M15,190 l10,8 l-10,8 M15,198 l14,0" class="scissor"/>
    <path d="M185,190 l-10,8 l10,8 M185,198 l-14,0" class="scissor"/>
  `,
  adjust: () => `
    ${arrow(20, 210, 12, 190, 10)}
    ${arrow(180, 210, 188, 190, 10)}
  `,
  none: () => ''
};

function decorationOf(action) {
  const fn = DECORATIONS[action] || DECORATIONS.none;
  return fn();
}

/**
 * Render een SVG-diagram voor één vouwstap.
 * @param {string} prevStage - de stage van de vorige stap (of 'vel' voor de eerste)
 * @param {string} stage - de stage die deze stap oplevert
 * @param {string} action - het type vouwbeweging
 */
function renderFoldDiagram(prevStage, stage, action) {
  const showGhost = prevStage && prevStage !== stage;
  return `
  <svg viewBox="${VB}" class="fold-diagram" role="img" aria-label="Vouwdiagram">
    <defs>
      <marker id="arrowhead" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
        <path d="M0,0 L6,3 L0,6 Z" class="fold-arrow-head"/>
      </marker>
    </defs>
    ${showGhost ? ghostOf(prevStage) : ''}
    ${shapeOf(stage)}
    ${decorationOf(action)}
  </svg>`;
}

window.FoldDiagrams = { renderFoldDiagram, STAGE_ORDER };
