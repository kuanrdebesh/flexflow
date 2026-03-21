// ═══════════════════════════════════════════════════════
//  FLEXFLOW — complete application logic
//  Written as one coherent file, no patches
// ═══════════════════════════════════════════════════════

// ── STATE ────────────────────────────────────────────
var STRETCHES = [];
var selected = new Set();
var depth = 'quick';
var activeTab = 0;
var timers = {};
var currentPlan = null;
var editingPlanId = null;

// Stretch IDs that have reference photos in /images/
// Add entries here as photos are sourced
// Add image paths here as photos are sourced
// e.g. 'post-pigeon-pose': 'images/post-pigeon-pose.jpg'
var IMAGE_STRETCHES = {
  'act-chest-band-pullaway': 'images/act-chest-band-pullaway.png',
  'act-chest-pushup-plus' : 'images/act-chest-pushup-plus.png',
  'act-chest-db-fly-light' : 'images/act-chest-db-fly-light.png',
  'act-chest-band-crossover' : 'images/act-chest-band-crossover.png',
  'act-shoulder-ext-rot' : 'images/act-shoulder-ext-rot.png',
  'act-shoulder-int-rot' : 'images/act-shoulder-int-rot.png',
  'act-shoulder-band-yt' : 'images/act-shoulder-band-yt.png',
  'act-shoulder-db-lr' : 'images/act-shoulder-db-lr.png',
  'act-traps-shrug-light' : 'images/act-traps-shrug-light.png',
  'act-traps-band-pullapart' : 'images/act-traps-band-pullapart.png',
  'act-traps-facepull-band' : 'images/act-traps-facepull-band.png',
  'act-traps-scap-retraction' : 'images/act-traps-scap-retraction.png',
  'act-glutes-bridge' : 'images/act-glutes-bridge.png',
  'act-hip-frog-pump' : 'images/act-hip-frog-pump.png',
  'act-hip-db-step' : 'images/act-hip-db-step.png',
  'act-hip-band-kickback' : 'images/act-hip-band-kickback.png',
  'act-hip-march' : 'images/act-hip-march.png',
  'act-abs-bird-dog' : 'images/act-abs-bird-dog.png',
  'act-abs-band-pallof' : 'images/act-abs-band-pallof.png',
  'act-abs-dead-bug' : 'images/act-abs-dead-bug.png',
  'act-neck-chin-tuck-rep' : 'images/act-neck-chin-tuck-rep.png',
  'act-neck-band-resist' : 'images/act-neck-band-resist.png',
  'act-neck-rotation' : 'images/act-neck-rotation.png',
  'act-neck-nod-tilt' : 'images/act-neck-nod-tilt.png',
  'act-forearms-grip-squeeze' : 'images/act-forearms-grip-squeeze.png',
  'act-forearms-db-wrist-curl' : 'images/act-forearms-db-wrist-curl.png',
  'act-forearms-band-flex' : 'images/act-forearms-band-flex.png',
  'act-forearms-wrist-roller' : 'images/act-forearms-wrist-roller.png',
  'act-abs-plank-shoulder' : 'images/act-abs-plank-shoulder.png',
  'act-triceps-diamond-pu' : 'images/act-triceps-diamond-pu.png',
  'act-triceps-band-overhead' : 'images/act-triceps-band-overhead.png',
  'act-triceps-db-kickback' : 'images/act-triceps-db-kickback.png',
  'act-triceps-band-pushdown' : 'images/act-triceps-band-pushdown.png',
  'act-biceps-wall-slide' : 'images/act-biceps-wall-slide.png',
  'act-biceps-band-hammer' : 'images/act-biceps-band-hammer.png',
  'act-biceps-db-supination' : 'images/act-biceps-db-supination.png',
  'act-biceps-band-curl' : 'images/act-biceps-band-curl.png',
  'act-back-dead-hang' : 'images/act-back-dead-hang.png',
  'act-back-db-pullover-light' : 'images/act-back-db-pullover-light.png',
  'act-back-scap-pushup' : 'images/act-back-scap-pushup.png',
  'act-back-band-row' : 'images/act-back-band-row.png',
  'act-hams-good-morning-bw' : 'images/act-hams-good-morning-bw.png',
  'act-hams-db-rdl-light' : 'images/act-hams-db-rdl-light.png',
  'act-hams-band-leg-curl' : 'images/act-hams-band-leg-curl.png',
  'act-hams-nordic-eccentric' : 'images/act-hams-nordic-eccentric.png',
  'act-quads-step-up' : 'images/act-quads-step-up.png',
  'act-quads-db-lunge-light' : 'images/act-quads-db-lunge-light.png',
  'act-quads-wall-sit' : 'images/act-quads-wall-sit.png',
  'act-quads-tke' : 'images/act-quads-tke.png',
  'act-glutes-clamshell' : 'images/act-glutes-clamshell.png',
  'act-glutes-db-rdl-light' : 'images/act-glutes-db-rdl-light.png',
  'act-glutes-band-walk' : 'images/act-glutes-band-walk.png',
  'act-abduc-band-clamshell' : 'images/act-abduc-band-clamshell.png',
  'act-abduc-band-squat-walk' : 'images/act-abduc-band-squat-walk.png',
  'act-abduc-db-side-lunge' : 'images/act-abduc-db-side-lunge.png',
  'act-abduc-side-lying-raise' : 'images/act-abduc-side-lying-raise.png',
  'act-adduc-db-sumo' : 'images/act-adduc-db-sumo.png',
  'act-adduc-lateral-lunge' : 'images/act-adduc-lateral-lunge.png',
  'act-adduc-sumo-squat-bw' : 'images/act-adduc-sumo-squat-bw.png',
  'act-calves-band-flex' : 'images/act-calves-band-flex.png',
  'act-calves-db-raise-seated' : 'images/act-calves-db-raise-seated.png',
  'act-calves-raise-slow' : 'images/act-calves-raise-slow.png',
  'act-calves-single-leg' : 'images/act-calves-single-leg.png',
  'act-shins-tib-raise' : 'images/act-shins-tib-raise.png',
};

// ── MUSCLE GROUPS ─────────────────────────────────────
var MG = [
  { tab:'Upper', muscles:[
    {id:'chest',      label:'Chest',            region:'Pectorals'},
    {id:'shoulders',  label:'Shoulders',        region:'Deltoids'},
    {id:'traps',      label:'Traps',            region:'Trapezius'},
    {id:'back',       label:'Back',             region:'Lats · Erectors'},
    {id:'biceps',     label:'Biceps',           region:'Elbow Flexors'},
    {id:'triceps',    label:'Triceps',          region:'Elbow Extensors'},
    {id:'forearms',   label:'Forearms',         region:'Wrist Flex/Ext'},
    {id:'neck',       label:'Neck',             region:'Cervical'},
  ]},
  { tab:'Core', muscles:[
    {id:'abs',        label:'Abs',              region:'Rectus / Obliques'},
    {id:'hipflexors', label:'Hip Flexors',      region:'Psoas · Iliacus'},
  ]},
  { tab:'Lower', muscles:[
    {id:'glutes',     label:'Glutes',           region:'Gluteus Maximus'},
    {id:'quads',      label:'Quads',            region:'Quadriceps'},
    {id:'hamstrings', label:'Hamstrings',       region:'Biceps Femoris'},
    {id:'adductors',  label:'Adductors',        region:'Inner Thigh'},
    {id:'abductors',  label:'Abductors',        region:'TFL · Glute Med'},
    {id:'calves',     label:'Calves',           region:'Gastrocnemius · Soleus'},
    {id:'shins',      label:'Shins / Tibialis', region:'Tibialis Anterior'},
  ]},
];

// ── PRESETS ───────────────────────────────────────────
var PRESETS = {
  fullbody: function() { return MG.flatMap(function(g){ return g.muscles.map(function(m){ return m.id; }); }); },
  upper:    function() { return MG[0].muscles.concat(MG[1].muscles).map(function(m){ return m.id; }); },
  lower:    function() { return MG[2].muscles.concat(MG[1].muscles).map(function(m){ return m.id; }); },
};

// ── BOOT ──────────────────────────────────────────────
window.addEventListener('DOMContentLoaded', function() {
  try {
    // STRETCHES_DATA is injected by the build script for standalone use.
    // When deployed, remove STRETCHES_DATA and use the fetch path instead.
    if (typeof STRETCHES_DATA !== 'undefined') {
      STRETCHES = STRETCHES_DATA;
      init();
    } else {
      fetch('data/stretches.json')
        .then(function(r) { return r.json(); })
        .then(function(data) { STRETCHES = data; init(); })
        .catch(function(e) { showError(e.message); });
    }
  } catch(e) {
    showError(e.message);
  }
});

function init() {
  applyTheme();
  buildSidebar();
  buildLibrary();
  updatePlansBadge();
  document.getElementById('loading').style.display = 'none';
}

