(function () {
  const CAT_META = {
    ver: { label: 'Ver vliegen', icon: '🎯' },
    zweven: { label: 'Zweven', icon: '🪶' },
    stunt: { label: 'Stunts', icon: '🌀' },
    snelheid: { label: 'Snelheid', icon: '⚡' }
  };

  const grid = document.getElementById('grid');
  const filterChips = document.querySelectorAll('.filter-chip');
  const overlay = document.getElementById('detail-overlay');
  const detailContent = document.getElementById('detail-content');
  const detailClose = document.getElementById('detail-close');

  let planes = [];
  let activeCat = 'alle';
  let currentPlane = null;
  let currentStep = 0;

  function difficultyDots(level) {
    let html = '<div class="difficulty" title="Moeilijkheidsgraad">';
    for (let i = 1; i <= 5; i++) {
      html += `<span class="${i <= level ? 'on' : ''}"></span>`;
    }
    return html + '</div>';
  }

  function statBar(label, value) {
    return `
      <div class="stat-bar">
        <span class="label">${label}</span>
        <span class="track"><span class="fill" style="width:${value * 20}%"></span></span>
      </div>`;
  }

  function renderCard(plane) {
    const meta = CAT_META[plane.category];
    const card = document.createElement('article');
    card.className = `card cat-${plane.category}`;
    card.tabIndex = 0;
    card.setAttribute('role', 'button');
    card.setAttribute('aria-label', `Bekijk vouwinstructies voor ${plane.name}`);
    card.innerHTML = `
      <span class="cat-tag">${meta.icon} ${meta.label}</span>
      <div class="card-top">
        <div class="card-icon">${meta.icon}</div>
        ${difficultyDots(plane.difficulty)}
      </div>
      <h3>${plane.name}</h3>
      <p class="tagline">${plane.tagline}</p>
      <div class="stat-bars">
        ${statBar('Afstand', plane.stats.afstand)}
        ${statBar('Hoogte', plane.stats.hoogte)}
        ${statBar('Stabiliteit', plane.stats.stabiliteit)}
      </div>
    `;
    card.addEventListener('click', () => openDetail(plane));
    card.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openDetail(plane); }
    });
    return card;
  }

  function renderGrid() {
    grid.innerHTML = '';
    const list = activeCat === 'alle' ? planes : planes.filter(p => p.category === activeCat);
    if (!list.length) {
      grid.innerHTML = '<p style="color:var(--text-dim)">Geen vliegtuigjes in deze categorie.</p>';
      return;
    }
    const frag = document.createDocumentFragment();
    list.forEach(p => frag.appendChild(renderCard(p)));
    grid.appendChild(frag);
  }

  filterChips.forEach(chip => {
    chip.addEventListener('click', () => {
      filterChips.forEach(c => c.classList.remove('is-active'));
      chip.classList.add('is-active');
      activeCat = chip.dataset.cat;
      renderGrid();
    });
  });

  // ---- Detail / stepper --------------------------------------------------
  function openDetail(plane) {
    currentPlane = plane;
    currentStep = 0;
    document.body.style.overflow = 'hidden';
    overlay.hidden = false;
    renderDetail();
    history.replaceState(null, '', `#${plane.id}`);
  }

  function closeDetail() {
    overlay.hidden = true;
    document.body.style.overflow = '';
    history.replaceState(null, '', '#collectie');
  }

  detailClose.addEventListener('click', closeDetail);
  overlay.addEventListener('click', (e) => { if (e.target === overlay) closeDetail(); });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !overlay.hidden) closeDetail();
    if (!overlay.hidden && currentPlane) {
      if (e.key === 'ArrowRight') goStep(1);
      if (e.key === 'ArrowLeft') goStep(-1);
    }
  });

  function goStep(delta) {
    const steps = currentPlane.steps;
    const next = currentStep + delta;
    if (next < 0 || next >= steps.length) return;
    currentStep = next;
    renderStep();
  }

  function renderDetail() {
    const p = currentPlane;
    const meta = CAT_META[p.category];
    detailContent.innerHTML = `
      <div class="detail-header">
        <span class="cat-tag">${meta.icon} ${meta.label}</span>
        <h2 id="detail-title">${p.name}</h2>
        <p class="tagline">${p.tagline}</p>
      </div>
      <p class="detail-desc">${p.description}</p>
      <div class="detail-tip"><strong>Vliegtip.</strong> ${p.tips}</div>
      <div class="stat-grid">
        ${statCard('Afstand', p.stats.afstand)}
        ${statCard('Hoogte', p.stats.hoogte)}
        ${statCard('Stabiliteit', p.stats.stabiliteit)}
        ${statCard('Moeilijkheid', p.stats.moeilijkheid)}
      </div>
      <div class="stepper-head">
        <h3>Vouwinstructies</h3>
        <div class="step-dots" id="step-dots"></div>
      </div>
      <div id="step-body"></div>
      <div class="step-nav">
        <button id="prev-step">← Vorige</button>
        <button id="next-step">Volgende →</button>
      </div>
    `;
    document.getElementById('prev-step').addEventListener('click', () => goStep(-1));
    document.getElementById('next-step').addEventListener('click', () => goStep(1));
    renderStepDots();
    renderStep();
  }

  function statCard(label, value) {
    return `
      <div class="stat-card">
        <div class="label">${label}</div>
        ${difficultyDots(value)}
      </div>`;
  }

  function renderStepDots() {
    const dotsEl = document.getElementById('step-dots');
    dotsEl.innerHTML = currentPlane.steps
      .map((_, i) => `<button data-i="${i}" class="${i === currentStep ? 'is-active' : ''}">${i + 1}</button>`)
      .join('');
    dotsEl.querySelectorAll('button').forEach(btn => {
      btn.addEventListener('click', () => {
        currentStep = parseInt(btn.dataset.i, 10);
        renderStep();
      });
    });
  }

  function renderStep() {
    const steps = currentPlane.steps;
    const step = steps[currentStep];
    const prevStage = currentStep === 0 ? 'vel' : steps[currentStep - 1].stage;
    const diagram = window.FoldDiagrams.renderFoldDiagram(prevStage, step.stage, step.action);

    document.getElementById('step-body').innerHTML = `
      <div class="step-body">
        <div class="step-diagram">${diagram}</div>
        <div class="step-text">
          <div class="step-count">Stap ${currentStep + 1} van ${steps.length}</div>
          <h4>${step.title}</h4>
          <p>${step.text}</p>
        </div>
      </div>
    `;

    document.querySelectorAll('#step-dots button').forEach((btn, i) => {
      btn.classList.toggle('is-active', i === currentStep);
    });
    document.getElementById('prev-step').disabled = currentStep === 0;
    document.getElementById('next-step').disabled = currentStep === steps.length - 1;
  }

  // ---- Boot ---------------------------------------------------------------
  fetch('/api/planes')
    .then(r => r.json())
    .then(data => {
      planes = data.planes;
      document.getElementById('stat-count').textContent = planes.length;
      renderGrid();

      const hash = decodeURIComponent(location.hash.replace('#', ''));
      if (hash && hash !== 'collectie') {
        const found = planes.find(p => p.id === hash);
        if (found) openDetail(found);
      }
    })
    .catch(err => {
      grid.innerHTML = '<p style="color:var(--text-dim)">Kon de collectie niet laden. Ververs de pagina.</p>';
      console.error(err);
    });
})();
