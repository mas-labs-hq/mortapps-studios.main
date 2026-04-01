/**
 * ============================================================================
 * TASKFLOW PRO - CORE LOGIC v3.2.1
 * ============================================================================
 * Privacy-first • Local-only • PWA-enabled • Gamified • Auto-updating
 * By MortApps Studios
 * 
 * 📋 QUICK REFERENCE:
 * - Change CACHE_VERSION in sw.js to force PWA updates
 * - All app data stored in localStorage (no cloud sync)
 * - Keyboard shortcuts: N=new task, /=search, Ctrl+S=export, Esc=close
 * 
 * 🔧 DEVELOPER NOTES:
 * - Edit UIManager for UI changes
 * - Edit StateManager for business logic
 * - Edit AccountManager for profile features
 * - Test PWA updates by incrementing CACHE_VERSION in sw.js
 * ============================================================================
 */

// ============================================
// ⚙️ UTILITIES
// ============================================
const debounce = (func, wait) => {
    let timeout;
    return function executedFunction(...args) {
        const later = () => { clearTimeout(timeout); func(...args); };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
};

const escapeHtml = (text) => {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
};

// ============================================
// 🔐 CODE PROTECTION
// ============================================
document.addEventListener('contextmenu', (e) => e.preventDefault());
document.addEventListener('keydown', (e) => {
    const blocked = e.key === 'F12' || 
        (e.ctrlKey && e.shiftKey && ['I','J','C'].includes(e.key.toUpperCase())) ||
        (e.ctrlKey && e.key.toLowerCase() === 'u') ||
        (e.metaKey && e.altKey && e.key.toLowerCase() === 'i');
    if (blocked) { e.preventDefault(); showProtectionWarning(); return false; }
});

let devtools = /./;
devtools.toString = function() { showProtectionWarning(); return ''; };
console.log(devtools);

function showProtectionWarning() {
    const overlay = document.getElementById('protectionOverlay');
    if (overlay && !overlay.classList.contains('active')) overlay.classList.add('active');
}

document.getElementById('protectionAcknowledge')?.addEventListener('click', () => {
    document.getElementById('protectionOverlay').classList.remove('active');
    startLoadingSequence();
});

// ============================================
// 🔄 APP FLOW
// ============================================
function startLoadingSequence() {
    const loading = document.getElementById('loadingScreen');
    loading.style.display = 'flex';
    setTimeout(() => {
        loading.classList.add('hidden');
        setTimeout(() => { loading.style.display = 'none'; showApp(); }, 400);
    }, 2500);
}

function showApp() {
    const app = document.getElementById('app');
    app.classList.add('app-visible');
    initApp();
    registerServiceWorker();
    setupPWAInstall();
    setTimeout(() => {
        if (window.ui && !window.ui.accountManager?.isAuthenticated()) window.ui.openAccountModal();
    }, 500);
}

// ============================================
// 📱 PWA INSTALL - FIXED FOR SUBDIRECTORY + RELIABLE DETECTION
// ============================================
function setupPWAInstall() {
    let deferredPrompt = null;
    const installBtn = document.getElementById('installBtn');
    const installText = document.getElementById('installText');
    const installModal = document.getElementById('installModal');
    
    // ============================================
    // 🔍 RELIABLE INSTALL STATUS DETECTION
    // ============================================
    function checkInstallStatus() {
        const isStandalone = window.matchMedia('(display-mode: standalone)').matches;
        const isIOSStandalone = window.navigator.standalone === true;
        const wasInstalled = localStorage.getItem('taskflow_installed') === 'true';
        const noURLBar = window.innerHeight === window.screen.height;
        return isStandalone || isIOSStandalone || wasInstalled || noURLBar;
    }
    
    function updateInstallButton() {
        const installed = checkInstallStatus();
        if (installed) {
            installText.textContent = 'Installed';
            installBtn.disabled = true;
            installBtn.style.opacity = '0.7';
            installBtn.title = 'App is already installed';
            localStorage.setItem('taskflow_installed', 'true');
        } else {
            installText.textContent = 'Install';
            installBtn.disabled = false;
            installBtn.style.opacity = '1';
            installBtn.title = 'Install TaskFlow Pro';
        }
    }
    
    updateInstallButton();
    setTimeout(updateInstallButton, 1000);
    
    // ============================================
    // 📥 CAPTURE INSTALL PROMPT
    // ============================================
    window.addEventListener('beforeinstallprompt', (e) => {
        e.preventDefault();
        deferredPrompt = e;
        if (!checkInstallStatus()) {
            installBtn.style.display = 'inline-flex';
            updateInstallButton();
        }
        console.log('[PWA] Install prompt captured');
    });
    
    // ============================================
    // ✅ HANDLE SUCCESSFUL INSTALL
    // ============================================
    window.addEventListener('appinstalled', () => {
        localStorage.setItem('taskflow_installed', 'true');
        updateInstallButton();
        showToast('TaskFlow Pro installed! 🎉');
        console.log('[PWA] App installed successfully');
    });
    
    // ============================================
    // 🖱️ INSTALL BUTTON CLICK HANDLER
    // ============================================
    installBtn.addEventListener('click', async () => {
        if (checkInstallStatus()) {
            showToast('Software already installed', false, 2500);
            return;
        }
        
        if (deferredPrompt) {
            try {
                installText.textContent = 'Installing...';
                installBtn.disabled = true;
                deferredPrompt.prompt();
                const { outcome } = await deferredPrompt.userChoice;
                if (outcome === 'accepted') {
                    console.log('[PWA] User accepted install');
                    localStorage.setItem('taskflow_installed', 'true');
                    updateInstallButton();
                } else {
                    console.log('[PWA] User dismissed install');
                    openInstallModal();
                }
                deferredPrompt = null;
            } catch (err) {
                console.error('[PWA] Install error:', err);
                openInstallModal();
            }
        } else {
            console.log('[PWA] No install prompt - showing manual guide');
            openInstallModal();
        }
    });
    
    // ============================================
    // 📋 INSTALL FALLBACK MODAL
    // ============================================
    function openInstallModal() {
        if (installModal) installModal.classList.add('active');
    }
    
    installModal?.querySelector('.close-modal')?.addEventListener('click', () => {
        installModal.classList.remove('active');
    });
    
    installModal?.querySelector('#installConfirmBtn')?.addEventListener('click', () => {
        installModal.classList.remove('active');
        localStorage.setItem('taskflow_installed', 'true');
        updateInstallButton();
        showToast('Thanks for installing! ✨');
    });
    
    window.addEventListener('click', (e) => {
        if (e.target === installModal) installModal.classList.remove('active');
    });
    
    // ============================================
    // 🔄 AUTO-UPDATE CHECK
    // ============================================
    if ('serviceWorker' in navigator) {
        setInterval(() => {
            navigator.serviceWorker.getRegistration().then(reg => reg?.update());
        }, 60 * 60 * 1000);
        
        navigator.serviceWorker.addEventListener('message', (event) => {
            if (event.data?.type === 'SW_UPDATED') {
                console.log('[SW] Update available:', event.data.version);
                showToast('Update available! Refreshing...', false, 2000);
                setTimeout(() => window.location.reload(), 2000);
            }
        });
    }
}

// ============================================
// 🚀 APP INITIALIZATION
// ============================================
function initApp() {
    
    // 👤 ACCOUNT MANAGER
    class AccountManager {
        constructor() {
            this.accountKey = 'taskFlowAccount';
            this.dataKey = 'taskFlowData';
            this.account = this.loadAccount();
        }
        loadAccount() { const d = localStorage.getItem(this.accountKey); return d ? JSON.parse(d) : null; }
        createAccount(name, email = '', role = '') {
            this.account = { id: Date.now(), name: name.trim(), email: email.trim(), role, createdAt: new Date().toISOString(), avatar: this.generateAvatar(name) };
            this.saveAccount(); return this.account;
        }
        generateAvatar(name) { const i = name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0,2); return i || '👤'; }
        saveAccount() { if (this.account) localStorage.setItem(this.accountKey, JSON.stringify(this.account)); }
        updateAccount(updates) { this.account = { ...this.account, ...updates }; this.saveAccount(); }
        deleteAccount() { localStorage.removeItem(this.accountKey); this.account = null; }
        exportBackup(tasks) { return { version: '3.2.1', exportedAt: new Date().toISOString(), account: this.account, tasks, meta: { app: 'TaskFlow Pro', origin: window.location.origin } }; }
        importBackup(data) { if (!data.account || !Array.isArray(data.tasks)) throw new Error('Invalid backup'); this.account = data.account; this.saveAccount(); return data.tasks; }
        isAuthenticated() { return this.account !== null; }
    }

    // 💾 STORAGE MANAGER
    class StorageManager {
        constructor(key = 'taskFlowData') { this.key = key; }
        save(data) { localStorage.setItem(this.key, JSON.stringify(data)); }
        load() { const d = localStorage.getItem(this.key); return d ? JSON.parse(d) : []; }
        export(data) {
            const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
            const url = URL.createObjectURL(blob); const a = document.createElement('a');
            a.href = url; a.download = `taskflow-backup-${new Date().toISOString().split('T')[0]}.json`; a.click(); URL.revokeObjectURL(url);
        }
        import(file) {
            return new Promise((resolve, reject) => {
                const reader = new FileReader();
                reader.onload = (e) => { try { const json = JSON.parse(e.target.result); if (Array.isArray(json)) resolve(json); else reject('Invalid'); } catch { reject('Invalid JSON'); } };
                reader.onerror = () => reject('File error'); reader.readAsText(file);
            });
        }
    }

    // 🧠 STATE MANAGER
    class StateManager {
        constructor(storage, accountManager) { this.storage = storage; this.accountManager = accountManager; this.tasks = this.storage.load(); this.lastProgress = 0; }
        addTask(t) { this.tasks.push(t); this.save(); }
        updateTask(u) { this.tasks = this.tasks.map(t => t.id === u.id ? u : t); this.save(); }
        deleteTask(id) { this.tasks = this.tasks.filter(t => t.id !== id); this.save(); }
        moveTask(id, status) { const t = this.tasks.find(x => x.id === id); if (t) { t.status = status; this.save(); } }
        save() { this.storage.save(this.tasks); }
        getFilteredTasks(q = '') { if (!q) return this.tasks; const l = q.toLowerCase(); return this.tasks.filter(t => t.title.toLowerCase().includes(l) || t.tags.some(tag => tag.toLowerCase().includes(l))); }
        getStats() { const total = this.tasks.length, done = this.tasks.filter(t => t.status === 'done').length; return { total, done, percent: total === 0 ? 0 : Math.round((done/total)*100) }; }
        exportFullBackup() { return this.accountManager.exportBackup(this.tasks); }
        importFullBackup(data) { const tasks = this.accountManager.importBackup(data); this.tasks = tasks; this.save(); }
    }

    // 🎉 CONFETTI SYSTEM
    class ConfettiSystem {
        constructor(id) { this.canvas = document.getElementById(id); this.ctx = this.canvas?.getContext('2d'); this.particles = []; this.resize(); window.addEventListener('resize', () => this.resize()); }
        resize() { if (!this.canvas) return; this.canvas.width = window.innerWidth; this.canvas.height = window.innerHeight; }
        burst(x, y, count = 50, colors = ['#4f46e5','#10b981','#f59e0b','#ef4444']) {
            if (!this.ctx) return; this.canvas.classList.add('active');
            for (let i = 0; i < count; i++) this.particles.push({ x, y, vx: (Math.random()-0.5)*8, vy: (Math.random()-0.5)*8-5, gravity: 0.15, size: Math.random()*6+4, color: colors[Math.floor(Math.random()*colors.length)], rotation: Math.random()*360, rotationSpeed: (Math.random()-0.5)*10, opacity: 1, life: 1 });
            this.animate();
        }
        animate() {
            if (!this.ctx || !this.particles.length) { this.canvas?.classList.remove('active'); this.ctx?.clearRect(0,0,this.canvas.width,this.canvas.height); return; }
            this.ctx.clearRect(0,0,this.canvas.width,this.canvas.height);
            this.particles = this.particles.filter(p => { p.vy += p.gravity; p.x += p.vx; p.y += p.vy; p.rotation += p.rotationSpeed; p.life -= 0.015; p.opacity = p.life; if (p.life <= 0) return false; this.ctx.save(); this.ctx.globalAlpha = p.opacity; this.ctx.translate(p.x, p.y); this.ctx.rotate(p.rotation * Math.PI/180); this.ctx.fillStyle = p.color; this.ctx.fillRect(-p.size/2, -p.size/2, p.size, p.size); this.ctx.restore(); return true; });
            this.animationId = requestAnimationFrame(() => this.animate());
        }
    }

    // 🎨 UI MANAGER
    class UIManager {
        constructor(state, accountManager) {
            this.state = state; this.accountManager = accountManager; this.confetti = new ConfettiSystem('confettiCanvas');
            this.modal = document.getElementById('taskModal'); this.accountModal = document.getElementById('accountModal');
            this.helpModal = document.getElementById('helpModal'); this.form = document.getElementById('taskForm');
            this.accountForm = document.getElementById('accountForm'); this.searchInput = document.getElementById('searchInput');
            this.initListeners(); this.checkAccount(); this.render();
        }
        checkAccount() {
            const setup = document.getElementById('accountSetup'), manage = document.getElementById('accountManage');
            if (this.accountManager.isAuthenticated()) { setup.style.display = 'none'; manage.style.display = 'block'; this.updateAccountUI(); }
            else { setup.style.display = 'block'; manage.style.display = 'none'; }
        }
        updateAccountUI() { const a = this.accountManager.account; document.getElementById('accountDisplayName').textContent = a.name; document.getElementById('accountAvatar').textContent = a.avatar; document.getElementById('accountMeta').textContent = `Local profile • ${a.role || 'No role set'}`; }
        initListeners() {
            document.getElementById('addTaskBtn')?.addEventListener('click', () => this.openModal());
            document.querySelectorAll('.close-modal')?.forEach(b => b.addEventListener('click', () => { this.closeModal(); this.closeAccountModal(); this.closeHelpModal(); this.closeInstallModal(); }));
            this.form?.addEventListener('submit', e => this.handleSubmit(e));
            const debounced = debounce(e => this.render(e.target.value), 150); this.searchInput?.addEventListener('input', debounced);
            this.setupDragAndDrop();
            document.getElementById('exportBtn')?.addEventListener('click', () => { this.state.storage.export(this.state.tasks); this.showToast('Tasks exported ✓'); });
            const imp = document.getElementById('importFile'); document.getElementById('importBtn')?.addEventListener('click', () => imp?.click());
            imp?.addEventListener('change', async e => { if (e.target.files?.[0]) { try { const d = await this.state.storage.import(e.target.files[0]); this.state.tasks = d; this.state.save(); this.render(); this.showToast('Tasks imported ✓'); } catch(err) { this.showToast('Import failed: '+err, true); } } });
            document.getElementById('accountBtn')?.addEventListener('click', () => this.openAccountModal());
            this.accountForm?.addEventListener('submit', e => this.handleAccountSubmit(e));
            document.getElementById('skipAccount')?.addEventListener('click', () => { this.closeAccountModal(); this.showToast('You can create a profile anytime'); });
            document.getElementById('exportAccountBtn')?.addEventListener('click', () => this.exportFullBackup());
            document.getElementById('importAccountBtn')?.addEventListener('click', () => document.getElementById('importAccountFile')?.click());
            document.getElementById('importAccountFile')?.addEventListener('change', async e => { if (e.target.files?.[0]) { try { const reader = new FileReader(); reader.onload = evt => { const data = JSON.parse(evt.target.result); this.state.importFullBackup(data); this.checkAccount(); this.render(); this.showToast('Backup restored ✓'); }; reader.readAsText(e.target.files[0]); } catch(err) { this.showToast('Restore failed: '+err.message, true); } } });
            document.getElementById('editAccountBtn')?.addEventListener('click', () => { document.getElementById('accountSetup').style.display = 'block'; document.getElementById('accountManage').style.display = 'none'; const a = this.accountManager.account; document.getElementById('accountName').value = a.name; document.getElementById('accountEmail').value = a.email||''; document.getElementById('accountRole').value = a.role||''; });
            document.getElementById('resetAccountBtn')?.addEventListener('click', () => { if (confirm('Reset profile? Tasks kept but unlinked.')) { this.accountManager.deleteAccount(); this.checkAccount(); this.showToast('Profile reset'); } });
            document.getElementById('deleteAccountBtn')?.addEventListener('click', () => { if (confirm('Delete profile AND all tasks? Cannot be undone.')) { this.accountManager.deleteAccount(); this.state.tasks = []; this.state.save(); this.checkAccount(); this.render(); this.showToast('Profile and data deleted'); } });
            document.getElementById('helpBtn')?.addEventListener('click', () => this.openHelpModal());
            window.addEventListener('click', e => { if (e.target === this.modal) this.closeModal(); if (e.target === this.accountModal) this.closeAccountModal(); if (e.target === this.helpModal) this.closeHelpModal(); if (e.target === document.getElementById('installModal')) this.closeInstallModal(); }, { passive: true });
            document.addEventListener('keydown', e => { if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return; if (e.key === 'n') { e.preventDefault(); this.openModal(); } if (e.key === '/') { e.preventDefault(); this.searchInput?.focus(); } if (e.ctrlKey && e.key === 's') { e.preventDefault(); this.state.storage.export(this.state.tasks); } if (e.key === 'Escape') { this.closeModal(); this.closeAccountModal(); this.closeHelpModal(); this.closeInstallModal(); } }, { passive: true });
        }
        openModal(task = null) { this.modal?.classList.add('active'); document.getElementById('modalTitle').textContent = task ? 'Edit Task' : 'Add New Task'; document.getElementById('taskId').value = task ? task.id : ''; document.getElementById('taskTitle').value = task ? task.title : ''; document.getElementById('taskDesc').value = task ? task.desc : ''; document.getElementById('taskPriority').value = task ? task.priority : 'medium'; document.getElementById('taskTags').value = task ? task.tags.join(', ') : ''; if (task) document.getElementById('taskTitle')?.focus(); }
        closeModal() { this.modal?.classList.remove('active'); this.form?.reset(); }
        openAccountModal() { this.checkAccount(); this.accountModal?.classList.add('active'); }
        closeAccountModal() { this.accountModal?.classList.remove('active'); this.accountForm?.reset(); }
        openHelpModal() { this.helpModal?.classList.add('active'); }
        closeHelpModal() { this.helpModal?.classList.remove('active'); }
        closeInstallModal() { document.getElementById('installModal')?.classList.remove('active'); }
        handleSubmit(e) { e.preventDefault(); const id = document.getElementById('taskId')?.value, tags = document.getElementById('taskTags')?.value?.split(',').map(t=>t.trim()).filter(t=>t)||[]; const taskData = { id: id ? parseInt(id) : Date.now(), title: document.getElementById('taskTitle')?.value||'', desc: document.getElementById('taskDesc')?.value||'', priority: document.getElementById('taskPriority')?.value||'medium', tags, status: id ? this.state.tasks.find(t=>t.id==id)?.status : 'todo', createdAt: id ? this.state.tasks.find(t=>t.id==id)?.createdAt : new Date().toISOString(), accountId: this.accountManager.account?.id||null }; if (id) this.state.updateTask(taskData); else this.state.addTask(taskData); this.closeModal(); this.render(); this.showToast(id ? 'Task updated ✓' : 'Task created ✓'); }
        handleAccountSubmit(e) { e.preventDefault(); const name = document.getElementById('accountName')?.value||'', email = document.getElementById('accountEmail')?.value||'', role = document.getElementById('accountRole')?.value||''; this.accountManager.createAccount(name, email, role); this.checkAccount(); this.closeAccountModal(); this.showToast(`Welcome, ${name.split(' ')[0]}! ✨`); this.confetti.burst(window.innerWidth/2, 100, 30); }
        exportFullBackup() { const backup = this.state.exportFullBackup(); const blob = new Blob([JSON.stringify(backup, null, 2)], { type: 'application/json' }); const url = URL.createObjectURL(blob); const a = document.createElement('a'); a.href = url; a.download = `taskflow-full-backup-${new Date().toISOString().split('T')[0]}.json`; a.click(); URL.revokeObjectURL(url); this.showToast('Full backup exported ✓'); this.confetti.burst(window.innerWidth/2, window.innerHeight/2, 40); }
        createTaskCard(task) { const div = document.createElement('div'); div.className = `task-card priority-${task.priority}`; div.draggable = true; div.dataset.id = task.id; div.setAttribute('role','listitem'); div.innerHTML = `<div class="task-header"><span class="task-title">${escapeHtml(task.title)}</span><div class="task-actions"><button class="action-btn edit-btn" data-id="${task.id}"><i class="fa-solid fa-pen"></i></button><button class="action-btn delete-btn" data-id="${task.id}"><i class="fa-solid fa-trash"></i></button></div></div><div class="task-desc">${escapeHtml(task.desc)}</div><div class="task-meta"><div class="tags">${task.tags.map(t=>`<span class="tag">#${escapeHtml(t)}</span>`).join('')}</div><span class="created-date"><i class="fa-regular fa-clock"></i> ${new Date(task.createdAt).toLocaleDateString('en-KE')}</span></div>`; div.querySelector('.edit-btn')?.addEventListener('click', e => { e.stopPropagation(); this.openModal(task); }); div.querySelector('.delete-btn')?.addEventListener('click', e => { e.stopPropagation(); this.deleteTask(task.id); }); div.addEventListener('dragstart', e => { div.classList.add('dragging'); e.dataTransfer.effectAllowed = 'move'; e.dataTransfer.setData('text/plain', task.id); }, { passive: true }); div.addEventListener('dragend', () => { div.classList.remove('dragging'); document.querySelectorAll('.task-list').forEach(l => l.classList.remove('drag-over')); }, { passive: true }); return div; }
        deleteTask(id) { if (confirm('Delete this task? Cannot be undone.')) { this.state.deleteTask(id); this.render(); this.showToast('Task deleted', false, 2000); } }
        setupDragAndDrop() { const lists = document.querySelectorAll('.task-list'); lists.forEach(list => { list.addEventListener('dragover', e => { e.preventDefault(); list.classList.add('drag-over'); const after = this.getDragAfterElement(list, e.clientY); const drag = document.querySelector('.dragging'); if (after == null) list.appendChild(drag); else list.insertBefore(drag, after); }, { passive: false }); list.addEventListener('dragleave', () => list.classList.remove('drag-over'), { passive: true }); list.addEventListener('drop', e => { e.preventDefault(); list.classList.remove('drag-over'); const id = parseInt(e.dataTransfer?.getData('text/plain')); const status = list.closest('.column')?.dataset.status; if (id && status) { this.state.moveTask(id, status); this.render(); this.showToast('Task moved ✓'); if (status === 'done') { const r = list.getBoundingClientRect(); this.confetti.burst(r.left + r.width/2, r.top + 50, 15); } } }, { passive: false }); }); }
        getDragAfterElement(container, y) { const els = [...container.querySelectorAll('.task-card:not(.dragging)')]; return els.reduce((closest, child) => { const box = child.getBoundingClientRect(); const offset = y - box.top - box.height/2; if (offset < 0 && offset > closest.offset) return { offset, element: child }; else return closest; }, { offset: Number.NEGATIVE_INFINITY }).element; }
        render(q = '') { ['todo','inprogress','done'].forEach(s => { const l = document.getElementById(`list-${s}`), c = document.getElementById(`count-${s}`); if (l) l.innerHTML = ''; if (c) c.textContent = '0'; }); const filtered = this.state.getFilteredTasks(q), counts = { todo:0, inprogress:0, done:0 }; filtered.forEach(task => { const card = this.createTaskCard(task); document.getElementById(`list-${task.status}`)?.appendChild(card); counts[task.status]++; }); Object.keys(counts).forEach(s => { document.getElementById(`count-${s}`).textContent = counts[s]; }); const stats = this.state.getStats(); const pt = document.getElementById('progressText'), pf = document.getElementById('progressFill'), cel = document.getElementById('celebration'); if (pt) pt.textContent = `${stats.percent}%`; if (pf) pf.style.width = `${stats.percent}%`; if (pf?.closest('.progress-bar')) pf.closest('.progress-bar').setAttribute('aria-valuenow', stats.percent); if (cel && stats.percent >= 100 && stats.percent > (this.state.lastProgress||0)) { cel.classList.add('active'); this.confetti.burst(window.innerWidth/2, 150, 60); setTimeout(() => cel.classList.remove('active'), 800); } this.state.lastProgress = stats.percent; }
        showToast(msg, err = false, dur = 3000) { const t = document.createElement('div'); t.style.cssText = `position:fixed;bottom:5rem;right:2rem;background:${err?'#ef4444':'#10b981'};color:white;padding:0.75rem 1.5rem;border-radius:var(--radius);font-weight:500;box-shadow:var(--shadow-lg);z-index:1000;animation:slideIn 0.3s ease;max-width:300px;text-align:center;`; t.textContent = msg; document.body.appendChild(t); setTimeout(() => { t.style.animation = 'slideOut 0.3s ease forwards'; setTimeout(() => t.remove(), 300); }, dur); }
    }

    const accountManager = new AccountManager(); const storage = new StorageManager(); const state = new StateManager(storage, accountManager); window.ui = new UIManager(state, accountManager);
}

const style = document.createElement('style'); style.textContent = `@keyframes slideIn{from{transform:translateX(100px);opacity:0}to{transform:translateX(0);opacity:1}}@keyframes slideOut{from{transform:translateX(0);opacity:1}to{transform:translateX(100px);opacity:0}}`; document.head.appendChild(style);