function showError(msg) {
  document.getElementById('loading').innerHTML =
    '<div style="color:var(--a1);font-family:monospace;padding:24px;text-align:center;max-width:400px">'
    + '<strong>FlexFlow failed to start</strong><br><br><small>' + msg + '</small></div>';
}

// ── VIEWS ─────────────────────────────────────────────
function showView(name) {
  document.querySelectorAll('.view').forEach(function(v){ v.classList.remove('on'); });
  document.querySelectorAll('.nav-tab').forEach(function(t){ t.classList.remove('on'); });
  document.getElementById('view-' + name).classList.add('on');
  var tab = document.querySelector('[data-view="' + name + '"]');
  if (tab) tab.classList.add('on');
  if (name === 'plans') renderSavedPlans();
}

// ── DEPTH ─────────────────────────────────────────────
function setDepth(d) {
  depth = d;
  document.getElementById('depth-quick').className = 'depth-btn' + (d === 'quick' ? ' quick-on' : '');
  document.getElementById('depth-optimised').className = 'depth-btn' + (d === 'optimised' ? ' optimised-on' : '');
  document.getElementById('depth-detailed').className = 'depth-btn' + (d === 'detailed' ? ' detail-on' : '');
}

// ── PRESETS ───────────────────────────────────────────
function applyPreset(key) {
  selected.clear();
  PRESETS[key]().forEach(function(id){ selected.add(id); });
  clearPresetHL();
  document.getElementById('preset-' + key).classList.add('on');
  renderMuscleList(activeTab);
  updateFooter();
  generate();
}
function clearPresetHL() {
  document.querySelectorAll('.preset-btn').forEach(function(b){ b.classList.remove('on'); });
}

// ── SIDEBAR ───────────────────────────────────────────
function buildSidebar() {
  var tabsEl = document.getElementById('mg-tabs');
  MG.forEach(function(g, i) {
    var t = document.createElement('div');
    t.className = 'mg-tab' + (i === 0 ? ' on' : '');
    t.textContent = g.tab;
    t.onclick = function() {
      document.querySelectorAll('.mg-tab').forEach(function(x){ x.classList.remove('on'); });
      t.classList.add('on'); activeTab = i; renderMuscleList(i);
    };
    tabsEl.appendChild(t);
  });
  renderMuscleList(0);
}

function renderMuscleList(gi) {
  var wrap = document.getElementById('muscle-list');
  wrap.innerHTML = '';
  MG[gi].muscles.forEach(function(m) {
    var chip = document.createElement('div');
    chip.className = 'mchip' + (selected.has(m.id) ? ' on' : '');
    chip.id = 'chip-' + m.id;
    chip.innerHTML = '<div class="mc-dot"></div><div class="mc-name">' + m.label + '</div><div class="mc-region">' + m.region + '</div>';
    chip.onclick = function() { toggleMuscle(m.id); };
    wrap.appendChild(chip);
  });
}

function toggleMuscle(id) {
  if (selected.has(id)) { selected.delete(id); } else { selected.add(id); }
  var chip = document.getElementById('chip-' + id);
  if (chip) chip.className = 'mchip' + (selected.has(id) ? ' on' : '');
  clearPresetHL();
  updateFooter();
}

function updateFooter() {
  var n = selected.size;
  var badge = document.getElementById('nbadge');
  badge.textContent = n; badge.style.display = n ? '' : 'none';
  document.getElementById('btn-gen').disabled = (n === 0);
  document.getElementById('sel-count').innerHTML = n === 0
    ? 'No muscles selected'
    : '<strong>' + n + '</strong> muscle' + (n > 1 ? 's' : '') + ' selected';
}

function clearAll() {
  selected.clear(); clearPresetHL();
  renderMuscleList(activeTab); updateFooter();
  document.getElementById('empty-state').style.display = '';
  document.getElementById('results').style.display = 'none';
  currentPlan = null; editingPlanId = null;
}

// ── GENERATE ──────────────────────────────────────────

// ── OPTIMISED SELECTION ───────────────────────────────────────
// Greedily picks stretches that maximise new muscles covered.
// maxPer = approximate max items to return
function optimisedSelect(candidates, muscles, maxPer) {
  var covered = {};
  var selected = [];
  var n = muscles.length;

  // First pass: take items with highest unique new coverage
  candidates.forEach(function(s) {
    if (selected.length >= maxPer) return;
    var newCoverage = s.covers.filter(function(m){ return !covered[m]; }).length;
    if (newCoverage > 0 || selected.length < 2) {
      selected.push(s);
      s.covers.forEach(function(m){ covered[m] = true; });
    }
  });

  // Second pass: if not all muscles covered yet and we have budget, add more
  var stillUncovered = muscles.filter(function(m){ return !covered[m]; });
  if (stillUncovered.length > 0) {
    candidates.forEach(function(s) {
      if (selected.indexOf(s) >= 0) return;
      if (selected.length >= maxPer + 2) return;
      var coversUncovered = s.covers.filter(function(m){ return !covered[m]; }).length;
      if (coversUncovered > 0) {
        selected.push(s);
        s.covers.forEach(function(m){ covered[m] = true; });
      }
    });
  }

  return selected;
}

function generate() {
  if (!selected.size) return;
  timers = {}; editingPlanId = null;
  var muscles = Array.from(selected);
  var seen = {}; var pre = []; var post = []; var act = [];

  // Collect all matching stretches (priority 1 = all modes, priority 2 = detailed only)
  var allAct = [], allPre = [], allPost = [];
  STRETCHES.forEach(function(s) {
    if (seen[s.id]) return;
    var covers = s.muscles.filter(function(m){ return muscles.indexOf(m) >= 0; });
    if (!covers.length) return;
    seen[s.id] = true;
    var e = obj(s); e.covers = covers;
    if (s.phase === 'activation') allAct.push(e);
    else if (s.phase === 'pre') allPre.push(e);
    else allPost.push(e);
  });

  // Sort all by coverage count descending
  allAct.sort(function(a,b){ return b.covers.length - a.covers.length; });
  allPre.sort(function(a,b){ return b.covers.length - a.covers.length; });
  allPost.sort(function(a,b){ return b.covers.length - a.covers.length; });

  if (depth === 'quick') {
    // Minimum effective dose — smart selection, tight caps
    // p1 candidates only, then pick highest coverage
    var qAct  = allAct.filter(function(s){ return (s.priority||1) === 1; });
    var qPre  = allPre.filter(function(s){ return (s.priority||1) === 1; });
    var qPost = allPost.filter(function(s){ return (s.priority||1) === 1; });
    act  = optimisedSelect(qAct,  muscles, 2);
    pre  = optimisedSelect(qPre,  muscles, 3);
    post = optimisedSelect(qPost, muscles, 4);
  } else if (depth === 'optimised') {
    // Best return on time — smart selection, medium caps, all priorities
    act  = optimisedSelect(allAct,  muscles, 4);
    pre  = optimisedSelect(allPre,  muscles, 5);
    post = optimisedSelect(allPost, muscles, 7);
  } else {
    // Detailed: everything, sorted by coverage
    act  = allAct;
    pre  = allPre;
    post = allPost;
  }
  currentPlan = {muscles:muscles, depth:depth, act:act, pre:pre, post:post};
  renderPlan(currentPlan, null);
}

function obj(s) { var c = {}; for (var k in s) c[k] = s[k]; return c; }

