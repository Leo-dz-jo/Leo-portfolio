/* =========================================================================
   DEMOS.JS — small, self-contained interactive simulations of each real
   project, mounted into the "Live demo" tab of the project modal (see
   openModal() in script.js). Each entry in DEMOS is keyed by the 'demo'
   field set on a project in data.js, and exposes:

     build(root) -> cleanup()

   'root' is an empty container already in the DOM. build() should render
   into it and wire up listeners, then return a cleanup function (clearing
   intervals/timeouts) that gets called when the modal closes or switches
   to a different project. These are simulations, not the production
   apps — scaled down to run instantly, offline, with no backend.
   ========================================================================= */

const DEMOS = {};

/* ---------- shared little helpers ---------- */
function peso(n){
  return '\u20b1' + n.toLocaleString('en-PH', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}
function pad2(n){ return String(n).padStart(2, '0'); }
function fmtClock(d){ return `${pad2(d.getHours()%12||12)}:${pad2(d.getMinutes())}:${pad2(d.getSeconds())} ${d.getHours()<12?'AM':'PM'}`; }
function fmtElapsed(ms){
  const s = Math.floor(ms/1000);
  return `${pad2(Math.floor(s/3600))}:${pad2(Math.floor(s/60)%60)}:${pad2(s%60)}`;
}
function shortHash(){ return Array.from({length:8}, () => '0123456789abcdef'[Math.floor(Math.random()*16)]).join(''); }
function el(tag, cls, html){ const e = document.createElement(tag); if(cls) e.className = cls; if(html !== undefined) e.innerHTML = html; return e; }

/* =========================================================================
   1) TIMECARD PWA — geolocation-verified clock-in with a live hash-chained
   audit log, mirroring audit-log.js shown in "Under the hood".
   ========================================================================= */
DEMOS.timecard = {
  build(root){
    const employees = ['J. Bregana', 'M. Santos', 'A. Reyes'];
    let clockedIn = false, inSince = null, chain = [];
    let selected = employees[0];

    root.innerHTML = `
      <div class="demo-widget demo-timecard">
        <div class="demo-row demo-row-between">
          <select class="demo-select" id="tcEmployee">${employees.map(n => `<option>${n}</option>`).join('')}</select>
          <span class="demo-clock" id="tcClock">--:--:-- --</span>
        </div>
        <div class="demo-gps" id="tcGps">📍 Location not yet verified</div>
        <div class="demo-timecard-status" id="tcStatus">
          <span class="demo-dot off" id="tcDot"></span>
          <span id="tcStatusText">Clocked out</span>
          <span class="demo-elapsed" id="tcElapsed"></span>
        </div>
        <button class="demo-btn primary" id="tcBtn">Clock in</button>
        <p class="demo-sub">Each entry is chained to the previous one's hash — same logic as <code>appendAuditEntry()</code> below.</p>
        <div class="demo-log" id="tcLog"><p class="demo-log-empty">No entries yet today.</p></div>
      </div>`;

    const clockEl = root.querySelector('#tcClock');
    const gpsEl = root.querySelector('#tcGps');
    const dotEl = root.querySelector('#tcDot');
    const statusText = root.querySelector('#tcStatusText');
    const elapsedEl = root.querySelector('#tcElapsed');
    const btn = root.querySelector('#tcBtn');
    const log = root.querySelector('#tcLog');
    const empSel = root.querySelector('#tcEmployee');
    empSel.addEventListener('change', () => selected = empSel.value);

    function renderLog(){
      if(!chain.length){ log.innerHTML = '<p class="demo-log-empty">No entries yet today.</p>'; return; }
      log.innerHTML = chain.slice().reverse().map(e => `
        <div class="demo-log-row">
          <span class="demo-log-type ${e.type}">${e.type === 'in' ? 'IN' : 'OUT'}</span>
          <span class="demo-log-who">${e.who}</span>
          <span class="demo-log-time">${e.time}</span>
          <span class="demo-log-hash" title="prevHash → hash">${e.prevHash.slice(0,6)}…→${e.hash.slice(0,6)}…</span>
        </div>`).join('');
    }

    function appendEntry(type){
      const prevHash = chain.length ? chain[chain.length-1].hash : '00000000';
      const entry = { type, who: selected, time: fmtClock(new Date()), prevHash, hash: shortHash() };
      chain.push(entry);
      renderLog();
    }

    btn.addEventListener('click', () => {
      if(!clockedIn){
        gpsEl.innerHTML = '📍 Verifying location…';
        gpsEl.className = 'demo-gps checking';
        setTimeout(() => {
          const lat = (14.30 + Math.random()*0.05).toFixed(5);
          const lng = (120.90 + Math.random()*0.05).toFixed(5);
          gpsEl.innerHTML = `📍 Verified — ${lat}, ${lng} <span class="demo-ok">✓ within geofence</span>`;
          gpsEl.className = 'demo-gps ok';
          clockedIn = true; inSince = Date.now();
          dotEl.className = 'demo-dot on';
          statusText.textContent = `Clocked in — ${selected}`;
          btn.textContent = 'Clock out';
          btn.classList.add('danger');
          appendEntry('in');
        }, 700);
      } else {
        clockedIn = false;
        dotEl.className = 'demo-dot off';
        statusText.textContent = 'Clocked out';
        elapsedEl.textContent = '';
        btn.textContent = 'Clock in';
        btn.classList.remove('danger');
        appendEntry('out');
      }
    });

    const iv = setInterval(() => {
      clockEl.textContent = fmtClock(new Date());
      if(clockedIn) elapsedEl.textContent = ' · ' + fmtElapsed(Date.now() - inSince);
    }, 1000);
    clockEl.textContent = fmtClock(new Date());

    return () => clearInterval(iv);
  }
};

/* =========================================================================
   2) FINANCIAL COMMAND CENTER — three companies, live-ticking KPI cards
   with a count-up animation mirroring AnimateKPICard() in VBA.
   ========================================================================= */
DEMOS.financial = {
  build(root){
    const companies = [
      { name: 'Northwind Foods', revenue: 4_820_000, expenses: 3_110_000, margin: 35 },
      { name: 'Bataan Freight',  revenue: 2_390_000, expenses: 1_980_000, margin: 17 },
      { name: 'Cavite Retail Co',revenue: 6_140_000, expenses: 4_705_000, margin: 23 },
    ];
    let active = 0;

    root.innerHTML = `
      <div class="demo-widget demo-financial">
        <div class="demo-tabs" id="fcTabs">${companies.map((c,i) => `<button class="demo-tab${i===0?' active':''}" data-i="${i}">${c.name}</button>`).join('')}</div>
        <div class="demo-kpi-row">
          <div class="demo-kpi"><span class="demo-kpi-label">Revenue</span><span class="demo-kpi-val" id="fcRevenue">${peso(0)}</span></div>
          <div class="demo-kpi"><span class="demo-kpi-label">Expenses</span><span class="demo-kpi-val" id="fcExpenses">${peso(0)}</span></div>
          <div class="demo-kpi"><span class="demo-kpi-label">Margin</span><span class="demo-kpi-val" id="fcMargin">0%</span></div>
        </div>
        <canvas id="fcChart" class="demo-chart" width="480" height="140"></canvas>
        <p class="demo-sub">Bars re-animate on every tab switch — same count-up technique as <code>AnimateKPICard()</code>.</p>
      </div>`;

    const revEl = root.querySelector('#fcRevenue');
    const expEl = root.querySelector('#fcExpenses');
    const marEl = root.querySelector('#fcMargin');
    const canvas = root.querySelector('#fcChart');
    const ctx = canvas.getContext('2d');
    const tabs = root.querySelector('#fcTabs');

    let animId = null;
    function accent(){ return getComputedStyle(document.body).getPropertyValue('--accent').trim(); }
    function accent2(){ return getComputedStyle(document.body).getPropertyValue('--accent-2').trim(); }

    // synthetic 6-month history per company, derived deterministically from revenue
    function history(c){
      const arr = [];
      for(let m=0;m<6;m++){
        const wobble = Math.sin(m*1.3 + c.revenue%7) * 0.12 + 1;
        arr.push(Math.round(c.revenue/6 * wobble * (0.85 + m*0.03)));
      }
      return arr;
    }

    function drawChart(progress, c){
      const W = canvas.width, H = canvas.height;
      ctx.clearRect(0,0,W,H);
      const data = history(c);
      const max = Math.max(...data) * 1.15;
      const bw = W / data.length;
      data.forEach((v,i) => {
        const h = (v/max) * (H-24) * progress;
        const x = i*bw + bw*0.2, w = bw*0.6;
        const grad = ctx.createLinearGradient(0, H-h, 0, H);
        grad.addColorStop(0, accent());
        grad.addColorStop(1, accent2());
        ctx.fillStyle = grad;
        ctx.beginPath();
        const r = 4;
        const y = H - h;
        ctx.moveTo(x, H);
        ctx.lineTo(x, y+r);
        ctx.quadraticCurveTo(x, y, x+r, y);
        ctx.lineTo(x+w-r, y);
        ctx.quadraticCurveTo(x+w, y, x+w, y+r);
        ctx.lineTo(x+w, H);
        ctx.closePath();
        ctx.fill();
      });
    }

    function animateTo(c){
      if(animId) cancelAnimationFrame(animId);
      const steps = 24; let i = 0;
      const startRev = 0, startExp = 0, startMar = 0;
      function frame(){
        i++;
        const t = i/steps;
        const ease = 1 - Math.pow(1-t, 3);
        revEl.textContent = peso(Math.round(startRev + (c.revenue-startRev)*ease));
        expEl.textContent = peso(Math.round(startExp + (c.expenses-startExp)*ease));
        marEl.textContent = Math.round(startMar + (c.margin-startMar)*ease) + '%';
        drawChart(ease, c);
        if(i < steps) animId = requestAnimationFrame(frame);
      }
      frame();
    }

    tabs.addEventListener('click', (e) => {
      const btn = e.target.closest('.demo-tab');
      if(!btn) return;
      active = parseInt(btn.dataset.i, 10);
      tabs.querySelectorAll('.demo-tab').forEach(t => t.classList.toggle('active', t === btn));
      animateTo(companies[active]);
    });

    animateTo(companies[0]);
    return () => { if(animId) cancelAnimationFrame(animId); };
  }
};

/* =========================================================================
   3) DEV-TO-DO — 4-stage kanban board (subset of the real 7-stage board),
   cards move with a tap/click (works on touch) or native drag on desktop.
   ========================================================================= */
DEMOS.kanban = {
  build(root){
    const cols = ['Backlog', 'In progress', 'Review', 'Done'];
    let cards = [
      { id:1, text:'Wire up reminders + snooze', col:1 },
      { id:2, text:'Weekly progress chart animation', col:2 },
      { id:3, text:'Mini calendar navigation', col:0 },
      { id:4, text:'Terminal-dark theme polish', col:3 },
      { id:5, text:'7-stage board persistence', col:0 },
    ];
    let nextId = 6;

    root.innerHTML = `
      <div class="demo-widget demo-kanban">
        <div class="demo-row">
          <input type="text" class="demo-input" id="kbInput" placeholder="Add a task…" maxlength="48">
          <button class="demo-btn primary" id="kbAdd">Add</button>
        </div>
        <div class="demo-kanban-board" id="kbBoard"></div>
        <p class="demo-sub">Tap the arrow on a card to move it — same board model as dev-to-do's kanban.</p>
      </div>`;

    const board = root.querySelector('#kbBoard');
    const input = root.querySelector('#kbInput');

    function render(){
      board.innerHTML = cols.map((name, ci) => `
        <div class="demo-col" data-col="${ci}">
          <div class="demo-col-head">${name} <span class="demo-col-count">${cards.filter(c=>c.col===ci).length}</span></div>
          <div class="demo-col-body">
            ${cards.filter(c => c.col === ci).map(c => `
              <div class="demo-kb-card" draggable="true" data-id="${c.id}">
                <span>${c.text}</span>
                <div class="demo-kb-actions">
                  ${ci > 0 ? `<button class="demo-kb-move" data-dir="-1" data-id="${c.id}" aria-label="Move left">←</button>` : ''}
                  ${ci < cols.length-1 ? `<button class="demo-kb-move" data-dir="1" data-id="${c.id}" aria-label="Move right">→</button>` : ''}
                </div>
              </div>`).join('')}
          </div>
        </div>`).join('');

      board.querySelectorAll('.demo-kb-move').forEach(btn => {
        btn.addEventListener('click', () => {
          const id = parseInt(btn.dataset.id, 10);
          const dir = parseInt(btn.dataset.dir, 10);
          const card = cards.find(c => c.id === id);
          card.col = Math.min(cols.length-1, Math.max(0, card.col + dir));
          render();
        });
      });
      board.querySelectorAll('.demo-kb-card').forEach(cardEl => {
        cardEl.addEventListener('dragstart', (e) => { e.dataTransfer.setData('text/plain', cardEl.dataset.id); });
      });
      board.querySelectorAll('.demo-col').forEach(colEl => {
        colEl.addEventListener('dragover', (e) => e.preventDefault());
        colEl.addEventListener('drop', (e) => {
          e.preventDefault();
          const id = parseInt(e.dataTransfer.getData('text/plain'), 10);
          const card = cards.find(c => c.id === id);
          if(card) card.col = parseInt(colEl.dataset.col, 10);
          render();
        });
      });
    }

    function addCard(){
      const text = input.value.trim();
      if(!text) return;
      cards.push({ id: nextId++, text, col: 0 });
      input.value = '';
      render();
    }
    root.querySelector('#kbAdd').addEventListener('click', addCard);
    input.addEventListener('keydown', (e) => { if(e.key === 'Enter') addCard(); });

    render();
    return () => {};
  }
};

/* =========================================================================
   4) MB_303 — BIOMETRIC ATTENDANCE — simulated OLED readout, fingerprint
   scan, and servo-gate, mirroring enrollFingerprint()'s state flow.
   ========================================================================= */
DEMOS.biometric = {
  build(root){
    const names = ['J. Bregana', 'M. Santos', 'A. Reyes', 'unknown'];
    let entries = [];
    let scanning = false;

    root.innerHTML = `
      <div class="demo-widget demo-biometric">
        <div class="demo-oled" id="mbOled">
          <div class="demo-oled-line" id="mbLine1">MB_303 READY</div>
          <div class="demo-oled-line dim" id="mbLine2">Place finger to scan</div>
        </div>
        <div class="demo-row demo-row-center">
          <div class="demo-scanner" id="mbScanner">
            <div class="demo-scanner-bar" id="mbScanBar"></div>
            <span class="demo-scanner-icon">👆</span>
          </div>
          <div class="demo-gate" id="mbGate">
            <div class="demo-gate-arm" id="mbGateArm"></div>
            <span class="demo-gate-label">GATE</span>
          </div>
        </div>
        <button class="demo-btn primary" id="mbScanBtn">Place finger on sensor</button>
        <div class="demo-log" id="mbLog"><p class="demo-log-empty">No scans yet.</p></div>
      </div>`;

    const line1 = root.querySelector('#mbLine1');
    const line2 = root.querySelector('#mbLine2');
    const bar = root.querySelector('#mbScanBar');
    const scanner = root.querySelector('#mbScanner');
    const gateArm = root.querySelector('#mbGateArm');
    const btn = root.querySelector('#mbScanBtn');
    const log = root.querySelector('#mbLog');

    function renderLog(){
      if(!entries.length){ log.innerHTML = '<p class="demo-log-empty">No scans yet.</p>'; return; }
      log.innerHTML = entries.slice().reverse().map(e => `
        <div class="demo-log-row">
          <span class="demo-log-type ${e.ok ? 'in' : 'out'}">${e.ok ? 'OK' : 'FAIL'}</span>
          <span class="demo-log-who">${e.who}</span>
          <span class="demo-log-time">${e.time}</span>
        </div>`).join('');
    }

    btn.addEventListener('click', () => {
      if(scanning) return;
      scanning = true;
      btn.disabled = true;
      scanner.classList.add('active');
      line1.textContent = 'SCANNING…';
      line2.textContent = 'Hold still';
      bar.style.transition = 'none'; bar.style.width = '0%';
      requestAnimationFrame(() => {
        bar.style.transition = 'width 1.3s linear';
        bar.style.width = '100%';
      });
      setTimeout(() => {
        const ok = Math.random() > 0.22;
        const who = ok ? names[Math.floor(Math.random()*3)] : names[3];
        scanner.classList.remove('active');
        if(ok){
          line1.textContent = 'ACCESS GRANTED';
          line2.textContent = `Welcome, ${who}`;
          gateArm.classList.add('open');
          setTimeout(() => gateArm.classList.remove('open'), 1600);
        } else {
          line1.textContent = 'NOT RECOGNIZED';
          line2.textContent = 'Try again';
        }
        entries.push({ who, ok, time: fmtClock(new Date()) });
        renderLog();
        setTimeout(() => {
          line1.textContent = 'MB_303 READY';
          line2.textContent = 'Place finger to scan';
          btn.disabled = false;
          scanning = false;
        }, 1200);
      }, 1400);
    });

    return () => {};
  }
};

/* =========================================================================
   5) EXCEL BUSINESS SUITE — a tiny editable inventory sheet with live
   SUMIFS-style totals and peso formatting.
   ========================================================================= */
DEMOS.excel = {
  build(root){
    let rows = [
      { item: 'Rice (25kg sack)', qty: 40, price: 1450 },
      { item: 'Cooking oil (1L)', qty: 120, price: 95 },
      { item: 'Canned goods (case)', qty: 60, price: 780 },
    ];
    let nextId = rows.length;

    root.innerHTML = `
      <div class="demo-widget demo-excel">
        <div class="demo-table-wrap">
        <table class="demo-table">
          <thead><tr><th>Item</th><th>Qty</th><th>Unit price</th><th>Total</th><th></th></tr></thead>
          <tbody id="exBody"></tbody>
          <tfoot><tr><td colspan="3">Grand total</td><td id="exGrand" colspan="2"></td></tr></tfoot>
        </table>
        </div>
        <button class="demo-btn" id="exAdd">+ Add row</button>
        <p class="demo-sub">Formulas recompute live — same SUMIFS logic as <code>build_invoice_sheet()</code>.</p>
      </div>`;

    const body = root.querySelector('#exBody');
    const grand = root.querySelector('#exGrand');

    function render(){
      body.innerHTML = rows.map((r,i) => `
        <tr data-i="${i}">
          <td><input class="demo-cell" data-f="item" value="${r.item}"></td>
          <td><input class="demo-cell num" data-f="qty" type="number" min="0" value="${r.qty}"></td>
          <td><input class="demo-cell num" data-f="price" type="number" min="0" step="0.01" value="${r.price}"></td>
          <td class="demo-cell-total">${peso(r.qty*r.price)}</td>
          <td><button class="demo-row-del" data-i="${i}" aria-label="Delete row">✕</button></td>
        </tr>`).join('');
      grand.textContent = peso(rows.reduce((s,r) => s + r.qty*r.price, 0));

      body.querySelectorAll('.demo-cell').forEach(input => {
        input.addEventListener('input', () => {
          const i = parseInt(input.closest('tr').dataset.i, 10);
          const f = input.dataset.f;
          rows[i][f] = f === 'item' ? input.value : (parseFloat(input.value) || 0);
          const totalCell = input.closest('tr').querySelector('.demo-cell-total');
          totalCell.textContent = peso(rows[i].qty * rows[i].price);
          grand.textContent = peso(rows.reduce((s,r) => s + r.qty*r.price, 0));
        });
      });
      body.querySelectorAll('.demo-row-del').forEach(btn => {
        btn.addEventListener('click', () => { rows.splice(parseInt(btn.dataset.i,10), 1); render(); });
      });
    }
    root.querySelector('#exAdd').addEventListener('click', () => {
      rows.push({ item: `New item ${++nextId}`, qty: 1, price: 0 });
      render();
    });

    render();
    return () => {};
  }
};

/* =========================================================================
   6) REACT TO-DO SUITE — one shared task list rendered through three
   coordinated views (List / Kanban / Calendar), proving state stays in
   sync no matter which view edits it.
   ========================================================================= */
DEMOS.reacttodo = {
  build(root){
    let tasks = [
      { id:1, text:'Fix JSX layout bug in Goals view', done:false, day:3, col:1 },
      { id:2, text:'Sync Dashboard totals with List', done:true,  day:1, col:2 },
      { id:3, text:'Add drag support to Kanban view', done:false, day:5, col:0 },
      { id:4, text:'Wire Calendar dots to task count', done:false, day:5, col:0 },
    ];
    let view = 'list';

    root.innerHTML = `
      <div class="demo-widget demo-reacttodo">
        <div class="demo-tabs" id="rtTabs">
          <button class="demo-tab active" data-v="list">List</button>
          <button class="demo-tab" data-v="kanban">Kanban</button>
          <button class="demo-tab" data-v="calendar">Calendar</button>
        </div>
        <div id="rtView"></div>
        <p class="demo-sub">Check a task off in List, then switch views — the state carries over everywhere.</p>
      </div>`;

    const viewEl = root.querySelector('#rtView');
    const tabsEl = root.querySelector('#rtTabs');
    const cols = ['To do', 'Doing', 'Done'];

    function renderList(){
      viewEl.innerHTML = `<div class="demo-rt-list">${tasks.map(t => `
        <label class="demo-rt-item ${t.done?'done':''}">
          <input type="checkbox" data-id="${t.id}" ${t.done?'checked':''}>
          <span>${t.text}</span>
        </label>`).join('')}</div>`;
      viewEl.querySelectorAll('input[type=checkbox]').forEach(cb => {
        cb.addEventListener('change', () => {
          const t = tasks.find(x => x.id === parseInt(cb.dataset.id,10));
          t.done = cb.checked;
          t.col = t.done ? 2 : 1;
        });
      });
    }
    function renderKanban(){
      viewEl.innerHTML = `<div class="demo-rt-kanban">${cols.map((name,ci) => `
        <div class="demo-col mini">
          <div class="demo-col-head">${name}</div>
          <div class="demo-col-body">
            ${tasks.filter(t => t.col === ci).map(t => `<div class="demo-kb-card mini">${t.text}</div>`).join('')}
          </div>
        </div>`).join('')}</div>`;
    }
    function renderCalendar(){
      const counts = {};
      tasks.forEach(t => { counts[t.day] = (counts[t.day]||0)+1; });
      const days = Array.from({length:7}, (_,i) => i+1);
      viewEl.innerHTML = `<div class="demo-rt-cal">${days.map(d => `
        <div class="demo-cal-day ${counts[d]?'has':''}">
          <span>${d}</span>
          ${counts[d] ? `<span class="demo-cal-dot">${counts[d]}</span>` : ''}
        </div>`).join('')}</div>`;
    }
    function render(){
      if(view === 'list') renderList();
      else if(view === 'kanban') renderKanban();
      else renderCalendar();
    }
    tabsEl.addEventListener('click', (e) => {
      const btn = e.target.closest('.demo-tab');
      if(!btn) return;
      view = btn.dataset.v;
      tabsEl.querySelectorAll('.demo-tab').forEach(t => t.classList.toggle('active', t === btn));
      render();
    });

    render();
    return () => {};
  }
};

/* =========================================================================
   7) BRANCH (concept) — task dependency graph rendered as git-style
   commit nodes; adding a task attaches it to a chosen parent.
   ========================================================================= */
DEMOS.branch = {
  build(root){
    let nodes = [
      { id:1, label:'init',       hash: shortHash(), parent:null, x:60,  y:70 },
      { id:2, label:'design ui',  hash: shortHash(), parent:1,    x:180, y:40 },
      { id:3, label:'data model', hash: shortHash(), parent:1,    x:180, y:100 },
      { id:4, label:'sync engine',hash: shortHash(), parent:3,    x:300, y:100 },
    ];
    let nextId = 5;
    let selectedParent = 4;

    root.innerHTML = `
      <div class="demo-widget demo-branch">
        <p class="demo-sub" style="margin-top:0;">Concept preview — tasks are stored as git-style commit objects with dependency edges.</p>
        <svg id="brSvg" class="demo-branch-svg" viewBox="0 0 420 160"></svg>
        <div class="demo-row">
          <input type="text" class="demo-input" id="brInput" placeholder="New task name…" maxlength="30">
          <select class="demo-select" id="brParent"></select>
          <button class="demo-btn primary" id="brAdd">Branch</button>
        </div>
      </div>`;

    const svg = root.querySelector('#brSvg');
    const input = root.querySelector('#brInput');
    const parentSel = root.querySelector('#brParent');

    function layout(){
      // simple depth-based layout so new branches fan out vertically
      const depth = {};
      function d(id){
        if(depth[id] !== undefined) return depth[id];
        const n = nodes.find(x => x.id === id);
        depth[id] = n.parent === null ? 0 : d(n.parent) + 1;
        return depth[id];
      }
      const colCount = {};
      nodes.forEach(n => {
        const dp = d(n.id);
        colCount[dp] = (colCount[dp]||0);
        n.x = 55 + dp*110;
        n.y = 42 + colCount[dp]*52;
        colCount[dp]++;
      });
    }

    function render(){
      layout();
      parentSel.innerHTML = nodes.map(n => `<option value="${n.id}" ${n.id===selectedParent?'selected':''}>${n.label}</option>`).join('');
      const accent = getComputedStyle(document.body).getPropertyValue('--accent').trim();
      const accent2 = getComputedStyle(document.body).getPropertyValue('--accent-2').trim();
      const edges = nodes.filter(n => n.parent !== null).map(n => {
        const p = nodes.find(x => x.id === n.parent);
        return `<path d="M${p.x},${p.y} C${(p.x+n.x)/2},${p.y} ${(p.x+n.x)/2},${n.y} ${n.x},${n.y}" stroke="${accent2}" stroke-width="1.6" fill="none" opacity="0.55"/>`;
      }).join('');
      const dots = nodes.map(n => `
        <g class="demo-git-node" data-id="${n.id}">
          <circle cx="${n.x}" cy="${n.y}" r="7" fill="${n.id===selectedParent?accent:'var(--surface-2)'}" stroke="${accent}" stroke-width="1.6"/>
          <text x="${n.x}" y="${n.y-13}" text-anchor="middle" font-size="9.5" fill="var(--text)" font-family="var(--font-mono)">${n.label}</text>
          <text x="${n.x}" y="${n.y+20}" text-anchor="middle" font-size="8" fill="var(--text-dim)" font-family="var(--font-mono)">${n.hash.slice(0,6)}</text>
        </g>`).join('');
      svg.innerHTML = edges + dots;
      const maxY = Math.max(...nodes.map(n => n.y)) + 46;
      svg.setAttribute('viewBox', `0 0 420 ${Math.max(160, maxY)}`);

      svg.querySelectorAll('.demo-git-node').forEach(g => {
        g.addEventListener('click', () => { selectedParent = parseInt(g.dataset.id, 10); render(); });
      });
    }

    root.querySelector('#brAdd').addEventListener('click', () => {
      const text = input.value.trim();
      if(!text) return;
      nodes.push({ id: nextId, label: text.slice(0,16), hash: shortHash(), parent: selectedParent });
      selectedParent = nextId;
      nextId++;
      input.value = '';
      render();
    });
    input.addEventListener('keydown', (e) => { if(e.key === 'Enter') root.querySelector('#brAdd').click(); });
    parentSel.addEventListener('change', () => { selectedParent = parseInt(parentSel.value, 10); render(); });

    render();
    return () => {};
  }
};
