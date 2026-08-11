

(function() {
    'use strict';

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

   
    document.getElementById('navName').textContent = PROFILE.handle;
    
    let tagline = PROFILE.tagline;
    tagline = tagline.replace(/software/i, '<span class="glitch-word" data-text="software">software</span>');
    tagline = tagline.replace(/working/i, '<span class="hl">working</span>');
    document.getElementById('heroHeadline').innerHTML = tagline;
    document.getElementById('heroSubhead').textContent = PROFILE.subhead;
    document.getElementById('footerLocation').textContent = `// built offline-first, ${PROFILE.location}`;
    document.getElementById('copyEmailBtn').textContent = `Copy email — ${PROFILE.email}`;
    document.getElementById('githubLink').href = PROFILE.github;

   
    const fallbackPhoto = `https://ui-avatars.com/api/?name=${encodeURIComponent(PROFILE.name || 'L')}&background=161D26&color=E8A33D&size=320&font-size=0.5&bold=true`;
    const heroPhotoSrc = (PROFILE.photo && PROFILE.photo.trim()) ? PROFILE.photo.trim() : fallbackPhoto;
    const timelinePhotoSrc = (PROFILE.timelinePhoto && PROFILE.timelinePhoto.trim()) ? PROFILE.timelinePhoto.trim() : fallbackPhoto;
    [
        ['profileImage', heroPhotoSrc],
        ['timelinePortraitImg', timelinePhotoSrc],
    ].forEach(([id, src]) => {
        const img = document.getElementById(id);
        if (!img) return;
        img.src = src;
       
        const wrap = img.closest('.tlp-photo');
        if (wrap) wrap.style.setProperty('--photo-src', `url("${src}")`);
    });

    
    (function boot() {
        const bootLines = document.getElementById('bootLines');
        const bootBar = document.getElementById('bootBar');
        const preloader = document.getElementById('preloader');
        const lines = [
            ['Initializing portfolio…', null],
            [`Loading profile: ${PROFILE.handle}`, null],
            [`Mounting ${PROJECTS.length} projects…`, null],
            ['Connecting SQLite (WebAssembly)…', null],
            ['Status: Ready.', 'ok'],
        ];
        if (reduceMotion) { preloader.classList.add('hidden'); return; }
        let i = 0;

        function step() {
            if (i < lines.length) {
                const div = document.createElement('div');
                div.className = 'line' + (lines[i][1] ? ' ' + lines[i][1] : '');
                div.textContent = lines[i][0];
                bootLines.appendChild(div);
                bootBar.style.width = Math.round(((i + 1) / lines.length) * 100) + '%';
                i++;
                setTimeout(step, 220);
            } else {
                setTimeout(() => preloader.classList.add('hidden'), 350);
            }
        }
        step();
    })();

   
    const hamburgerBtn = document.getElementById('hamburgerBtn');
    const navCollapse = document.getElementById('navCollapse');
    const navBackdrop = document.getElementById('navBackdrop');

    function openNavDrawer() { navCollapse.classList.add('open');
        navBackdrop.classList.add('open');
        hamburgerBtn.classList.add('open');
        hamburgerBtn.setAttribute('aria-expanded', 'true');
        document.body.classList.add('nav-locked'); }

    function closeNavDrawer() { navCollapse.classList.remove('open');
        navBackdrop.classList.remove('open');
        hamburgerBtn.classList.remove('open');
        hamburgerBtn.setAttribute('aria-expanded', 'false');
        document.body.classList.remove('nav-locked'); }
    hamburgerBtn.addEventListener('click', () => { navCollapse.classList.contains('open') ? closeNavDrawer() :
            openNavDrawer(); });
    navBackdrop.addEventListener('click', closeNavDrawer);
    navCollapse.querySelectorAll('.nav-links a').forEach(a => a.addEventListener('click', closeNavDrawer));
    window.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && navCollapse.classList.contains('open')) {
            closeNavDrawer();
            hamburgerBtn.focus();
        }
    });

    
    const scrollProgress = document.getElementById('scroll-progress');
    const readProgress = document.getElementById('read-progress');
    let readTimeout;

    function updateScrollProgress() {
        const h = document.documentElement;
        const scrolled = (h.scrollTop) / (h.scrollHeight - h.clientHeight) * 100;
        scrollProgress.style.width = scrolled + '%';
        if (scrolled > 2) {
            readProgress.textContent = Math.round(scrolled) + '% read';
            readProgress.classList.add('show');
            clearTimeout(readTimeout);
            readTimeout = setTimeout(() => readProgress.classList.remove('show'), 3000);
        }
    }
    window.addEventListener('scroll', updateScrollProgress, { passive: true });
    updateScrollProgress();

   
    const dotButtons = document.querySelectorAll('#dot-nav button');
    const topNavLinks = document.querySelectorAll('.nav-links a[href^="#"]');
    const spySections = [...dotButtons].map(b => document.getElementById(b.dataset.target)).filter(Boolean);
    dotButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            document.getElementById(btn.dataset.target)?.scrollIntoView({ behavior: reduceMotion ? 'auto' :
                    'smooth' });
        });
    });
    const spyObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                dotButtons.forEach(b => b.classList.toggle('active', b.dataset.target === entry.target.id));
                topNavLinks.forEach(a => a.classList.toggle('active', a.getAttribute('href') === '#' + entry.target.id));
            }
        });
    }, { rootMargin: '-45% 0px -50% 0px' });
    spySections.forEach(s => spyObserver.observe(s));

    
    if (window.matchMedia('(pointer:fine)').matches && !reduceMotion) {
        document.body.classList.add('has-custom-cursor');
        const dot = document.getElementById('cursorDot');
        const ring = document.getElementById('cursorRing');
        let mx = 0,
            my = 0,
            rx = 0,
            ry = 0;
        window.addEventListener('mousemove', (e) => { mx = e.clientX;
            my = e.clientY;
            dot.style.left = mx + 'px';
            dot.style.top = my + 'px'; });

        function ringLoop() {
            rx += (mx - rx) * 0.18;
            ry += (my - ry) * 0.18;
            ring.style.left = rx + 'px';
            ring.style.top = ry + 'px';
            requestAnimationFrame(ringLoop);
        }
        ringLoop();
        document.querySelectorAll('a, button, .project-card, input, textarea, .chip, .swatch').forEach(el => {
            el.addEventListener('mouseenter', () => { dot.classList.add('grow');
                ring.classList.add('grow'); });
            el.addEventListener('mouseleave', () => { dot.classList.remove('grow');
                ring.classList.remove('grow'); });
        });
    }

   
    if (window.matchMedia('(pointer:fine)').matches && !reduceMotion) {
        document.querySelectorAll('.magnetic').forEach(btn => {
            btn.addEventListener('mousemove', (e) => {
                const r = btn.getBoundingClientRect();
                const relX = e.clientX - r.left - r.width / 2;
                const relY = e.clientY - r.top - r.height / 2;
                btn.style.transform = `translate(${relX*0.18}px, ${relY*0.28}px)`;
            });
            btn.addEventListener('mouseleave', () => { btn.style.transform = ''; });
        });
    }

    
    function setTheme(cls) {
        document.body.className = document.body.className.replace(/theme-\w+/g, '').trim();
        if (cls) document.body.classList.add(cls);
        document.querySelectorAll('.swatch').forEach(s => s.classList.toggle('active', s.dataset.theme === cls));
        document.body.classList.add('has-custom-cursor');
        if (!window.matchMedia('(pointer:fine)').matches || reduceMotion) document.body.classList.remove(
            'has-custom-cursor');
    }
    document.querySelectorAll('.swatch').forEach(s => {
        s.addEventListener('click', () => { setTheme(s.dataset.theme);
            unlockAchievement('theme'); });
    });

    
    const toastEl = document.getElementById('toast');
    let toastTimer = null;

    function showToast(msg, variant) {
        toastEl.textContent = msg;
        toastEl.className = variant ? `show ${variant}` : 'show';
        clearTimeout(toastTimer);
        toastTimer = setTimeout(() => { toastEl.classList.remove('show'); }, 2800);
    }

    
    let audioCtx = null;
    let sfxOn = false;

    function ensureAudio() { if (!audioCtx) audioCtx = new(window.AudioContext || window.webkitAudioContext)(); }

    function playTone(freq, duration, type, gainPeak) {
        if (!sfxOn) return;
        try {
            ensureAudio();
            const osc = audioCtx.createOscillator();
            const gain = audioCtx.createGain();
            osc.type = type || 'sine';
            osc.frequency.value = freq;
            gain.gain.setValueAtTime(0, audioCtx.currentTime);
            gain.gain.linearRampToValueAtTime(gainPeak || 0.05, audioCtx.currentTime + 0.01);
            gain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + duration);
            osc.connect(gain);
            gain.connect(audioCtx.destination);
            osc.start();
            osc.stop(audioCtx.currentTime + duration);
        } catch (e) { /* fail silently */ }
    }
    const sfx = {
        hover: () => playTone(720, 0.06, 'sine', 0.025),
        click: () => playTone(420, 0.09, 'square', 0.04),
        open: () => playTone(560, 0.12, 'triangle', 0.05),
        unlock: () => { playTone(660, 0.09, 'sine', 0.06);
            setTimeout(() => playTone(880, 0.14, 'sine', 0.06), 90); },
    };
    const sfxToggle = document.getElementById('sfxToggle');
    sfxToggle.addEventListener('click', () => {
        sfxOn = !sfxOn;
        sfxToggle.classList.toggle('on', sfxOn);
        sfxToggle.setAttribute('aria-pressed', String(sfxOn));
        if (sfxOn) { ensureAudio();
            playTone(660, 0.1, 'sine', 0.05); }
    });
    document.querySelectorAll('.btn, .chip, .swatch, .code-tab, .sql-preset, #dot-nav button, .kbd-btn').forEach(el => {
        el.addEventListener('mouseenter', () => sfx.hover());
    });
    document.addEventListener('click', (e) => {
        if (e.target.closest(
                '.btn, .chip, .swatch, .code-tab, .sql-preset, #dot-nav button, .kbd-btn, .project-card')) sfx
            .click();
    });

    
    const ACHIEVEMENTS = [
        { id: 'explorer', emoji: '🧭', title: 'Explorer', desc: 'Scrolled through the whole site' },
        { id: 'deep_dive', emoji: '🔍', title: 'Deep Diver', desc: 'Opened a project for details' },
        { id: 'demo_runner', emoji: '🕹️', title: 'Hands-On', desc: 'Ran a live in-page project demo' },
        { id: 'sql_runner', emoji: '🗄️', title: 'Query Runner', desc: 'Ran a live SQL query' },
        { id: 'palette', emoji: '⌨️', title: 'Command Master', desc: 'Opened the command palette' },
        { id: 'theme', emoji: '🎨', title: 'Color Theorist', desc: 'Switched the accent theme' },
        { id: 'filter', emoji: '🧪', title: 'Curator', desc: 'Filtered or searched the projects' },
        { id: 'networker', emoji: '📇', title: 'Networker', desc: 'Copied the contact email' },
        { id: 'konami', emoji: '🕹️', title: 'Old School', desc: 'Found the Konami code' },
        { id: 'linguist', emoji: '🌐', title: 'Linguist', desc: 'Switched the interface language' },
        { id: 'transmitter', emoji: '📡', title: 'Transmitter', desc: 'Sent a message through the contact form' },
        { id: 'github_view', emoji: '🐙', title: 'Live Wire', desc: 'Loaded live GitHub activity' },
    ];
    const unlocked = new Set();

    function unlockAchievement(id) {
        if (unlocked.has(id)) return;
        unlocked.add(id);
        const a = ACHIEVEMENTS.find(x => x.id === id);
        if (a) { sfx.unlock();
            showToast(`🏆 Achievement unlocked — ${a.title}`, 'achv'); }
        renderAchievements();
    }

    function renderAchievements() {
        document.getElementById('achvCount').textContent = `${unlocked.size}/${ACHIEVEMENTS.length}`;
        const list = document.getElementById('achvList');
        list.innerHTML = ACHIEVEMENTS.map(a =>
            `<div class="achv-item ${unlocked.has(a.id) ? 'unlocked' : ''}"><span class="achv-emoji">${unlocked.has(a.id) ? a.emoji : '🔒'}</span><div class="achv-text"><div class="t">${a.title}</div><div class="d">${a.desc}</div></div></div>`
            ).join('');
        document.getElementById('achvProgress').textContent = unlocked.size === ACHIEVEMENTS.length ?
            'All achievements unlocked. Nicely done.' :
            `${ACHIEVEMENTS.length - unlocked.size} left to find.`;
    }
    renderAchievements();
    const achvBackdrop = document.getElementById('achvBackdrop');
    document.getElementById('achvOpenBtn').addEventListener('click', () => achvBackdrop.classList.add('open'));
    document.getElementById('achvClose').addEventListener('click', () => achvBackdrop.classList.remove('open'));
    achvBackdrop.addEventListener('click', (e) => { if (e.target === achvBackdrop) achvBackdrop.classList.remove('open'); });

    
    const footerEl = document.querySelector('footer');
    new IntersectionObserver((entries) => {
        entries.forEach(e => { if (e.isIntersecting) unlockAchievement('explorer'); });
    }, { threshold: 0.3 }).observe(footerEl);

  
    const SHORTCUTS = [
        { key: '⌘ / Ctrl + K', label: 'Open command palette' },
        { key: '/', label: 'Focus project search' },
        { key: '?', label: 'Show this shortcuts panel' },
        { key: 'Esc', label: 'Close any open panel' },
        { key: '↑ ↓ Enter', label: 'Navigate the command palette' },
        { key: '↑↑↓↓←→←→BA', label: '...you\'ll know if you know' },
    ];
    document.getElementById('shortcutsList').innerHTML = SHORTCUTS.map(s =>
        `<div class="kbd-row"><span>${s.label}</span><span class="kbd-key">${s.key}</span></div>`).join('');
    const shortcutsBackdrop = document.getElementById('shortcutsBackdrop');

    function openShortcuts() { shortcutsBackdrop.classList.add('open');
        sfx.open(); }
    document.getElementById('shortcutsClose').addEventListener('click', () => shortcutsBackdrop.classList.remove('open'));
    shortcutsBackdrop.addEventListener('click', (e) => { if (e.target === shortcutsBackdrop) shortcutsBackdrop.classList
            .remove('open'); });

   
    function enableTilt() {
        if (!window.matchMedia('(pointer:fine)').matches || reduceMotion) return;
        document.querySelectorAll('.project-card').forEach(card => {
            card.addEventListener('mousemove', (e) => {
                const r = card.getBoundingClientRect();
                const px = (e.clientX - r.left) / r.width - 0.5;
                const py = (e.clientY - r.top) / r.height - 0.5;
                card.style.transform =
                    `perspective(900px) rotateX(${(-py*6).toFixed(2)}deg) rotateY(${(px*8).toFixed(2)}deg) translateY(-2px)`;
            });
            card.addEventListener('mouseleave', () => { card.style.transform = ''; });
        });
    }

   
    function generateResumePdf() {
        if (!window.jspdf) { showToast('PDF library still loading — try again in a second.'); return; }
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF({ unit: 'pt', format: 'a4' });
        const margin = 48;
        let y = 60;
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(22);
        doc.text(PROFILE.name, margin, y);
        y += 22;
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(11);
        doc.setTextColor(90);
        doc.text(PROFILE.tagline, margin, y);
        y += 16;
        doc.text(`${PROFILE.email}  ·  ${PROFILE.location}`, margin, y);
        y += 34;
        doc.setTextColor(20);
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(13);
        doc.text('Languages & Tools', margin, y);
        y += 8;
        doc.setDrawColor(220);
        doc.line(margin, y, 547, y);
        y += 18;
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(11);
        doc.setTextColor(60);
        SKILLS.forEach(s => { doc.text(`${s.name} — ${s.level}%`, margin, y);
            y += 16; });
        y += 16;
        doc.setTextColor(20);
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(13);
        doc.text('Selected Projects', margin, y);
        y += 8;
        doc.line(margin, y, 547, y);
        y += 18;
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(11);
        PROJECTS.forEach(p => {
            if (y > 760) { doc.addPage();
                y = 60; }
            doc.setTextColor(20);
            doc.setFont('helvetica', 'bold');
            doc.text(p.title, margin, y);
            y += 14;
            doc.setTextColor(90);
            doc.setFont('helvetica', 'normal');
            const lines = doc.splitTextToSize(`${p.short} (${p.status})`, 500);
            doc.text(lines, margin, y);
            y += lines.length * 13 + 12;
        });
        doc.save(`${PROFILE.handle}-resume.pdf`);
        showToast('Résumé downloaded ✓');
    }
    document.getElementById('resumeBtn').addEventListener('click', generateResumePdf);

   
    const termBody = document.getElementById('termBody');
    const termInput = document.getElementById('termInput');

    function printLine(text, cls) {
        const div = document.createElement('div');
        div.className = 'term-line' + (cls ? ' ' + cls : '');
        div.textContent = text;
        termBody.appendChild(div);
        termBody.scrollTop = termBody.scrollHeight;
    }

    function termBoot() {
        const lines = [
            ['Initializing portfolio...', null],
            [`Loading profile: ${PROFILE.handle}`, null],
            [`Mounting projects (${PROJECTS.length} found)`, null],
            ['Status: Ready.', 'ok'],
        ];
        let i = 0;

        function next() {
            if (i < lines.length) { printLine(lines[i][0], lines[i][1]);
                i++;
                setTimeout(next, reduceMotion ? 0 : 200); } else printLine('Type a command, e.g. "help"', null);
        }
        next();
    }
    const THEME_MAP = { amber: '', teal: 'theme-teal', violet: 'theme-violet', rose: 'theme-rose' };
    const COMMANDS = {
        help() {
            printLine('Available commands:');
            printLine('  about        — who I am, in three lines');
            printLine('  skills       — languages and rough proficiency');
            printLine('  projects     — list of everything I\'ve shipped');
            printLine('  contact      — how to reach me');
            printLine('  theme <name> — amber / teal / violet / rose');
            printLine('  clear        — clear the terminal');
            printLine('  stats        — project stats at a glance');
        },
        about() {
            printLine('Leo — builds offline-first tools for Philippine businesses.');
            printLine('Web, desktop, and embedded. Excel counts as production code here.');
        },
        skills() {
            SKILLS.forEach(s => {
                const filled = Math.round(s.level / 10);
                const bar = '█'.repeat(filled) + '░'.repeat(10 - filled);
                printLine(`${s.name.padEnd(16, ' ')} ${bar} ${s.level}%`);
            });
        },
        projects() { PROJECTS.forEach((p, i) => printLine(`${i+1}. ${p.title} — ${p.status}`)); },
        contact() {
            printLine(`Email: ${PROFILE.email}`);
            printLine('Scroll to the bottom for a one-click copy button.');
        },
        stats() {
            const total = PROJECTS.length;
            const deployed = PROJECTS.filter(p => p.status.includes('Deployed')).length;
            const inDesign = PROJECTS.filter(p => p.status.includes('design')).length;
            const withDemo = PROJECTS.filter(p => p.demo).length;
            const tags = new Set(PROJECTS.flatMap(p => p.tags));
            printLine(`📊 Projects: ${total} total`);
            printLine(`   ✅ Deployed: ${deployed}`);
            printLine(`   🔨 In design: ${inDesign}`);
            printLine(`   🕹️ With live demo: ${withDemo}`);
            printLine(`   🏷️ Languages used: ${tags.size}`);
        },
        clear() { termBody.innerHTML = ''; },
    };
    let termHistory = [];
    let termHistoryIdx = -1;
    termInput.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowUp') {
            e.preventDefault();
            if (termHistory.length) {
                termHistoryIdx = Math.min(termHistoryIdx + 1, termHistory.length - 1);
                termInput.value = termHistory[termHistory.length - 1 - termHistoryIdx] || '';
            }
            return;
        }
        if (e.key === 'ArrowDown') {
            e.preventDefault();
            if (termHistoryIdx > 0) { termHistoryIdx--;
                termInput.value = termHistory[termHistory.length - 1 - termHistoryIdx] || ''; } else { termHistoryIdx = -1;
                termInput.value = ''; }
            return;
        }
        if (e.key !== 'Enter') return;
        const raw = termInput.value.trim();
        if (!raw) return;
        termHistory.push(raw);
        termHistoryIdx = -1;
        printLine('> ' + raw, 'cmd');
        const parts = raw.toLowerCase().split(/\s+/);
        const cmd = parts[0];
        if (cmd === 'theme' && parts[1] && THEME_MAP.hasOwnProperty(parts[1])) {
            setTheme(THEME_MAP[parts[1]]);
            printLine(`Theme set to ${parts[1]}.`, 'ok');
        } else if (COMMANDS[cmd]) {
            COMMANDS[cmd]();
        } else {
            printLine(`command not found: ${raw} — type 'help' for options`, 'error');
        }
        termInput.value = '';
    });
    termBoot();

   
    const skillsGrid = document.getElementById('skillsGrid');
    SKILLS.forEach(s => {
        const row = document.createElement('div');
        row.className = 'skill-row';
        row.dataset.tag = s.tag;
        row.innerHTML =
            `<div class="skill-top"><span class="name">${s.name}</span><span class="pct">${s.level}%</span></div><div class="skill-bar-track"><div class="skill-bar-fill" data-level="${s.level}"></div></div>`;
        row.addEventListener('mouseenter', () => highlightProjectsByTag(s.tag));
        row.addEventListener('mouseleave', clearProjectHighlight);
        row.addEventListener('click', () => {
            const chip = document.querySelector(`.chip[data-tag="${s.tag}"]`);
            if (chip) { chip.click();
                document.getElementById('work').scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth' }); }
        });
        skillsGrid.appendChild(row);
    });

    function highlightProjectsByTag(tag) {
        document.querySelectorAll('.project-card').forEach(card => {
            const match = card.dataset.tags.split(',').includes(tag);
            card.classList.toggle('tag-match', match);
            card.classList.toggle('tag-dim', !match);
        });
    }

    function clearProjectHighlight() {
        document.querySelectorAll('.project-card').forEach(card => card.classList.remove('tag-match', 'tag-dim'));
    }

   
    const allTags = ['all', ...new Set(PROJECTS.flatMap(p => p.tags))];
    const statuses = ['all', 'Deployed', 'Actively maintained', 'In design'];
    const chipRow = document.getElementById('chipRow');
    const statusChipRow = document.getElementById('statusChipRow');
    const projectGrid = document.getElementById('projectGrid');
    const projectSearch = document.getElementById('projectSearch');
    const resultsCount = document.getElementById('resultsCount');
    const tagLabels = { all: 'All', javascript: 'JavaScript', web: 'HTML/CSS', python: 'Python', vba: 'VBA',
        cpp: 'C++', rust: 'Rust' };
    let activeTag = 'all';
    let activeStatus = 'all';

    allTags.forEach(tag => {
        const chip = document.createElement('button');
        chip.className = 'chip' + (tag === 'all' ? ' active' : '');
        chip.textContent = tagLabels[tag] || tag;
        chip.dataset.tag = tag;
        chip.addEventListener('click', () => {
            document.querySelectorAll('#chipRow .chip').forEach(c => c.classList.remove('active'));
            chip.classList.add('active');
            activeTag = tag;
            applyFilters();
            unlockAchievement('filter');
        });
        chipRow.appendChild(chip);
    });

    statuses.forEach(st => {
        const chip = document.createElement('button');
        chip.className = 'chip status-chip' + (st === 'all' ? ' active' : '');
        chip.textContent = st === 'all' ? 'All status' : st;
        chip.dataset.status = st;
        chip.addEventListener('click', () => {
            document.querySelectorAll('#statusChipRow .chip').forEach(c => c.classList.remove('active'));
            chip.classList.add('active');
            activeStatus = st;
            applyFilters();
            unlockAchievement('filter');
        });
        statusChipRow.appendChild(chip);
    });

    function applyFilters() {
        const q = projectSearch.value.trim().toLowerCase();
        let visible = 0;
        document.querySelectorAll('.project-card').forEach(card => {
            const tags = card.dataset.tags.split(',');
            const text = card.dataset.search;
            const tagOk = activeTag === 'all' || tags.includes(activeTag);
            const statusOk = activeStatus === 'all' || card.dataset.status === activeStatus;
            const searchOk = !q || text.includes(q);
            const show = tagOk && statusOk && searchOk;
            card.classList.toggle('hidden', !show);
            if (show) visible++;
        });
        if (resultsCount) resultsCount.textContent = `${visible} of ${PROJECTS.length} projects`;
    }
    projectSearch.addEventListener('input', () => { applyFilters(); if (projectSearch.value.trim())
            unlockAchievement('filter'); });

    function projectSlug(title) { return title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''); }

    PROJECTS.forEach((p, idx) => {
        const card = document.createElement('article');
        card.className = 'project-card';
        card.dataset.idx = idx;
        card.dataset.tags = p.tags.join(',');
        card.dataset.status = p.status.includes('Deployed') ? 'Deployed' : p.status.includes('design') ? 'In design' :
            'Actively maintained';
        card.dataset.search = (p.title + ' ' + p.short).toLowerCase();
        card.tabIndex = 0;
        card.setAttribute('role', 'button');
        card.setAttribute('aria-label', 'View details for ' + p.title);
        if (p.demo) card.classList.add('has-demo');
        card.innerHTML = `
              ${p.demo ? '<span class="demo-badge">▶ Live demo</span>' : ''}
              <div class="tag-row">${p.tags.map(t => `<span class="tag">${tagLabels[t] || t}</span>`).join('') || '<span class="tag">Concept</span>'}</div>
              <h3 class="project-title">${p.title}</h3>
              <p class="project-desc">${p.short}</p>
              <div class="project-status${p.dev ? ' dev' : ''}">
                <span class="left"><span class="dot"></span>${p.status}</span>
                <span class="expand-hint">${p.demo ? 'try it live →' : 'details →'}</span>
              </div>`;
        card.addEventListener('click', () => openModal(idx));
        card.addEventListener('keydown', (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault();
                openModal(idx); } });
        projectGrid.appendChild(card);
    });
    enableTilt();
    applyFilters();

    // ---- Stats counters ----
    function animateStats() {
        const stats = document.querySelectorAll('.stat-number');
        const targets = [
            PROJECTS.length,
            new Set(PROJECTS.flatMap(p => p.tags)).size,
            PROJECTS.filter(p => p.demo).length,
            4,
        ];
        stats.forEach((el, i) => {
            const target = targets[i] || 0;
            let current = 0;
            const step = Math.max(1, Math.ceil(target / 40));
            const iv = setInterval(() => {
                current = Math.min(current + step, target);
                el.textContent = current;
                if (current >= target) clearInterval(iv);
            }, 30);
            el.dataset.count = target;
        });
    }
    const statsObserver = new IntersectionObserver((entries) => {
        entries.forEach(e => { if (e.isIntersecting) { animateStats();
                statsObserver.disconnect(); } });
    }, { threshold: 0.3 });
    const statsRow = document.querySelector('.stats-row');
    if (statsRow) statsObserver.observe(statsRow);

    
    const modalBackdrop = document.getElementById('modalBackdrop');
    const modalBody = document.getElementById('modalBody');
    const modalClose = document.getElementById('modalClose');
    let activeDemoCleanup = null;

    function relatedProjects(p, idx) {
        return PROJECTS.map((q, i) => ({ q, i })).filter(({ q, i }) => i !== idx && q.tags.some(t => p.tags.includes(t)))
            .slice(0, 3);
    }

    function teardownDemo() {
        if (activeDemoCleanup) { try { activeDemoCleanup(); } catch (e) {} activeDemoCleanup = null; }
    }

    function openModal(idx) {
        unlockAchievement('deep_dive');
        teardownDemo();
        const p = PROJECTS[idx];
        const hasDemo = p.demo && DEMOS[p.demo];
        const repoLine = p._repo ?
            `<a href="${p._repo.html_url}" target="_blank" rel="noopener" class="modal-gh-link">View repository · updated ${timeAgo(p._repo.pushed_at)} →</a>` :
            `<a href="${PROFILE.github}" target="_blank" rel="noopener" class="modal-gh-link">See related code on GitHub →</a>`;
        const related = relatedProjects(p, idx);
        const relatedHtml = related.length ?
            `<div class="modal-related"><span class="modal-related-label">Related:</span> ${related.map(({ q, i }) => `<button class="related-chip" data-idx="${i}">${q.title}</button>`).join('')}</div>` :
            '';
        modalBody.classList.toggle('modal-wide', !!hasDemo);
        modalBody.innerHTML = `
              <button class="modal-close" id="modalCloseInner" aria-label="Close">✕</button>
              <div class="tag-row">${p.tags.map(t => `<span class="tag">${tagLabels[t] || t}</span>`).join('') || '<span class="tag">Concept</span>'}</div>
              <h3>${p.title}</h3>
              ${hasDemo ? `
                <div class="modal-tabs" id="modalTabs">
                  <button class="modal-tab active" data-tab="overview">Overview</button>
                  <button class="modal-tab" data-tab="demo">▶ Live demo</button>
                </div>
                <div class="modal-pane active" id="paneOverview">
                  <p>${p.long}</p>
                  <p class="modal-status">Status: ${p.status}</p>
                  ${repoLine}
                  ${relatedHtml}
                </div>
                <div class="modal-pane" id="paneDemo">
                  <div class="demo-stage" id="demoStage"></div>
                </div>` : `
                <p>${p.long}</p>
                <p class="modal-status">Status: ${p.status}</p>
                ${repoLine}
                ${relatedHtml}`}
            `;
        modalBackdrop.classList.add('open');
        document.getElementById('modalCloseInner').addEventListener('click', closeModal);
        modalBody.querySelectorAll('.related-chip').forEach(btn => {
            btn.addEventListener('click', () => openModal(parseInt(btn.dataset.idx, 10)));
        });
        if (hasDemo) {
            const tabs = modalBody.querySelectorAll('.modal-tab');
            const overviewPane = modalBody.querySelector('#paneOverview');
            const demoPane = modalBody.querySelector('#paneDemo');
            let demoBuilt = false;
            tabs.forEach(t => t.addEventListener('click', () => {
                tabs.forEach(x => x.classList.toggle('active', x === t));
                const tab = t.dataset.tab;
                overviewPane.classList.toggle('active', tab === 'overview');
                demoPane.classList.toggle('active', tab === 'demo');
                if (tab === 'demo') {
                    unlockAchievement('demo_runner');
                    sfx.open();
                    if (!demoBuilt) {
                        demoBuilt = true;
                        const stage = modalBody.querySelector('#demoStage');
                        activeDemoCleanup = DEMOS[p.demo].build(stage);
                    }
                }
            }));
        }
        if (history.replaceState) history.replaceState(null, '', '#project-' + projectSlug(p.title));
    }

    function closeModal() {
        modalBackdrop.classList.remove('open');
        teardownDemo();
        if (location.hash.startsWith('#project-') && history.replaceState) {
            history.replaceState(null, '', location.pathname + location.search);
        }
    }
    modalClose.addEventListener('click', closeModal);
    modalBackdrop.addEventListener('click', (e) => { if (e.target === modalBackdrop) closeModal(); });

  
    const timelineEl = document.getElementById('timelineEl');
    const tlProgress = document.getElementById('tlProgress');
    const tlItems = document.querySelectorAll('.tl-item');
    tlItems.forEach((item, i) => {
        const header = item.querySelector('.tl-header');
        const linksWrap = item.querySelector('.tl-links');
        const titles = (item.dataset.projects || '').split('|').map(s => s.trim()).filter(Boolean);
        titles.forEach(title => {
            const pIdx = PROJECTS.findIndex(p => p.title === title);
            if (pIdx === -1) return;
            const chip = document.createElement('button');
            chip.className = 'tl-link-chip';
            chip.textContent = PROJECTS[pIdx].title + ' →';
            chip.addEventListener('click', (e) => {
                e.stopPropagation();
                document.getElementById('work').scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth' });
                setTimeout(() => openModal(pIdx), reduceMotion ? 0 : 450);
            });
            linksWrap.appendChild(chip);
        });
        header.addEventListener('click', () => {
            const isOpen = item.classList.contains('expanded');
            tlItems.forEach(x => {
                x.classList.remove('expanded');
                x.querySelector('.tl-header').setAttribute('aria-expanded', 'false');
            });
            if (!isOpen) { item.classList.add('expanded');
                header.setAttribute('aria-expanded', 'true'); }
        });
    });
    if (tlItems[0]) tlItems[0].classList.add('expanded');

    function updateTimelineProgress() {
        if (!timelineEl || !tlProgress) return;
        const rect = timelineEl.getBoundingClientRect();
        const vh = window.innerHeight;
        const started = (vh * 0.75) - rect.top;
        const pct = Math.max(0, Math.min(1, rect.height ? started / rect.height : 0));
        tlProgress.style.height = (pct * 100) + '%';
        tlItems.forEach(item => {
            const iRect = item.getBoundingClientRect();
            item.classList.toggle('done', (iRect.top + iRect.height / 2) < vh * 0.75);
        });
    }
    window.addEventListener('scroll', updateTimelineProgress, { passive: true });
    window.addEventListener('resize', updateTimelineProgress);
    updateTimelineProgress();

    // ---- Scroll reveal + skill bars ----
    const io = new IntersectionObserver((entries) => {
        entries.forEach(e => {
            if (e.isIntersecting) {
                e.target.classList.add('in');
                if (e.target.id === 'skillsGrid') {
                    document.querySelectorAll('.skill-bar-fill').forEach((bar, i) => {
                        setTimeout(() => { bar.style.width = bar.dataset.level + '%'; }, i * 70);
                    });
                }
                io.unobserve(e.target);
            }
        });
    }, { threshold: 0.12 });
    document.querySelectorAll('[data-reveal]').forEach(el => io.observe(el));

  
    const codeTabs = document.getElementById('codeTabs');
    const codePanes = document.getElementById('codePanes');
    CODE_SAMPLES.forEach((s, i) => {
        const tab = document.createElement('button');
        tab.className = 'code-tab' + (i === 0 ? ' active' : '');
        tab.textContent = s.label;
        tab.addEventListener('click', () => {
            document.querySelectorAll('.code-tab').forEach(t => t.classList.remove('active'));
            document.querySelectorAll('.code-pane').forEach(p => p.classList.remove('active'));
            tab.classList.add('active');
            document.getElementById('pane-' + i).classList.add('active');
        });
        codeTabs.appendChild(tab);
        const pane = document.createElement('div');
        pane.className = 'code-pane' + (i === 0 ? ' active' : '');
        pane.id = 'pane-' + i;
        pane.innerHTML =
            `<pre><code class="language-${s.lang}"></code></pre><p class="code-source">// ${s.file}</p>`;
        pane.querySelector('code').textContent = s.code;
        codePanes.appendChild(pane);
    });
    if (window.hljs) document.querySelectorAll('#codePanes code').forEach(block => hljs.highlightElement(block));

    
    const sqlInput = document.getElementById('sqlInput');
    const sqlRunBtn = document.getElementById('sqlRunBtn');
    const sqlResults = document.getElementById('sqlResults');
    const sqlStatus = document.getElementById('sqlStatus');
    const sqlPresets = document.getElementById('sqlPresets');
    const csvBtn = document.getElementById('csvBtn');
    let db = null;
    let lastResult = null;
    const PRESET_QUERIES = [
        { label: 'All projects', sql: "SELECT title, status FROM projects;" },
        { label: 'Python projects', sql: "SELECT title FROM projects WHERE tags LIKE '%python%';" },
        { label: 'Count by language', sql: "SELECT tags, COUNT(*) as uses FROM projects GROUP BY tags ORDER BY uses DESC;" },
        { label: 'Shipped only', sql: "SELECT title, status FROM projects WHERE status NOT LIKE '%design%';" },
        { label: 'In progress', sql: "SELECT title, status FROM projects WHERE status LIKE '%design%' OR status LIKE '%progress%';" },
    ];
    PRESET_QUERIES.forEach(p => {
        const btn = document.createElement('button');
        btn.className = 'sql-preset';
        btn.textContent = p.label;
        btn.addEventListener('click', () => { sqlInput.value = p.sql;
            runQuery();
            unlockAchievement('sql_runner'); });
        sqlPresets.appendChild(btn);
    });

    function renderResults(result) {
        if (!result || !result.length) {
            sqlResults.innerHTML = '<p class="sql-error">Query ran, but returned no rows.</p>';
            csvBtn.style.display = 'none';
            lastResult = null;
            return;
        }
        const { columns, values } = result[0];
        lastResult = { columns, values };
        let html =
            '<table class="sql-table"><thead><tr>' + columns.map(c => `<th>${c}</th>`).join('') + '</tr></thead><tbody>';
        values.forEach(row => { html += '<tr>' + row.map(v => `<td>${v === null ? 'null' : v}</td>`).join('') + '</tr>'; });
        html += '</tbody></table>';
        sqlResults.innerHTML = html;
        csvBtn.style.display = 'inline-block';
    }

    function runQuery() {
        if (!db) { sqlStatus.textContent = 'SQLite is still loading — try again in a moment.'; return; }
        try {
            const result = db.exec(sqlInput.value);
            renderResults(result);
            sqlStatus.innerHTML = 'Query executed successfully.';
            sqlStatus.appendChild(csvBtn);
        } catch (err) {
            sqlResults.innerHTML = `<p class="sql-error">${err.message}</p>`;
            sqlStatus.textContent = 'Query failed — see error above.';
            csvBtn.style.display = 'none';
        }
    }
    sqlRunBtn.addEventListener('click', () => { runQuery();
        unlockAchievement('sql_runner'); });
    sqlInput.addEventListener('keydown', (e) => { if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) { runQuery();
            unlockAchievement('sql_runner'); } });
    csvBtn.addEventListener('click', () => {
        if (!lastResult) return;
        const { columns, values } = lastResult;
        const csv = [columns.join(',')].concat(values.map(r => r.map(v => `"${String(v).replace(/"/g,'""')}"`).join(
            ','))).join('\n');
        const blob = new Blob([csv], { type: 'text/csv' });
        const a = document.createElement('a');
        a.href = URL.createObjectURL(blob);
        a.download = 'query-results.csv';
        a.click();
        showToast('CSV downloaded ✓');
    });
    if (window.initSqlJs) {
        initSqlJs({ locateFile: file => `https://cdnjs.cloudflare.com/ajax/libs/sql.js/1.8.0/${file}` })
            .then(SQL => {
                db = new SQL.Database();
                db.run("CREATE TABLE projects (title TEXT, status TEXT, tags TEXT);");
                const stmt = db.prepare("INSERT INTO projects VALUES (?, ?, ?);");
                PROJECTS.forEach(p => stmt.run([p.title, p.status, p.tags.join(',') || 'concept']));
                stmt.free();
                sqlStatus.textContent = 'SQLite ready — try a preset or write your own query.';
                sqlStatus.appendChild(csvBtn);
                runQuery();
            })
            .catch(() => { sqlStatus.textContent = 'Could not load SQLite from the CDN — check your connection.'; });
    } else {
        sqlStatus.textContent = 'Could not load SQLite from the CDN — check your connection.';
    }

   
    const copyBtn = document.getElementById('copyEmailBtn');
    const copyFeedback = document.getElementById('copyFeedback');
    copyBtn.addEventListener('click', async () => {
        try {
            await navigator.clipboard.writeText(PROFILE.email);
            copyFeedback.classList.add('show');
            showToast('Email copied to clipboard ✓');
            unlockAchievement('networker');
            setTimeout(() => copyFeedback.classList.remove('show'), 2000);
        } catch (err) {
            window.location.href = 'mailto:' + PROFILE.email;
        }
    });

    
    const statusLine = document.getElementById('statusLine');
    const loadTime = Date.now();

    function updateStatus() {
        const now = new Date();
        const time = now.toLocaleTimeString('en-PH', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
        const upSec = Math.floor((Date.now() - loadTime) / 1000);
        const m = String(Math.floor(upSec / 60)).padStart(2, '0');
        const s = String(upSec % 60).padStart(2, '0');
        statusLine.textContent = `local time ${time} · session uptime ${m}:${s}`;
    }
    updateStatus();
    setInterval(updateStatus, 1000);

    
    const cmdkBackdrop = document.getElementById('cmdk-backdrop');
    const cmdkInput = document.getElementById('cmdk-input');
    const cmdkList = document.getElementById('cmdk-list');
    const CMDK_ACTIONS = [
        { label: 'Go to Home', tag: 'nav', run: () => scrollToId('hero') },
        { label: 'Go to About', tag: 'nav', run: () => scrollToId('about') },
        { label: 'Go to Skills', tag: 'nav', run: () => scrollToId('skills') },
        { label: 'Go to Work', tag: 'nav', run: () => scrollToId('work') },
        { label: 'Go to Timeline', tag: 'nav', run: () => scrollToId('timeline') },
        { label: 'Go to Code', tag: 'nav', run: () => scrollToId('underhood') },
        { label: 'Go to Contact', tag: 'nav', run: () => scrollToId('contact') },
        { label: 'Copy email', tag: 'action', run: () => copyBtn.click() },
        { label: 'Toggle background animation', tag: 'action', run: () => document.getElementById('bgToggle').click() },
        { label: 'Theme: Amber', tag: 'theme', run: () => setTheme('') },
        { label: 'Theme: Teal', tag: 'theme', run: () => setTheme('theme-teal') },
        { label: 'Theme: Violet', tag: 'theme', run: () => setTheme('theme-violet') },
        { label: 'Theme: Rose', tag: 'theme', run: () => setTheme('theme-rose') },
    ];
    let cmdkSelected = 0;

    function scrollToId(id) { document.getElementById(id)?.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth' }); }

    function renderCmdk(filter) {
        const q = (filter || '').toLowerCase();
        const filtered = CMDK_ACTIONS.filter(a => a.label.toLowerCase().includes(q));
        cmdkList.innerHTML = '';
        filtered.forEach((a, i) => {
            const item = document.createElement('div');
            item.className = 'cmdk-item' + (i === cmdkSelected ? ' selected' : '');
            item.innerHTML = `<span>${a.label}</span><span class="tag">${a.tag}</span>`;
            item.addEventListener('click', () => { a.run();
                closeCmdk(); });
            cmdkList.appendChild(item);
        });
        cmdkList.dataset.count = filtered.length;
        return filtered;
    }

    function openCmdk() {
        cmdkBackdrop.classList.add('open');
        cmdkInput.value = '';
        cmdkSelected = 0;
        renderCmdk('');
        setTimeout(() => cmdkInput.focus(), 10);
        unlockAchievement('palette');
        sfx.open();
    }

    function closeCmdk() { cmdkBackdrop.classList.remove('open'); }
    document.getElementById('cmdkOpenBtn').addEventListener('click', openCmdk);
    window.addEventListener('keydown', (e) => {
        const typing = ['INPUT', 'TEXTAREA'].includes(document.activeElement.tagName);
        if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') { e.preventDefault();
            openCmdk(); } else if (e.key === 'Escape') { closeCmdk();
            closeModal();
            closeNavDrawer();
            achvBackdrop.classList.remove('open');
            shortcutsBackdrop.classList.remove('open'); } else if (e.key === '/' && !typing) { e.preventDefault();
            projectSearch.focus();
            projectSearch.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'center' }); } else if (e
            .key === '?' && !typing) { e.preventDefault();
            openShortcuts(); }
    });
    cmdkInput.addEventListener('input', () => { cmdkSelected = 0;
        renderCmdk(cmdkInput.value); });
    cmdkInput.addEventListener('keydown', (e) => {
        const filtered = renderCmdk(cmdkInput.value);
        if (e.key === 'ArrowDown') { e.preventDefault();
            cmdkSelected = Math.min(cmdkSelected + 1, filtered.length - 1);
            renderCmdk(cmdkInput.value); } else if (e.key === 'ArrowUp') { e.preventDefault();
            cmdkSelected = Math.max(cmdkSelected - 1, 0);
            renderCmdk(cmdkInput.value); } else if (e.key === 'Enter') { if (filtered[cmdkSelected]) { filtered[cmdkSelected]
                    .run();
                closeCmdk(); } }
    });
    cmdkBackdrop.addEventListener('click', (e) => { if (e.target === cmdkBackdrop) closeCmdk(); });

    
    (function konami() {
        const seq = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight',
            'b', 'a'
        ];
        let pos = 0;
        window.addEventListener('keydown', (e) => {
            const key = e.key.length === 1 ? e.key.toLowerCase() : e.key;
            if (key === seq[pos]) { pos++; if (pos === seq.length) { pos = 0;
                    triggerMatrixRain();
                    unlockAchievement('konami'); } } else { pos = (key === seq[0]) ? 1 : 0; }
        });
    })();

    function triggerMatrixRain() {
        showToast('Konami code activated — enjoy.');
        const c = document.createElement('canvas');
        c.style.position = 'fixed';
        c.style.inset = '0';
        c.style.zIndex = '600';
        c.style.pointerEvents = 'none';
        document.body.appendChild(c);
        const gctx = c.getContext('2d');
        c.width = window.innerWidth;
        c.height = window.innerHeight;
        const chars = '01アイウエオカキクケコ<>{}/;'.split('');
        const cols = Math.floor(c.width / 16);
        const drops = new Array(cols).fill(0);
        let frames = 0;
        const maxFrames = reduceMotion ? 1 : 260;

        function draw() {
            gctx.fillStyle = 'rgba(11,15,20,0.15)';
            gctx.fillRect(0, 0, c.width, c.height);
            gctx.fillStyle = 'rgba(79,184,168,0.85)';
            gctx.font = '14px monospace';
            drops.forEach((y, i) => {
                const ch = chars[Math.floor(Math.random() * chars.length)];
                gctx.fillText(ch, i * 16, y * 16);
                drops[i] = (y * 16 > c.height && Math.random() > 0.975) ? 0 : y + 1;
            });
            frames++;
            if (frames < maxFrames) requestAnimationFrame(draw);
            else { c.style.transition = 'opacity .6s ease';
                c.style.opacity = '0';
                setTimeout(() => c.remove(), 650); }
        }
        draw();
    }

    
    const canvas = document.getElementById('bg-canvas');
    const ctx = canvas.getContext('2d');
    const bgToggle = document.getElementById('bgToggle');
    let animOn = !reduceMotion;
    bgToggle.classList.toggle('on', animOn);
    bgToggle.setAttribute('aria-pressed', String(animOn));
    let W, H,
        nodes = [];
    const NODE_COUNT_BASE = 65;
    const mouse = { x: -9999, y: -9999, tx: -9999, ty: -9999 };
    let bursts = [];

    function accentRGB() {
        const styles = getComputedStyle(document.body);
        return { a: styles.getPropertyValue('--accent').trim(), a2: styles.getPropertyValue('--accent-2').trim() };
    }

    function hexToRgb(hex) {
        hex = hex.replace('#', '');
        const n = parseInt(hex, 16);
        return `${(n>>16)&255},${(n>>8)&255},${n&255}`;
    }

    function resize() {
        W = canvas.width = window.innerWidth;
        H = canvas.height = window.innerHeight;
        const isMobile = W < 640;
        const count = Math.min(isMobile ? 24 : NODE_COUNT_BASE, Math.floor((W * H) / 20000));
        nodes = Array.from({ length: count }, () => ({
            x: Math.random() * W,
            y: Math.random() * H,
            vx: (Math.random() - 0.5) * 0.22,
            vy: (Math.random() - 0.5) * 0.22,
            bx: 0,
            by: 0,
            depth: Math.random() * 0.6 + 0.4,
        }));
    }
    window.addEventListener('resize', resize);
    window.addEventListener('mousemove', (e) => { mouse.tx = e.clientX;
        mouse.ty = e.clientY; });
    window.addEventListener('mouseleave', () => { mouse.tx = -9999;
        mouse.ty = -9999; });
    window.addEventListener('touchmove', (e) => {
        if (!e.touches.length) return;
        mouse.tx = e.touches[0].clientX;
        mouse.ty = e.touches[0].clientY;
    }, { passive: true });
    window.addEventListener('touchend', () => { mouse.tx = -9999;
        mouse.ty = -9999; }, { passive: true });

    function spawnBurst(x, y) {
        if (reduceMotion || !animOn) return;
        bursts.push({ x, y, t0: performance.now() });
        nodes.forEach(n => {
            const dx = n.x - x,
                dy = n.y - y;
            const d = Math.sqrt(dx * dx + dy * dy);
            if (d < 160 && d > 0.01) {
                const force = (1 - d / 160) * 1.8;
                n.bx += (dx / d) * force;
                n.by += (dy / d) * force;
            }
        });
    }
    window.addEventListener('click', (e) => {
        if (e.target.closest('button, a, input, textarea, select')) return;
        spawnBurst(e.clientX, e.clientY);
    });
    window.addEventListener('touchstart', (e) => {
        if (e.target.closest('button, a, input, textarea, select')) return;
        if (!e.touches.length) return;
        mouse.tx = e.touches[0].clientX;
        mouse.ty = e.touches[0].clientY;
        spawnBurst(e.touches[0].clientX, e.touches[0].clientY);
    }, { passive: true });

    
    const orb1 = document.querySelector('.orb-1');
    const orb2 = document.querySelector('.orb-2');
    let parX = 0,
        parY = 0,
        parTX = 0,
        parTY = 0;
    if (!reduceMotion) {
        window.addEventListener('mousemove', (e) => {
            parTX = (e.clientX / window.innerWidth - 0.5) * 40;
            parTY = (e.clientY / window.innerHeight - 0.5) * 40;
        });
        window.addEventListener('touchmove', (e) => {
            if (!e.touches.length) return;
            parTX = (e.touches[0].clientX / window.innerWidth - 0.5) * 30;
            parTY = (e.touches[0].clientY / window.innerHeight - 0.5) * 30;
        }, { passive: true });
        if (window.DeviceOrientationEvent && window.matchMedia('(pointer:coarse)').matches) {
            window.addEventListener('deviceorientation', (e) => {
                if (e.beta === null) return;
                parTX = Math.max(-20, Math.min(20, (e.gamma || 0) * 0.8));
                parTY = Math.max(-20, Math.min(20, ((e.beta || 0) - 45) * 0.4));
            });
        }

        function parallaxLoop() {
            parX += (parTX - parX) * 0.06;
            parY += (parTY - parY) * 0.06;
            if (orb1) { orb1.style.setProperty('--px', parX.toFixed(1) + 'px');
                orb1.style.setProperty('--py', parY.toFixed(1) + 'px'); }
            if (orb2) { orb2.style.setProperty('--px', (-parX * 0.7).toFixed(1) + 'px');
                orb2.style.setProperty('--py', (-parY * 0.7).toFixed(1) + 'px'); }
            requestAnimationFrame(parallaxLoop);
        }
        parallaxLoop();
    }

    function drawFrame() {
        mouse.x += (mouse.tx - mouse.x) * 0.12;
        mouse.y += (mouse.ty - mouse.y) * 0.12;
        ctx.clearRect(0, 0, W, H);
        const linkDist = 140,
            mouseDist = 190;
        const { a, a2 } = accentRGB();
        const accentRgb = hexToRgb(a),
            accent2Rgb = hexToRgb(a2);
        nodes.forEach(n => {
            n.x += (n.vx + n.bx) * n.depth;
            n.y += (n.vy + n.by) * n.depth;
            if (n.x < 0 || n.x > W) n.vx *= -1;
            if (n.y < 0 || n.y > H) n.vy *= -1;
            n.bx *= 0.94;
            n.by *= 0.94;
        });
        for (let i = 0; i < nodes.length; i++) {
            for (let j = i + 1; j < nodes.length; j++) {
                const A = nodes[i],
                    B = nodes[j];
                const dx = A.x - B.x,
                    dy = A.y - B.y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < linkDist) {
                    ctx.strokeStyle = `rgba(${accent2Rgb},${0.14 * (1 - dist/linkDist)})`;
                    ctx.lineWidth = 1;
                    ctx.beginPath();
                    ctx.moveTo(A.x, A.y);
                    ctx.lineTo(B.x, B.y);
                    ctx.stroke();
                }
            }
            const dmx = nodes[i].x - mouse.x,
                dmy = nodes[i].y - mouse.y;
            const mdist = Math.sqrt(dmx * dmx + dmy * dmy);
            if (mdist < mouseDist) {
                ctx.strokeStyle = `rgba(${accentRgb},${0.35 * (1 - mdist/mouseDist)})`;
                ctx.lineWidth = 1;
                ctx.beginPath();
                ctx.moveTo(nodes[i].x, nodes[i].y);
                ctx.lineTo(mouse.x, mouse.y);
                ctx.stroke();
            }
        }
        nodes.forEach(n => {
            const dmx = n.x - mouse.x,
                dmy = n.y - mouse.y;
            const mdist = Math.sqrt(dmx * dmx + dmy * dmy);
            const near = mdist < mouseDist;
            ctx.fillStyle = near ? `rgba(${accentRgb},0.85)` : `rgba(139,151,166,${0.35 + n.depth*0.25})`;
            ctx.beginPath();
            ctx.arc(n.x, n.y, near ? 2.4 : 1.5 * n.depth + 0.6, 0, Math.PI * 2);
            ctx.fill();
        });
        const now = performance.now();
        bursts = bursts.filter(b => now - b.t0 < 900);
        bursts.forEach(b => {
            const t = (now - b.t0) / 900;
            const r = t * 130;
            ctx.beginPath();
            ctx.strokeStyle = `rgba(${accentRgb},${(1-t)*0.5})`;
            ctx.lineWidth = 1.4;
            ctx.arc(b.x, b.y, r, 0, Math.PI * 2);
            ctx.stroke();
        });
    }
    let rafId = null;

    function loop() { drawFrame();
        rafId = requestAnimationFrame(loop); }

    function startAnim() { if (!rafId) { resize();
            loop(); } }

    function stopAnim() { if (rafId) { cancelAnimationFrame(rafId);
            rafId = null;
            ctx.clearRect(0, 0, W, H); } }
    resize();
    if (animOn) startAnim();
    bgToggle.addEventListener('click', () => {
        animOn = !animOn;
        bgToggle.classList.toggle('on', animOn);
        bgToggle.setAttribute('aria-pressed', String(animOn));
        if (animOn) startAnim();
        else stopAnim();
    });

    
    let currentLang = 'en';

    function applyLang(lang) {
        currentLang = lang;
        const dict = TRANSLATIONS[lang] || TRANSLATIONS.en;
        document.querySelectorAll('[data-i18n]').forEach(el => {
            const key = el.dataset.i18n;
            if (dict[key]) {
                el.textContent = dict[key];
                if (el.classList.contains('glitch-title')) el.dataset.text = dict[key];
            }
        });
        document.getElementById('langToggleBtn').textContent = lang.toUpperCase();
        document.documentElement.lang = lang === 'fil' ? 'fil' : 'en';
    }
    document.getElementById('langToggleBtn').addEventListener('click', () => {
        applyLang(currentLang === 'en' ? 'fil' : 'en');
        unlockAchievement('linguist');
        showToast(currentLang === 'fil' ? 'Nagpalit sa Filipino ✓' : 'Switched to English ✓');
    });
    applyLang('en');

    // ---- GitHub ----
    function timeAgo(iso) {
        const s = Math.floor((Date.now() - new Date(iso)) / 1000);
        const units = [
            [31536000, 'y'],
            [2592000, 'mo'],
            [86400, 'd'],
            [3600, 'h'],
            [60, 'm']
        ];
        for (const [secs, label] of units) { if (s >= secs) return Math.floor(s / secs) + label + ' ago'; }
        return 'just now';
    }

    async function loadGithubActivity() {
        const panel = document.getElementById('ghPanel');
        const username = (PROFILE.githubUsername || '').trim();
        if (!username) return;
        panel.innerHTML = '<p class="gh-loading">Fetching live GitHub data…</p>';
        try {
            const [userRes, reposRes] = await Promise.all([
                fetch(`https://api.github.com/users/${encodeURIComponent(username)}`),
                fetch(`https://api.github.com/users/${encodeURIComponent(username)}/repos?sort=updated&per_page=3`),
            ]);
            if (!userRes.ok) throw new Error(userRes.status === 404 ? 'GitHub user not found.' :
                'GitHub API request failed.');
            const user = await userRes.json();
            const repos = reposRes.ok ? await reposRes.json() : [];
            panel.innerHTML = `
                <div class="gh-header">
                  <img class="gh-avatar" src="${user.avatar_url}" alt="${user.login}">
                  <div>
                    <div class="gh-name">@${user.login}</div>
                    <div class="gh-bio">${user.bio || 'No bio set on GitHub yet.'}</div>
                  </div>
                  <div class="gh-stats">
                    <div class="gh-stat"><div class="n">${user.public_repos}</div><div class="l">Repos</div></div>
                    <div class="gh-stat"><div class="n">${user.followers}</div><div class="l">Followers</div></div>
                  </div>
                </div>
                <div class="gh-repos">
                  ${repos.length ? repos.map(r => `
                    <div class="gh-repo">
                      <a class="rn" href="${r.html_url}" target="_blank" rel="noopener">${r.name}</a>
                      <div class="rd">${r.description || 'No description.'}</div>
                      <div class="rm"><span>★ ${r.stargazers_count}</span><span>${r.language || '—'}</span><span>${timeAgo(r.updated_at)}</span></div>
                    </div>`).join('') : '<p class="gh-empty">No public repositories yet.</p>'}
                </div>`;
            unlockAchievement('github_view');
        } catch (err) {
            panel.innerHTML =
                `<p class="gh-empty">Couldn't load live GitHub data (${err.message}). Check the username in data.js or your connection.</p>`;
        }
    }
    new IntersectionObserver((entries, obs) => {
        entries.forEach(e => { if (e.isIntersecting) { loadGithubActivity();
                obs.disconnect(); } });
    }, { threshold: 0.2 }).observe(document.getElementById('github-activity'));

    
    let allUserRepos = [];

    function repoKey(s) { return (s || '').toLowerCase().replace(/[^a-z0-9]+/g, ''); }

    function findMatchingRepo(title) {
        const target = repoKey(title);
        if (!target) return null;
        return allUserRepos.find(r => {
            const name = repoKey(r.name);
            return name === target || name.includes(target) || target.includes(name);
        }) || null;
    }

    async function loadAllRepos() {
        const username = (PROFILE.githubUsername || '').trim();
        if (!username) return;
        try {
            const res = await fetch(
                `https://api.github.com/users/${encodeURIComponent(username)}/repos?per_page=100&sort=updated`);
            if (!res.ok) return;
            allUserRepos = await res.json();
            applyRepoMatches();
        } catch (err) { /* enhancement only */ }
    }

    function applyRepoMatches() {
        PROJECTS.forEach((p, idx) => {
            const repo = findMatchingRepo(p.title);
            if (!repo) return;
            p._repo = repo;
            const card = document.querySelector(`.project-card[data-idx="${idx}"]`);
            if (card && !card.querySelector('.repo-badge')) {
                const badge = document.createElement('a');
                badge.className = 'repo-badge';
                badge.href = repo.html_url;
                badge.target = '_blank';
                badge.rel = 'noopener';
                badge.textContent = `⌁ synced · updated ${timeAgo(repo.pushed_at)}`;
                badge.addEventListener('click', (e) => e.stopPropagation());
                card.querySelector('.project-status').insertAdjacentElement('beforebegin', badge);
            }
        });
    }
    loadAllRepos();

    
    const contactForm = document.getElementById('contactForm');
    const cfStatus = document.getElementById('cf-status');
    const cfStatusIcon = document.getElementById('cfStatusIcon');
    const cfStatusText = document.getElementById('cfStatusText');
    const cfSubmit = document.getElementById('cf-submit');
    const FS_ICONS = {
        check: '<svg viewBox="0 0 24 24"><path class="fs-check" d="M4 12.5l5.5 5.5L20 6"/></svg>',
        x: '<svg viewBox="0 0 24 24"><path class="fs-x" d="M6 6l12 12M18 6L6 18"/></svg>',
    };

    function setFormStatus(state, text) {
        cfStatus.classList.remove('show', 'error', 'pending');
        cfStatusText.textContent = text;
        cfStatusIcon.innerHTML = state === 'success' ? FS_ICONS.check : state === 'error' ? FS_ICONS.x : '';
        void cfStatus.offsetWidth;
        cfStatus.classList.add('show');
        if (state === 'pending') cfStatus.classList.add('pending');
        if (state === 'error') cfStatus.classList.add('error');
    }

    function validateField(input, errEl, rule) {
        const value = input.value.trim();
        const ok = rule(value);
        input.classList.toggle('invalid', !ok);
        errEl.textContent = ok ? '' : (input.type === 'email' ? 'Enter a valid email address.' :
            'This field is required.');
        return ok;
    }
    contactForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const name = document.getElementById('cf-name');
        const email = document.getElementById('cf-email');
        const message = document.getElementById('cf-message');
        const okName = validateField(name, document.getElementById('err-name'), v => v.length > 1);
        const okEmail = validateField(email, document.getElementById('err-email'), v =>
            /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v));
        const okMsg = validateField(message, document.getElementById('err-message'), v => v.length > 5);
        if (!(okName && okEmail && okMsg)) return;
        cfSubmit.disabled = true;
        if (PROFILE.formEndpoint) {
            setFormStatus('pending', 'Sending…');
            try {
                const res = await fetch(PROFILE.formEndpoint, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
                    body: JSON.stringify({ name: name.value.trim(), email: email.value.trim(),
                        message: message.value.trim() }),
                });
                if (!res.ok) throw new Error('Send failed');
                setFormStatus('success', 'Message sent — thanks, I\'ll get back to you soon.');
                unlockAchievement('transmitter');
                contactForm.reset();
            } catch (err) {
                setFormStatus('error', 'Could not send automatically — opening your email app instead.');
                openMailtoFallback(name.value, email.value, message.value);
            }
        } else {
            openMailtoFallback(name.value, email.value, message.value);
            setFormStatus('success', 'Opening your email app with this message pre-filled…');
            unlockAchievement('transmitter');
        }
        cfSubmit.disabled = false;
    });

    function openMailtoFallback(name, email, message) {
        const subject = encodeURIComponent(`Project inquiry from ${name}`);
        const body = encodeURIComponent(`${message}\n\n— ${name} (${email})`);
        window.location.href = `mailto:${PROFILE.email}?subject=${subject}&body=${body}`;
    }

    // ---- Open project from hash ----
    if (location.hash.startsWith('#project-')) {
        const slug = location.hash.replace('#project-', '');
        const idx = PROJECTS.findIndex(p => projectSlug(p.title) === slug);
        if (idx > -1) setTimeout(() => openModal(idx), reduceMotion ? 0 : 500);
    }

   
    function setupTilt(el, opts = {}) {
        if (!el || reduceMotion || !window.matchMedia('(pointer:fine)').matches) return;
        const strength = opts.strength || 0.08;
        const maxDeg = opts.maxDeg || 0.02;
        let x = 0, y = 0, tx = 0, ty = 0, active = false;
        const loop = () => {
            x += (tx - x) * strength;
            y += (ty - y) * strength;
            el.style.transform = `perspective(600px) rotateX(${-y * maxDeg}deg) rotateY(${x * maxDeg}deg)`;
            requestAnimationFrame(loop);
        };
        window.addEventListener('mousemove', (e) => {
            const rect = el.getBoundingClientRect();
            const cx = rect.left + rect.width / 2;
            const cy = rect.top + rect.height / 2;
            const dist = Math.hypot(e.clientX - cx, e.clientY - cy);
           
            active = dist < rect.width * 2.4;
            if (active) {
                tx = (e.clientX - cx) * strength;
                ty = (e.clientY - cy) * strength;
            } else {
                tx = 0;
                ty = 0;
            }
        });
        loop();
    }
    setupTilt(document.getElementById('profileAvatar'));
    setupTilt(document.getElementById('tlpFrame'), { strength: 0.1, maxDeg: 0.035 });

    console.log(
        `🚀 ${PROFILE.handle}.dev — ${PROJECTS.length} projects, ${SKILLS.length} skills, ${Object.keys(DEMOS).length} live demos`
        );
})();