// ── RENDER PLAN ───────────────────────────────────────
function renderPlan(plan, planId) {
  var allM = MG.flatMap(function(g){ return g.muscles; });
  var mLabels = plan.muscles.map(function(id){
    var f = allM.filter(function(m){ return m.id === id; })[0];
    return f ? f.label : id;
  });
  var title = mLabels.length <= 3 ? mLabels.join(' + ') : mLabels.slice(0,2).join(' + ') + ' +' + (mLabels.length-2) + ' more';
  var act = plan.act || [];
  var preMin = Math.max(1, Math.round(plan.pre.length * 1.2));
  var postMin = Math.max(1, Math.round(plan.post.reduce(function(a,s){ return a+(s.timer||30); },0)/60));
  var mc = plan.depth === 'quick' ? 'quick' : plan.depth === 'optimised' ? 'optimised' : 'detailed';
  var ml = plan.depth === 'quick' ? '&#9889; Quick' : plan.depth === 'optimised' ? '&#10070; Optimised' : '&#9711; Detailed';
  var mPills = mLabels.map(function(l){ return '<span class="rpill rp-m">'+l+'</span>'; }).join('');
  var covChips = mLabels.map(function(l){ return '<span class="cov-chip">'+l+'</span>'; }).join('');
  var planName = planId ? (getPlans().filter(function(p){ return p.id === planId; })[0] || {}).name : null;
  var _actCount = (plan.act||[]).length;
  var _preCount = plan.pre.length;
  var _postCount = plan.post.length;
  var _countStr = (_actCount ? '<strong>' + _actCount + '</strong> activation · ' : '')
    + '<strong>' + _preCount + '</strong> pre · '
    + '<strong>' + _postCount + '</strong> post';
  var editLabel = planName ? ('Editing: <strong>' + planName + '</strong>') : _countStr;

  var html = '<div class="r-head">'
    + '<div class="r-eye">Today\'s Session</div>'
    + '<div class="r-title">Your <em>' + title + '</em><br>Stretch Plan</div>'
    + '<div class="r-meta"><span class="r-mode ' + mc + '">' + ml + '</span>' + mPills
    + '<span class="rpill rp-pre">Pre: ~' + preMin + ' min</span>'
    + '<span class="rpill rp-post">Post: ~' + postMin + ' min</span></div></div>'
    + '<div class="edit-bar"><div class="edit-bar-left">' + editLabel + '</div>'
    + '<div><button class="btn-save-plan" onclick="openSaveModal()">Save Plan</button></div></div>'
    + '<div class="cov-wrap"><div class="cov-lbl">Muscles covered</div><div class="cov-chips">' + covChips + '</div></div>'
    + (act.length ? '<div class="phase-block">'
    + '<div class="phase-bar act"><div class="pb-dot act"></div><div class="pb-name act">Activation</div><div class="pb-type">Warm-Up</div>'
    + '<div class="pb-stats"><div class="pb-stat"><strong>' + act.length + '</strong> exercises</div></div>'
    + '<button class="btn-add-stretch" onclick="openAddDrawer(\'activation\')">+ Add</button></div>'
    + '<div class="cards-stack" id="act-stack"></div></div>' : '')
    + '<div class="phase-block">'
    + '<div class="phase-bar pre"><div class="pb-dot pre"></div><div class="pb-name pre">Pre-Workout</div><div class="pb-type">Dynamic</div>'
    + '<div class="pb-stats"><div class="pb-stat"><strong>' + plan.pre.length + '</strong> movements</div><div class="pb-stat"><strong>' + preMin + '</strong> min</div></div>'
    + '<button class="btn-add-stretch" onclick="openAddDrawer(\'pre\')">+ Add</button></div>'
    + '<div class="cards-stack" id="pre-stack"></div></div>'
    + '<div class="phase-block">'
    + '<div class="phase-bar post"><div class="pb-dot post"></div><div class="pb-name post">Post-Workout</div><div class="pb-type">Static</div>'
    + '<div class="pb-stats"><div class="pb-stat"><strong>' + plan.post.length + '</strong> movements</div><div class="pb-stat"><strong>' + postMin + '</strong> min</div></div>'
    + '<button class="btn-add-stretch" onclick="openAddDrawer(\'post\')">+ Add</button></div>'
    + '<div class="cards-stack" id="post-stack"></div></div>';

  var res = document.getElementById('results');
  res.innerHTML = html;
  if (act.length) act.forEach(function(s,i){ renderCard(s, i, 'activation', 'act-stack'); });
  plan.pre.forEach(function(s,i){ renderCard(s, i, 'pre', 'pre-stack'); });
  plan.post.forEach(function(s,i){ renderCard(s, i, 'post', 'post-stack'); });
  document.getElementById('empty-state').style.display = 'none';
  res.style.display = 'block';
  document.getElementById('main-panel').scrollTop = 0;
}

// ── RENDER CARD ───────────────────────────────────────
function renderCard(s, idx, phase, stackId) {
  var stack = document.getElementById(stackId);
  if (!stack) return;
  var uid = phase + '-' + s.id + '-' + idx;
  var covers = s.covers || s.muscles;
  var phaseLabel = phase === 'pre' ? 'Dynamic' : phase === 'activation' ? 'Activation' : 'Static';
  var pClass = phase === 'pre' ? 'cp-pre' : phase === 'activation' ? 'cp-act' : 'cp-post';
  var fillClass = phase === 'pre' ? 'tf-pre' : phase === 'activation' ? 'tf-act' : 'tf-post';
  var corePill = s.priority === 1 ? '<span class="cpill cp-core">Core</span>' : '';
  var equipPill = '';
  if (s.equipment && s.equipment.length) {
    equipPill = '<span class="cpill cp-equip">' + s.equipment.map(function(e){ return e.toUpperCase(); }).join(' / ') + '</span>';
  }
  var coverPills = covers.map(function(m){ return '<span class="cpill cp-cov">'+m+'</span>'; }).join('');
  var imgSrc = IMAGE_STRETCHES[s.id] || null;
  var figSvg = getFig(s.fig || '');

  // Thumbnail flip card
  var thumbHtml = '<div class="flip-wrap' + (imgSrc ? ' has-img' : '') + '" id="flip-th-' + uid + '"'
    + (imgSrc ? ' onclick="event.stopPropagation();flipCard(\'flip-th-' + uid + '\')"' : '') + '>'
    + '<div class="flip-inner">'
    + '<div class="flip-face front">' + figSvg + (imgSrc ? '<span class="flip-hint">&#8635;</span>' : '') + '</div>'
    + (imgSrc ? '<div class="flip-face back"><img src="' + imgSrc + '" alt="' + s.name + '" loading="lazy" onerror="this.closest(\'.flip-wrap\').classList.remove(\'has-img\')"></div>' : '')
    + '</div></div>';

  // Expanded position column
  var expId = 'flip-ex-' + uid;
  var expHtml = '<div class="cb-sec">Position'
    + (imgSrc ? '<span class="flip-exp-btn" onclick="flipCard(\'' + expId + '\')">&#8635; photo</span>' : '')
    + '</div>'
    + '<div class="viz-flip' + (imgSrc ? '' : '') + '" id="' + expId + '"'
    + (imgSrc ? ' onclick="flipCard(\'' + expId + '\')" style="cursor:pointer"' : '') + '>'
    + '<div class="flip-inner">'
    + '<div class="flip-face front"><div class="viz-fig-inner">' + figSvg + '</div></div>'
    + (imgSrc ? '<div class="flip-face back"><img src="' + imgSrc + '" alt="' + s.name + '" loading="lazy" style="width:100%;height:100%;object-fit:cover"></div>' : '')
    + '</div></div>'
    + '<div class="viz-name">' + s.name + '</div>'
    + '<div class="viz-reps">' + s.reps + ' &middot; ' + s.sets + '</div>'
    + '<div class="viz-covers-lbl">Covers</div>'
    + '<div class="viz-covers">' + covers.map(function(m){ return '<span class="vc-tag">'+m+'</span>'; }).join('') + '</div>';

  // Timer
  var timerHtml = '';
  if (s.timer > 0) {
    timerHtml = '<div class="timer-row">'
      + '<button class="t-btn" id="tb-'+uid+'" onclick="startTimer(event,\''+uid+'\','+s.timer+')">&#9654; '+s.timer+'s</button>'
      + '<div class="t-track"><div class="t-fill '+fillClass+'" id="tf-'+uid+'"></div></div>'
      + '<div class="t-lbl" id="tl-'+uid+'">'+s.timer+'s</div></div>';
  }

  var stepsHtml = s.steps.map(function(st,j){ return '<li><span class="snum">0'+(j+1)+'</span><span>'+st+'</span></li>'; }).join('');

  var card = document.createElement('div');
  card.className = 'scard';
  card.id = 'card-' + uid;
  card.style.animationDelay = (idx * 35) + 'ms';
  card.innerHTML = '<div class="ct" onclick="toggleCard(\'' + uid + '\')">'
    + thumbHtml
    + '<div class="ct-body"><div class="ct-name">' + s.name + '</div><div class="ct-targets">' + s.targets + '</div>'
    + '<div class="ct-pills"><span class="cpill ' + pClass + '">' + phaseLabel + '</span><span class="cpill cp-n">' + s.reps + '</span>'
    + corePill + equipPill + coverPills + '</div></div>'
    + '<div class="ct-actions">'
    + '<div class="ct-toggle" onclick="event.stopPropagation();toggleCard(\'' + uid + '\')">+</div>'
    + '<div class="ct-card-actions">'
    + '<button class="btn-ca" onclick="event.stopPropagation();showAlts(\'' + s.id + '\',\'' + phase + '\',\'' + uid + '\')">Replace</button>'
    + '<button class="btn-ca btn-ca-del" onclick="event.stopPropagation();removeStretch(\'' + s.id + '\',\'' + phase + '\')">&#215;</button>'
    + '</div></div></div>'
    + '<div class="cb"><div class="cb-grid">'
    + '<div class="cb-col">' + expHtml + '</div>'
    + '<div class="cb-col"><div class="cb-sec">Instructions</div><ol class="steps-list">' + stepsHtml + '</ol>' + timerHtml + '</div>'
    + '<div class="cb-col"><div class="cb-sec">Why This Stretch</div><div class="why-body">' + (s.why||'') + '</div>'
    + '<div class="why-tip"><span class="why-tip-lbl">&#9873; Pro Tip</span>' + (s.tip||'') + '</div></div>'
    + '</div></div>';
  stack.appendChild(card);
}

function toggleCard(uid) {
  var c = document.getElementById('card-' + uid);
  if (c) c.classList.toggle('open');
}

function flipCard(id) {
  var el = document.getElementById(id);
  if (el) el.classList.toggle('flipped');
}

// ── REMOVE / REPLACE / ADD ────────────────────────────
function removeStretch(sid, phase) {
  if (!currentPlan) return;
  var key = phase === 'activation' ? 'act' : phase;
  currentPlan[key] = (currentPlan[key] || []).filter(function(s){ return s.id !== sid; });
  renderPlan(currentPlan, editingPlanId);
  showToast('Stretch removed', false);
}

function showAlts(sid, phase, uid) {
  document.querySelectorAll('.alt-drawer,.add-drawer').forEach(function(d){ d.remove(); });
  var card = document.getElementById('card-' + uid);
  if (!card) return;
  var cur = STRETCHES.filter(function(s){ return s.id === sid; })[0];
  if (!cur) return;
  var _ak = phase === 'activation' ? 'act' : phase;
  var planIds = (currentPlan[_ak]||[]).map(function(s){ return s.id; });
  var alts = STRETCHES.filter(function(s){
    if (s.id === sid || s.phase !== phase || planIds.indexOf(s.id) >= 0) return false;
    return s.muscles.filter(function(m){ return cur.muscles.indexOf(m) >= 0; }).length > 0;
  }).sort(function(a,b){
    var as = a.muscles.filter(function(m){ return cur.muscles.indexOf(m) >= 0; }).length;
    var bs = b.muscles.filter(function(m){ return cur.muscles.indexOf(m) >= 0; }).length;
    return bs - as;
  }).slice(0, 6);

  var drawer = document.createElement('div');
  drawer.className = 'alt-drawer';
  var items = alts.length ? alts.map(function(a){
    return '<div class="alt-item"><div class="alt-item-info"><div class="alt-item-name">'+a.name+'</div>'
      +'<div class="alt-item-targets">'+a.targets+'</div></div>'
      +'<button class="btn-use-alt" onclick="useAlt(\''+sid+'\',\''+a.id+'\',\''+phase+'\',\''+uid+'\')">Use This</button></div>';
  }).join('') : '<div style="color:var(--muted);font-size:12px;padding:8px 0">No alternatives found.</div>';

  drawer.innerHTML = '<div class="drawer-head"><div class="drawer-title">Alternatives for: ' + cur.name + '</div>'
    + '<button class="btn-close-drawer" onclick="this.closest(\'.alt-drawer\').remove()">&#215;</button></div>'
    + '<div class="alt-list">' + items + '</div>';
  card.appendChild(drawer);
  drawer.scrollIntoView({behavior:'smooth',block:'nearest'});
}

function useAlt(oldId, newId, phase, uid) {
  var s = STRETCHES.filter(function(x){ return x.id === newId; })[0];
  if (!s || !currentPlan) return;
  var _key = phase === 'activation' ? 'act' : phase;
  var idx = (currentPlan[_key]||[]).findIndex(function(x){ return x.id === oldId; });
  if (idx < 0) return;
  var e = obj(s);
  e.covers = currentPlan.muscles.filter(function(m){ return s.muscles.indexOf(m) >= 0; });
  if (!e.covers.length) e.covers = s.muscles;
  currentPlan[_key][idx] = e;
  renderPlan(currentPlan, editingPlanId);
  showToast('Stretch replaced', false);
}

function openAddDrawer(phase) {
  document.querySelectorAll('.alt-drawer,.add-drawer').forEach(function(d){ d.remove(); });
  var stackEl = document.getElementById(phase + '-stack');
  if (!stackEl) return;
  var drawer = document.createElement('div');
  drawer.className = 'add-drawer';
  drawer.id = 'add-drawer-' + phase;
  drawer.innerHTML = '<div class="drawer-head"><div class="drawer-title">Add ' + (phase === 'pre' ? 'Pre' : 'Post') + '-Workout Stretch</div>'
    + '<button class="btn-close-drawer" onclick="this.closest(\'.add-drawer\').remove()">&#215;</button></div>'
    + '<input class="add-search" id="add-search-' + phase + '" type="text" placeholder="Search by name or muscle..." oninput="filterAddList(\'' + phase + '\')">'
    + '<div class="add-list" id="add-list-' + phase + '">' + buildAddItems(phase, '') + '</div>';
  stackEl.parentElement.appendChild(drawer);
  drawer.scrollIntoView({behavior:'smooth',block:'nearest'});
  document.getElementById('add-search-' + phase).focus();
}

function buildAddItems(phase, q) {
  var _phaseKey = phase === 'activation' ? 'act' : phase;
  var planIds = currentPlan ? (currentPlan[_phaseKey]||[]).map(function(s){ return s.id; }) : [];
  var list = STRETCHES.filter(function(s){
    if (s.phase !== phase) return false;
    if (q && s.name.toLowerCase().indexOf(q) < 0 && s.muscles.join(' ').indexOf(q) < 0) return false;
    return true;
  });
  if (!list.length) return '<div style="color:var(--muted);font-size:12px;padding:8px">No stretches found.</div>';
  return list.map(function(s){
    var inPlan = planIds.indexOf(s.id) >= 0;
    return '<div class="add-item"><div><div class="add-item-name">'+s.name+'</div>'
      +'<div class="add-item-muscle">'+s.muscles.slice(0,3).join(' · ')+'</div></div>'
      +'<button class="btn-add-item"'+(inPlan?' disabled':' onclick="addToPlan(\''+s.id+'\',\''+phase+'\')"')+'>'+(inPlan?'Added':'+ Add')+'</button></div>';
  }).join('');
}

function filterAddList(phase) {
  var q = document.getElementById('add-search-' + phase).value.toLowerCase();
  document.getElementById('add-list-' + phase).innerHTML = buildAddItems(phase, q);
}

function addToPlan(sid, phase) {
  var s = STRETCHES.filter(function(x){ return x.id === sid; })[0];
  if (!s || !currentPlan) return;
  var key = phase === 'activation' ? 'act' : phase;
  if (!currentPlan[key]) currentPlan[key] = [];
  var e = obj(s);
  e.covers = currentPlan.muscles.filter(function(m){ return s.muscles.indexOf(m) >= 0; });
  if (!e.covers.length) e.covers = s.muscles;
  currentPlan[key].push(e);
  document.querySelectorAll('.add-drawer').forEach(function(d){ d.remove(); });
  renderPlan(currentPlan, editingPlanId);
  showToast('Stretch added', false);
}

// ── SAVE PLAN ─────────────────────────────────────────
function openSaveModal() {
  if (!currentPlan) return;
  var input = document.getElementById('plan-name-input');
  if (editingPlanId) {
    var p = getPlans().filter(function(x){ return x.id === editingPlanId; })[0];
    input.value = p ? p.name : '';
  } else { input.value = ''; }
  document.getElementById('save-modal').classList.add('on');
  setTimeout(function(){ input.focus(); }, 80);
}
function closeModal() { document.getElementById('save-modal').classList.remove('on'); }
document.addEventListener('keydown', function(e){
  if (e.key === 'Escape') closeModal();
  if (e.key === 'Enter' && document.getElementById('save-modal').classList.contains('on')) confirmSavePlan();
});
function confirmSavePlan() {
  var name = document.getElementById('plan-name-input').value.trim();
  if (!name) { document.getElementById('plan-name-input').style.borderColor = 'var(--a2)'; setTimeout(function(){ document.getElementById('plan-name-input').style.borderColor=''; },1200); return; }
  var plans = getPlans();
  var pid = editingPlanId || ('plan-' + Date.now());
  var planData = {
    id: pid, name: name, updated: Date.now(),
    created: editingPlanId ? ((plans.filter(function(p){ return p.id===editingPlanId; })[0]||{}).created||Date.now()) : Date.now(),
    muscles: currentPlan.muscles, depth: currentPlan.depth,
    act: (currentPlan.act||[]).map(function(s){ return s.id; }),
    pre: currentPlan.pre.map(function(s){ return s.id; }),
    post: currentPlan.post.map(function(s){ return s.id; }),
  };
  if (editingPlanId) {
    var idx = plans.findIndex(function(p){ return p.id === editingPlanId; });
    if (idx >= 0) { plans[idx] = planData; } else { plans.push(planData); }
  } else { plans.push(planData); }
  setPlans(plans); editingPlanId = pid;
  updatePlansBadge(); closeModal(); showToast('Plan saved: ' + name, true);
}

// ── SAVED PLANS ───────────────────────────────────────
function getPlans() { try { return JSON.parse(localStorage.getItem('ff_plans')||'[]'); } catch(e){ return []; } }
function setPlans(p) { localStorage.setItem('ff_plans', JSON.stringify(p)); }
function updatePlansBadge() {
  var n = getPlans().length;
  var b = document.getElementById('plans-badge');
  b.textContent = n; b.style.display = n ? '' : 'none';
}
function renderSavedPlans() {
  var plans = getPlans();
  var c = document.getElementById('plans-container');
  if (!plans.length) { c.innerHTML = '<div class="plans-empty"><div class="plans-empty-icon">&#9741;</div><div class="plans-empty-text">No saved plans yet. Generate a plan and save it.</div></div>'; return; }
  var allM = MG.flatMap(function(g){ return g.muscles; });
  var html = '<div class="plans-grid">';
  plans.slice().reverse().forEach(function(plan) {
    var labels = plan.muscles.map(function(id){ var f=allM.filter(function(m){ return m.id===id; })[0]; return f?f.label:id; });
    var date = new Date(plan.updated||plan.created).toLocaleDateString('en-US',{month:'short',day:'numeric',year:'numeric'});
    var total = (plan.pre||[]).length + (plan.post||[]).length;
    var pills = labels.slice(0,6).map(function(l){ return '<span class="plan-card-muscle">'+l+'</span>'; }).join('');
    if (labels.length > 6) pills += '<span class="plan-card-muscle">+' + (labels.length-6) + '</span>';
    html += '<div class="plan-card"><div class="plan-card-name">'+plan.name+'</div>'
      +'<div class="plan-card-meta">'+total+' stretches &middot; '+plan.depth+' &middot; '+date+'</div>'
      +'<div class="plan-card-muscles">'+pills+'</div>'
      +'<div class="plan-card-actions">'
      +'<button class="btn-plan-del" onclick="deletePlan(\''+plan.id+'\')">Delete</button>'
      +'<button class="btn-plan-run" onclick="loadPlan(\''+plan.id+'\')">Open</button>'
      +'</div></div>';
  });
  html += '</div>'; c.innerHTML = html;
}
function loadPlan(pid) {
  var plan = getPlans().filter(function(p){ return p.id === pid; })[0];
  if (!plan) return;
  var resolve = function(ids) {
    return ids.map(function(id){ return STRETCHES.filter(function(s){ return s.id===id; })[0]; })
      .filter(Boolean).map(function(s){
        var e = obj(s);
        e.covers = plan.muscles.filter(function(m){ return s.muscles.indexOf(m)>=0; });
        if (!e.covers.length) e.covers = s.muscles;
        return e;
      });
  };
  currentPlan = {muscles:plan.muscles, depth:plan.depth, act:resolve(plan.act||[]), pre:resolve(plan.pre||[]), post:resolve(plan.post||[])};
  editingPlanId = pid;
  selected.clear(); plan.muscles.forEach(function(id){ selected.add(id); });
  setDepth(plan.depth); clearPresetHL(); renderMuscleList(activeTab); updateFooter();
  showView('planner'); renderPlan(currentPlan, pid);
}
function deletePlan(pid) {
  setPlans(getPlans().filter(function(p){ return p.id !== pid; }));
  updatePlansBadge(); renderSavedPlans(); showToast('Plan deleted', false);
}

// ── TIMERS ────────────────────────────────────────────
function startTimer(e, uid, dur) {
  e.stopPropagation();
  if (timers[uid]) { clearInterval(timers[uid]); delete timers[uid]; }
  var btn=document.getElementById('tb-'+uid), bar=document.getElementById('tf-'+uid), lbl=document.getElementById('tl-'+uid);
  var elapsed = 0;
  bar.style.width='0%'; lbl.textContent=dur+'s'; btn.innerHTML='&#9646;&#9646;'; btn.disabled=true;
  timers[uid] = setInterval(function(){
    elapsed++; bar.style.width=(elapsed/dur*100)+'%'; lbl.textContent=(dur-elapsed)+'s';
    if (elapsed>=dur){ clearInterval(timers[uid]); delete timers[uid]; lbl.textContent='&#10003;'; btn.innerHTML='&#8635;'; btn.disabled=false; }
  },1000);
}

// ── LIBRARY ───────────────────────────────────────────
function buildLibrary() {
  var fe = document.getElementById('lib-filters');
  var allMids = [];
  STRETCHES.forEach(function(s){ s.muscles.forEach(function(m){ if(allMids.indexOf(m)<0) allMids.push(m); }); });
  allMids.sort();
  [{id:'all',label:'All'},{id:'pre',label:'Pre-Workout'},{id:'post',label:'Post-Workout'}]
    .concat(allMids.map(function(m){ return {id:'m-'+m,label:m}; }))
    .forEach(function(f){
      var btn = document.createElement('div');
      btn.className = 'lf' + (f.id==='all'?' on':'');
      btn.textContent = f.label;
      btn.onclick = function(){
        document.querySelectorAll('.lf').forEach(function(x){ x.classList.remove('on'); });
        btn.classList.add('on'); renderLib(f.id);
      };
      fe.appendChild(btn);
    });
  renderLib('all');
}
function renderLib(fid) {
  var ge = document.getElementById('lib-grid');
  ge.innerHTML = '';
  var list = fid==='pre' ? STRETCHES.filter(function(s){ return s.phase==='pre'; })
    : fid==='post' ? STRETCHES.filter(function(s){ return s.phase==='post'; })
    : fid.indexOf('m-')===0 ? STRETCHES.filter(function(s){ return s.muscles.indexOf(fid.slice(2))>=0; })
    : STRETCHES;
  list.forEach(function(s,i){
    var w = document.createElement('div'); ge.appendChild(w);
    renderLibCard(s, i, w);
  });
}
function renderLibCard(s, idx, parent) {
  var uid = 'lib-' + s.id + '-' + idx;
  var pClass = s.phase==='pre'?'cp-pre':s.phase==='activation'?'cp-act':'cp-post';
  var phaseLabel = s.phase==='pre'?'Dynamic':s.phase==='activation'?'Warm-Up':'Static';
  var fillClass = s.phase==='pre'?'tf-pre':s.phase==='activation'?'tf-act':'tf-post';
  var imgSrc = IMAGE_STRETCHES[s.id] || null;
  var figSvg = getFig(s.fig || '');
  var coverPills = s.muscles.map(function(m){ return '<span class="cpill cp-cov">'+m+'</span>'; }).join('');
  var expId = 'flip-ex-' + uid;
  var expHtml = '<div class="cb-sec">Position'
    + (imgSrc ? '<span class="flip-exp-btn" onclick="flipCard(\''+expId+'\')">&#8635; photo</span>' : '') + '</div>'
    + '<div class="viz-flip" id="'+expId+'"' + (imgSrc?' onclick="flipCard(\''+expId+'\')" style="cursor:pointer"':'') + '>'
    + '<div class="flip-inner">'
    + '<div class="flip-face front"><div class="viz-fig-inner">'+figSvg+'</div></div>'
    + (imgSrc?'<div class="flip-face back"><img src="'+imgSrc+'" style="width:100%;height:100%;object-fit:cover" loading="lazy"></div>':'')
    + '</div></div>'
    + '<div class="viz-name">'+s.name+'</div>'
    + '<div class="viz-reps">'+s.reps+' &middot; '+s.sets+'</div>';

  var timerHtml = '';
  if (s.timer>0) timerHtml='<div class="timer-row"><button class="t-btn" id="tb-'+uid+'" onclick="startTimer(event,\''+uid+'\','+s.timer+')">&#9654; '+s.timer+'s</button><div class="t-track"><div class="t-fill '+fillClass+'" id="tf-'+uid+'"></div></div><div class="t-lbl" id="tl-'+uid+'">'+s.timer+'s</div></div>';
  var stepsHtml = s.steps.map(function(st,j){ return '<li><span class="snum">0'+(j+1)+'</span><span>'+st+'</span></li>'; }).join('');
  var thumbHtml = '<div class="flip-wrap' + (imgSrc?' has-img':'') + '" id="flip-th-'+uid+'"' + (imgSrc?' onclick="event.stopPropagation();flipCard(\'flip-th-'+uid+'\')"':'') + '>'
    + '<div class="flip-inner"><div class="flip-face front">'+figSvg+(imgSrc?'<span class="flip-hint">&#8635;</span>':'')+'</div>'
    + (imgSrc?'<div class="flip-face back"><img src="'+imgSrc+'" loading="lazy" onerror="this.closest(\'.flip-wrap\').classList.remove(\'has-img\')"></div>':'')
    + '</div></div>';

  var card = document.createElement('div');
  card.className = 'scard'; card.id = 'card-'+uid;
  card.innerHTML = '<div class="ct" onclick="toggleCard(\''+uid+'\')">'+thumbHtml
    +'<div class="ct-body"><div class="ct-name">'+s.name+'</div><div class="ct-targets">'+s.targets+'</div>'
    +'<div class="ct-pills"><span class="cpill '+pClass+'">'+phaseLabel+'</span><span class="cpill cp-n">'+s.reps+'</span>'
    +coverPills+'</div></div>'
    +'<div class="ct-actions"><div class="ct-toggle">+</div></div></div>'
    +'<div class="cb"><div class="cb-grid">'
    +'<div class="cb-col">'+expHtml+'</div>'
    +'<div class="cb-col"><div class="cb-sec">Instructions</div><ol class="steps-list">'+stepsHtml+'</ol>'+timerHtml+'</div>'
    +'<div class="cb-col"><div class="cb-sec">Why This Stretch</div><div class="why-body">'+(s.why||'')+'</div>'
    +'<div class="why-tip"><span class="why-tip-lbl">&#9873; Pro Tip</span>'+(s.tip||'')+'</div></div>'
    +'</div></div>';
  parent.appendChild(card);
}

// ── TOAST ─────────────────────────────────────────────
var _tt = null;
function showToast(msg, ok) {
  var el = document.getElementById('toast');
  el.textContent = msg; el.className = 'toast on' + (ok?' ok':'');
  if (_tt) clearTimeout(_tt);
  _tt = setTimeout(function(){ el.className='toast'; }, 2400);
}

// ── SVG FIGURE SYSTEM ─────────────────────────────────
// All functions defined here, in order: makeFig → hl → pose → FIGS → getFig

var _figCache = {};
var _figCtr = 0;

function makeFig(phase, hlFn, poseFn) {
  var c = phase === 'pre' ? '#b8ff57' : '#57d4ff';
  var d = phase === 'pre' ? 'rgba(184,255,87,' : 'rgba(87,212,255,';
  var fid = 'ff' + (++_figCtr);
  var h = hlFn ? hlFn(c, d, fid) : '';
  var p = poseFn ? poseFn(c) : '';
  return '<svg viewBox="0 0 100 170" xmlns="http://www.w3.org/2000/svg">'
    + '<defs><filter id="'+fid+'"><feGaussianBlur stdDeviation="1.8" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter></defs>'
    + '<ellipse cx="50" cy="17" rx="10" ry="11" fill="'+d+'.1)" stroke="'+c+'" stroke-width="1.2"/>'
    + '<rect x="46" y="27" width="8" height="6" rx="2" fill="'+d+'.1)" stroke="'+c+'" stroke-width=".9"/>'
    + '<path d="M32 35 Q30 58 33 78 L67 78 Q70 58 68 35 Q59 31 50 31 Q41 31 32 35Z" fill="'+d+'.06)" stroke="'+c+'" stroke-width="1.2"/>'
    + '<path d="M32 37 Q20 46 18 64" fill="none" stroke="'+c+'" stroke-width="3.5" stroke-linecap="round" opacity=".4"/>'
    + '<path d="M68 37 Q80 46 82 64" fill="none" stroke="'+c+'" stroke-width="3.5" stroke-linecap="round" opacity=".4"/>'
    + '<path d="M18 64 Q14 78 16 88" fill="none" stroke="'+c+'" stroke-width="2.5" stroke-linecap="round" opacity=".35"/>'
    + '<path d="M82 64 Q86 78 84 88" fill="none" stroke="'+c+'" stroke-width="2.5" stroke-linecap="round" opacity=".35"/>'
    + '<path d="M37 78 Q34 102 36 118" fill="none" stroke="'+c+'" stroke-width="5.5" stroke-linecap="round" opacity=".4"/>'
    + '<path d="M63 78 Q66 102 64 118" fill="none" stroke="'+c+'" stroke-width="5.5" stroke-linecap="round" opacity=".4"/>'
    + '<path d="M36 118 Q35 136 37 150" fill="none" stroke="'+c+'" stroke-width="3.5" stroke-linecap="round" opacity=".35"/>'
    + '<path d="M64 118 Q65 136 63 150" fill="none" stroke="'+c+'" stroke-width="3.5" stroke-linecap="round" opacity=".35"/>'
    + '<path d="M35 150 Q28 153 24 152 Q22 155 36 155" fill="'+d+'.12)" stroke="'+c+'" stroke-width=".9"/>'
    + '<path d="M65 150 Q72 153 76 152 Q78 155 64 155" fill="'+d+'.12)" stroke="'+c+'" stroke-width=".9"/>'
    + h + p + '</svg>';
}

function hl(sel, c, d, f) {
  var Z = {
    chest:     '<path d="M34 36 Q50 33 66 36 Q68 50 50 54 Q32 50 34 36Z" fill="'+d+'.45)" stroke="'+c+'" stroke-width="1.3" filter="url(#'+f+')"/>',
    shoulders: '<ellipse cx="29" cy="38" rx="10" ry="9" fill="'+d+'.5)" stroke="'+c+'" stroke-width="1.3" filter="url(#'+f+')"/><ellipse cx="71" cy="38" rx="10" ry="9" fill="'+d+'.5)" stroke="'+c+'" stroke-width="1.3" filter="url(#'+f+')"/>',
    traps:     '<path d="M40 29 Q50 25 60 29 Q64 35 50 37 Q36 35 40 29Z" fill="'+d+'.55)" stroke="'+c+'" stroke-width="1.3" filter="url(#'+f+')"/>',
    uback:     '<path d="M34 36 Q50 33 66 36 L65 60 Q50 58 35 60Z" fill="'+d+'.4)" stroke="'+c+'" stroke-width="1.2" filter="url(#'+f+')"/>',
    lback:     '<path d="M36 60 Q50 57 64 60 L65 78 Q50 76 35 78Z" fill="'+d+'.45)" stroke="'+c+'" stroke-width="1.2" filter="url(#'+f+')"/>',
    biceps:    '<path d="M20 40 Q16 52 18 64" fill="none" stroke="'+c+'" stroke-width="7" stroke-linecap="round" filter="url(#'+f+')"/>',
    triceps:   '<path d="M33 38 Q22 48 18 64" fill="none" stroke="'+c+'" stroke-width="6" stroke-linecap="round" filter="url(#'+f+')"/>',
    forearms:  '<path d="M16 64 Q13 76 15 88" fill="none" stroke="'+c+'" stroke-width="6" stroke-linecap="round" filter="url(#'+f+')"/>',
    abs:       '<path d="M36 50 Q50 47 64 50 L63 78 Q50 76 37 78Z" fill="'+d+'.45)" stroke="'+c+'" stroke-width="1.2" filter="url(#'+f+')"/>',
    hipflex:   '<path d="M38 74 Q50 70 62 74 L61 90 Q50 88 39 90Z" fill="'+d+'.5)" stroke="'+c+'" stroke-width="1.3" filter="url(#'+f+')"/>',
    glutes:    '<path d="M35 78 Q50 82 65 78 L64 96 Q50 100 36 96Z" fill="'+d+'.5)" stroke="'+c+'" stroke-width="1.3" filter="url(#'+f+')"/>',
    quads:     '<path d="M37 96 Q34 108 36 118" fill="none" stroke="'+c+'" stroke-width="8" stroke-linecap="round" filter="url(#'+f+')" opacity=".9"/><path d="M63 96 Q66 108 64 118" fill="none" stroke="'+c+'" stroke-width="8" stroke-linecap="round" filter="url(#'+f+')" opacity=".5"/>',
    hams:      '<path d="M40 80 Q37 100 36 118" fill="none" stroke="'+c+'" stroke-width="5" stroke-linecap="round" filter="url(#'+f+')"/><path d="M60 80 Q63 100 64 118" fill="none" stroke="'+c+'" stroke-width="5" stroke-linecap="round" filter="url(#'+f+')" opacity=".5"/>',
    calves:    '<path d="M36 118 Q35 132 37 150" fill="none" stroke="'+c+'" stroke-width="7" stroke-linecap="round" filter="url(#'+f+')"/><path d="M64 118 Q65 132 63 150" fill="none" stroke="'+c+'" stroke-width="7" stroke-linecap="round" filter="url(#'+f+')" opacity=".5"/>',
    shins:     '<path d="M38 118 Q36 130 37 150" fill="none" stroke="'+c+'" stroke-width="4" stroke-linecap="round" filter="url(#'+f+')"/>',
    adductors: '<path d="M44 82 Q50 78 56 82 L54 118 Q50 116 46 118Z" fill="'+d+'.5)" stroke="'+c+'" stroke-width="1.2" filter="url(#'+f+')"/>',
    abductors: '<ellipse cx="34" cy="88" rx="9" ry="12" fill="'+d+'.4)" stroke="'+c+'" stroke-width="1.3" filter="url(#'+f+')"/>',
    spine:     '<path d="M48 29 Q46 52 47 78 L53 78 Q54 52 52 29Z" fill="'+d+'.55)" stroke="'+c+'" stroke-width="1" filter="url(#'+f+')"/>',
    neck:      '<rect x="44" y="26" width="12" height="8" rx="3" fill="'+d+'.7)" stroke="'+c+'" stroke-width="1.5" filter="url(#'+f+')"/>',
  };
  return sel.split(',').map(function(p){ return Z[p.trim()]||''; }).join('');
}

function pose(type, c) {
  var P = {
    arcarms:  '<path d="M18 64 Q4 42 16 22 Q26 8 34 22" fill="none" stroke="'+c+'" stroke-width="1.8" stroke-dasharray="4 3" opacity=".8"/><circle cx="34" cy="22" r="3" fill="'+c+'"/><path d="M82 64 Q96 42 84 22 Q74 8 66 22" fill="none" stroke="'+c+'" stroke-width="1.8" stroke-dasharray="4 3" opacity=".8"/><circle cx="66" cy="22" r="3" fill="'+c+'"/>',
    swing:    '<path d="M63 96 Q76 80 74 62" fill="none" stroke="'+c+'" stroke-width="2" stroke-dasharray="4 3" opacity=".9"/><circle cx="74" cy="62" r="3" fill="'+c+'"/>',
    hiparc:   '<ellipse cx="50" cy="84" rx="26" ry="14" fill="none" stroke="'+c+'" stroke-width="1.8" stroke-dasharray="5 3" opacity=".8"/>',
    wallr:    '<rect x="93" y="20" width="5" height="130" rx="2" fill="rgba(255,255,255,.06)" stroke="'+c+'" stroke-width=".8"/>',
    walll:    '<rect x="2" y="20" width="5" height="130" rx="2" fill="rgba(255,255,255,.06)" stroke="'+c+'" stroke-width=".8"/>',
    twist:    '<path d="M66 38 Q80 32 82 42" fill="none" stroke="'+c+'" stroke-width="2" stroke-dasharray="3 3" opacity=".9"/><circle cx="80" cy="38" r="3" fill="'+c+'"/>',
    overhead: '<path d="M32 37 Q26 24 32 16 Q38 10 46 20" fill="none" stroke="'+c+'" stroke-width="2" stroke-dasharray="3 3" opacity=".9"/><circle cx="46" cy="20" r="3" fill="'+c+'"/>',
  };
  return P[type] || '';
}

var FIGS = {
  armCircle:     function(){ return makeFig('pre',  function(c,d,f){ return hl('chest,shoulders,biceps,triceps',c,d,f); }, function(c){ return pose('arcarms',c); }); },
  shoulderRoll:  function(){ return makeFig('pre',  function(c,d,f){ return hl('traps,shoulders',c,d,f); }, function(c){ return '<path d="M20 36 Q14 26 22 20 Q30 16 34 24" fill="none" stroke="'+c+'" stroke-width="1.8" stroke-dasharray="3 3" opacity=".9"/><circle cx="34" cy="24" r="3" fill="'+c+'"/>'; }); },
  neckRoll:      function(){ return makeFig('pre',  function(c,d,f){ return hl('neck,traps',c,d,f); }, function(c){ return '<path d="M44 14 Q30 12 28 20 Q28 28 38 26" fill="none" stroke="'+c+'" stroke-width="1.8" stroke-dasharray="3 3" opacity=".9"/>'; }); },
  torsoTwist:    function(){ return makeFig('pre',  function(c,d,f){ return hl('abs,uback,lback,chest,traps',c,d,f); }, function(c){ return pose('twist',c); }); },
  catCow:        function(){ return makeFig('pre',  function(c,d,f){ return hl('spine,abs,hipflex,glutes',c,d,f); }, function(c){ return '<path d="M30 60 Q50 50 70 60" fill="none" stroke="'+c+'" stroke-width="2" stroke-dasharray="3 2" opacity=".9"/>'; }); },
  legSwing:      function(){ return makeFig('pre',  function(c,d,f){ return hl('hipflex,hams,glutes',c,d,f); }, function(c){ return pose('swing',c); }); },
  hipCircle:     function(){ return makeFig('pre',  function(c,d,f){ return hl('glutes,adductors,abductors,hipflex',c,d,f); }, function(c){ return pose('hiparc',c); }); },
  lunge:         function(){ return makeFig('pre',  function(c,d,f){ return hl('quads,glutes,hams,hipflex',c,d,f); }, null); },
  inchworm:      function(){ return makeFig('pre',  function(c,d,f){ return hl('hams,uback,shoulders,calves',c,d,f); }, null); },
  ankleCircle:   function(){ return makeFig('pre',  function(c,d,f){ return hl('calves,shins',c,d,f); }, function(c){ return '<ellipse cx="37" cy="152" rx="8" ry="6" fill="none" stroke="'+c+'" stroke-width="1.8" stroke-dasharray="4 3" opacity=".9"/>'; }); },
  sideStep:      function(){ return makeFig('pre',  function(c,d,f){ return hl('adductors,abductors,glutes,quads',c,d,f); }, null); },
  wristCircle:   function(){ return makeFig('pre',  function(c,d,f){ return hl('forearms,biceps',c,d,f); }, function(c){ return '<ellipse cx="15" cy="88" rx="6" ry="5" fill="none" stroke="'+c+'" stroke-width="1.8" stroke-dasharray="3 3" opacity=".9"/>'; }); },
  spiderStretch: function(){ return makeFig('pre',  function(c,d,f){ return hl('hipflex,adductors,uback',c,d,f); }, null); },
  tibialisWalk:  function(){ return makeFig('pre',  function(c,d,f){ return hl('shins',c,d,f); }, null); },
  tricepOverhead:function(){ return makeFig('pre',  function(c,d,f){ return hl('triceps,uback,shoulders',c,d,f); }, function(c){ return pose('overhead',c); }); },
  wristPumps:    function(){ return makeFig('pre',  function(c,d,f){ return hl('forearms,biceps',c,d,f); }, null); },
  neckNods:      function(){ return makeFig('pre',  function(c,d,f){ return hl('neck,traps',c,d,f); }, null); },
  chestDoor:     function(){ return makeFig('post', function(c,d,f){ return hl('chest,shoulders,biceps',c,d,f); }, function(c){ return pose('walll',c); }); },
  crossShoulder: function(){ return makeFig('post', function(c,d,f){ return hl('shoulders,traps',c,d,f); }, function(c){ return '<path d="M32 38 Q50 42 68 36" fill="none" stroke="'+c+'" stroke-width="5" stroke-linecap="round" opacity=".7"/>'; }); },
  tricepOH:      function(){ return makeFig('post', function(c,d,f){ return hl('triceps,uback',c,d,f); }, function(c){ return pose('overhead',c); }); },
  bicepWall:     function(){ return makeFig('post', function(c,d,f){ return hl('biceps,shoulders',c,d,f); }, function(c){ return pose('wallr',c); }); },
  trapNeck:      function(){ return makeFig('post', function(c,d,f){ return hl('traps,neck',c,d,f); }, function(c){ return '<path d="M44 14 Q32 10 30 20 Q30 28 40 28" fill="none" stroke="'+c+'" stroke-width="2" stroke-dasharray="3 3" opacity=".9"/><circle cx="31" cy="21" r="3" fill="'+c+'"/>'; }); },
  childPose:     function(){ return makeFig('post', function(c,d,f){ return hl('uback,lback,spine,glutes,shoulders',c,d,f); }, null); },
  latHang:       function(){ return makeFig('post', function(c,d,f){ return hl('uback,lback,shoulders',c,d,f); }, function(c){ return pose('overhead',c); }); },
  hamstringStand:function(){ return makeFig('post', function(c,d,f){ return hl('hams,glutes',c,d,f); }, null); },
  quadStand:     function(){ return makeFig('post', function(c,d,f){ return hl('quads,hipflex',c,d,f); }, function(c){ return '<path d="M64 118 Q76 108 72 90 Q70 80 64 84" fill="none" stroke="'+c+'" stroke-width="2" stroke-dasharray="3 3" opacity=".8"/><circle cx="64" cy="84" r="3" fill="'+c+'"/>'; }); },
  hipFlexKneel:  function(){ return makeFig('post', function(c,d,f){ return hl('hipflex,quads,glutes',c,d,f); }, null); },
  piriformis:    function(){ return makeFig('post', function(c,d,f){ return hl('glutes,adductors,abductors',c,d,f); }, null); },
  calfWall:      function(){ return makeFig('post', function(c,d,f){ return hl('calves',c,d,f); }, function(c){ return pose('wallr',c); }); },
  adductorSumo:  function(){ return makeFig('post', function(c,d,f){ return hl('adductors,glutes',c,d,f); }, null); },
  cobraAbs:      function(){ return makeFig('post', function(c,d,f){ return hl('abs,hipflex',c,d,f); }, null); },
  forearmStr:    function(){ return makeFig('post', function(c,d,f){ return hl('forearms',c,d,f); }, null); },
  tibKneel:      function(){ return makeFig('post', function(c,d,f){ return hl('shins',c,d,f); }, null); },
  itBand:        function(){ return makeFig('post', function(c,d,f){ return hl('abductors',c,d,f); }, null); },
  thoracicExt:   function(){ return makeFig('post', function(c,d,f){ return hl('uback,lback,spine',c,d,f); }, null); },
  spinalTwist:   function(){ return makeFig('post', function(c,d,f){ return hl('uback,lback,abs',c,d,f); }, function(c){ return pose('twist',c); }); },
  rhomboidDoor:  function(){ return makeFig('post', function(c,d,f){ return hl('uback,shoulders',c,d,f); }, null); },
  qlStretch:     function(){ return makeFig('post', function(c,d,f){ return hl('lback,spine',c,d,f); }, null); },
  wallTricep:    function(){ return makeFig('post', function(c,d,f){ return hl('triceps',c,d,f); }, function(c){ return pose('wallr',c); }); },
  behindTricep:  function(){ return makeFig('post', function(c,d,f){ return hl('triceps',c,d,f); }, null); },
  crossTricep:   function(){ return makeFig('post', function(c,d,f){ return hl('triceps,shoulders',c,d,f); }, function(c){ return '<path d="M68 40 Q54 46 50 40" fill="none" stroke="'+c+'" stroke-width="4" stroke-linecap="round" opacity=".8"/>'; }); },
  upperPec:      function(){ return makeFig('post', function(c,d,f){ return hl('chest,shoulders',c,d,f); }, function(c){ return pose('walll',c); }); },
  pecMinor:      function(){ return makeFig('post', function(c,d,f){ return hl('chest',c,d,f); }, null); },
  prayerStr:     function(){ return makeFig('post', function(c,d,f){ return hl('forearms',c,d,f); }, null); },
  supinationStr: function(){ return makeFig('post', function(c,d,f){ return hl('forearms,biceps',c,d,f); }, null); },
  chinTuck:      function(){ return makeFig('post', function(c,d,f){ return hl('neck,traps',c,d,f); }, null); },
  neckFlex:      function(){ return makeFig('post', function(c,d,f){ return hl('neck',c,d,f); }, function(c){ return '<path d="M44 14 Q50 6 56 10" fill="none" stroke="'+c+'" stroke-width="2" stroke-dasharray="3 3" opacity=".9"/><circle cx="50" cy="8" r="3" fill="'+c+'"/>'; }); },
  scmStr:        function(){ return makeFig('post', function(c,d,f){ return hl('neck',c,d,f); }, function(c){ return '<path d="M42 27 Q34 20 36 14" fill="none" stroke="'+c+'" stroke-width="2.5" stroke-dasharray="3 2" opacity=".9"/>'; }); },
  seatedHam:     function(){ return makeFig('post', function(c,d,f){ return hl('hams,glutes',c,d,f); }, null); },
  lyingHam:      function(){ return makeFig('post', function(c,d,f){ return hl('hams,glutes',c,d,f); }, null); },
  pigeonPose:    function(){ return makeFig('post', function(c,d,f){ return hl('abductors,glutes,adductors',c,d,f); }, null); },
  sideLyingAbd:  function(){ return makeFig('post', function(c,d,f){ return hl('abductors',c,d,f); }, null); },
  downDog:       function(){ return makeFig('post', function(c,d,f){ return hl('calves,hams',c,d,f); }, function(c){ return '<path d="M47 30 Q44 10 48 2" fill="none" stroke="'+c+'" stroke-width="2" stroke-dasharray="3 3" opacity=".8"/><circle cx="48" cy="2" r="3" fill="'+c+'"/>'; }); },
  soleus:        function(){ return makeFig('post', function(c,d,f){ return hl('calves',c,d,f); }, null); },
  toeExt:        function(){ return makeFig('post', function(c,d,f){ return hl('shins',c,d,f); }, null); },
  dorsiflex:     function(){ return makeFig('post', function(c,d,f){ return hl('shins,calves',c,d,f); }, function(c){ return pose('wallr',c); }); },
};

function getFig(key) {
  if (!key) return '';
  if (_figCache[key]) return _figCache[key];
  var fn = FIGS[key];
  var result = fn ? fn() : '';
  _figCache[key] = result;
  return result;
}


// ── THEME ─────────────────────────────────────────────
function toggleTheme() {
  var isLight = document.body.classList.toggle('light');
  localStorage.setItem('ff_theme', isLight ? 'light' : 'dark');
  syncThemeIcons(isLight);
}

function syncThemeIcons(isLight) {
  var icon = isLight ? '&#9788;' : '&#9790;';
  var topBtn = document.getElementById('theme-btn');
  if (topBtn) topBtn.innerHTML = icon;
  var bnavIcon = document.getElementById('bnav-theme-icon');
  if (bnavIcon) bnavIcon.innerHTML = icon;
}

function applyTheme() {
  var saved = localStorage.getItem('ff_theme');
  if (!saved && window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches) {
    saved = 'light';
  }
  if (saved === 'light') {
    document.body.classList.add('light');
    syncThemeIcons(true);
  }
}

// ── EXPORT PLANS ──────────────────────────────────────
function exportPlans() {
  var plans = getPlans();
  if (!plans.length) { showToast('No plans to export', false); return; }
  var payload = JSON.stringify({ version: 1, exported: new Date().toISOString(), plans: plans }, null, 2);
  var blob = new Blob([payload], { type: 'application/json' });
  var url = URL.createObjectURL(blob);
  var a = document.createElement('a');
  a.href = url;
  a.download = 'flexflow-plans-' + new Date().toISOString().slice(0,10) + '.json';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
  showToast('Plans exported', true);
}

// ── IMPORT PLANS ──────────────────────────────────────
function importPlans(input) {
  var file = input.files[0];
  if (!file) return;
  var reader = new FileReader();
  reader.onload = function(e) {
    try {
      var data = JSON.parse(e.target.result);
      // Support both direct array and wrapped { plans: [] } format
      var incoming = Array.isArray(data) ? data : (data.plans || []);
      if (!incoming.length) { showToast('No plans found in file', false); return; }
      var existing = getPlans();
      var existingIds = existing.map(function(p){ return p.id; });
      var added = 0; var skipped = 0;
      incoming.forEach(function(plan) {
        if (!plan.id || !plan.name || !plan.muscles) { skipped++; return; }
        if (existingIds.indexOf(plan.id) >= 0) {
          // Duplicate ID — give it a new ID to avoid collision
          plan.id = 'plan-' + Date.now() + '-' + Math.floor(Math.random()*9999);
        }
        existing.push(plan); added++;
      });
      setPlans(existing);
      updatePlansBadge();
      renderSavedPlans();
      showToast('Imported ' + added + ' plan' + (added !== 1 ? 's' : ''), true);
      if (skipped) showToast(skipped + ' plans skipped (invalid format)', false);
    } catch(err) {
      showToast('Import failed: ' + err.message, false);
    }
    // Reset file input so same file can be re-imported if needed
    input.value = '';
  };
  reader.readAsText(file);
}

// ── MOBILE: SIDEBAR TOGGLE ────────────────────────────────────
function toggleSidebar() {
  if (window.innerWidth > 820) return;
  var sb = document.querySelector('.sb');
  if (sb) sb.classList.toggle('expanded');
}

function collapseSidebar() {
  if (window.innerWidth > 820) return;
  var sb = document.querySelector('.sb');
  if (sb) sb.classList.remove('expanded');
}

// ── MOBILE: BOTTOM NAV SYNC ───────────────────────────────────
// Patch showView to also sync bottom nav tabs and collapse sidebar
var _origShowView = showView;
showView = function(name) {
  _origShowView(name);
  // Sync bottom nav
  document.querySelectorAll('.bnav-tab').forEach(function(t){
    t.classList.toggle('on', t.getAttribute('data-view') === name);
  });
  // Collapse sidebar when navigating away on mobile
  if (name !== 'planner') collapseSidebar();
};

// ── MOBILE: UPDATE SIDEBAR SUMMARY ───────────────────────────
// Show "3 muscles" in the collapsed sidebar header
var _origUpdateFooter = updateFooter;
updateFooter = function() {
  _origUpdateFooter();
  var n = selected.size;
  var summary = document.getElementById('sb-sel-summary');
  if (summary) summary.textContent = n ? n + ' selected' : '';
};

// ── MOBILE: COLLAPSE SIDEBAR AFTER GENERATE ──────────────────
var _origGenerate = generate;
generate = function() {
  _origGenerate();
  // Small delay so plan renders first, then sidebar collapses
  setTimeout(collapseSidebar, 150);
};

// ── MOBILE: COLLAPSE SIDEBAR AFTER PRESET ────────────────────
var _origApplyPreset = applyPreset;
applyPreset = function(key) {
  _origApplyPreset(key);
  // applyPreset already calls generate which collapses — nothing extra needed
};

// ── MOBILE: BOTTOM NAV BADGES ─────────────────────────────────
var _origUpdatePlansBadge = updatePlansBadge;
updatePlansBadge = function() {
  _origUpdatePlansBadge();
  var n = getPlans().length;
  // Sync bottom nav badge
  var bnb = document.getElementById('bnav-badge-plans');
  if (bnb) {
    bnb.textContent = n;
    bnb.style.display = n ? 'flex' : 'none';
  }
};
