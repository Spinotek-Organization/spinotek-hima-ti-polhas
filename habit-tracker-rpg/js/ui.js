/**
 * ui.js
 * DOM Rendering logic.
 * Adapted for Global Scope.
 */

let elements = {};

window.UI = {
    init() {
        elements = {
            charLevel: document.getElementById('char-level'),
            charGold: document.getElementById('char-gold'),
            charStatus: document.getElementById('char-status'),
            hpText: document.getElementById('hp-text'),
            hpBar: document.getElementById('hp-bar'),
            expText: document.getElementById('exp-text'),
            expBar: document.getElementById('exp-bar'),
            habitList: document.getElementById('habit-list'),
            actionLog: document.getElementById('action-log')
        };
        console.log('UI Initialized. Elements found:', !!elements.habitList);
    },

    render(state) {
        if (!state) return;
        renderDashboard(state.character);
        renderHabits(state.habits);
        renderLogs(state.logs);
    },

    toggleMemoryCore() {
        const core = document.getElementById('memory-core');
        if (core) {
            core.classList.toggle('collapsed');
            core.classList.toggle('active');
        }
    }
};

function renderDashboard(char) {
    if (!elements.charLevel) return; // Guard

    elements.charLevel.textContent = String(char.level).padStart(2, '0');
    elements.charGold.textContent = char.gold;
    elements.charStatus.textContent = char.status;

    // HP Bar
    elements.hpText.textContent = `${char.hp}/${char.maxHp}`;
    const hpPercent = (char.hp / char.maxHp) * 100;
    elements.hpBar.style.width = `${hpPercent}%`;

    // EXP Bar
    const expPercent = (char.currentExp / char.maxExp) * 100;
    elements.expBar.style.width = `${expPercent}%`;

    // Fainted State Handling
    const isFainted = char.status === 'FAINTED';

    // Toggle Global State
    document.body.classList.toggle('is-fainted', isFainted);
    document.querySelector('.dashboard').classList.toggle('is-fainted', isFainted);

    if (isFainted) {
        elements.charStatus.className = 'cy-badge fainted';
        elements.charStatus.textContent = 'FAINTED';

        elements.expText.innerHTML = `${Math.floor(char.currentExp)}/${Math.floor(char.maxExp)} <span style="color:var(--cy-neon-red); font-size:0.6em;">[-50% GAIN]</span>`;
    } else {
        elements.charStatus.className = 'cy-badge';
        elements.charStatus.textContent = 'NORMAL';
        elements.expText.textContent = `${Math.floor(char.currentExp)}/${Math.floor(char.maxExp)}`;
    }
}

function renderHabits(habits) {
    if (!elements.habitList) return;

    // Determine if we need to full re-render or patch. 
    // For Vanilla MVP, clearing innerHTML and rebuilding is acceptable for small lists.
    elements.habitList.innerHTML = '';

    habits.forEach(habit => {
        const el = document.createElement('div');
        el.className = 'habit-item';
        el.innerHTML = `
            <div class="habit-info">
                <span class="habit-name">${habit.name}</span>
                <span class="habit-meta">[${habit.difficulty}] Streak: ${habit.streak}</span>
            </div>
            <div class="habit-actions">
                <button class="cy-btn cy-btn-abort" data-id="${habit.id}" data-action="abort">ABORT</button>
                <button class="cy-btn cy-btn-exec" data-id="${habit.id}" data-action="exec">EXECUTE</button>
            </div>
        `;
        elements.habitList.appendChild(el);
    });
}

function renderLogs(logs) {
    if (!elements.actionLog) return;
    elements.actionLog.innerHTML = logs.map(log => `
        <div class="log-entry">
            <span class="log-time">[${log.timestamp}]</span> ${log.message}
        </div>
    `).join('');
}

// Event Delegation setup helper
window.setupEventListeners = function (handler) {
    if (!elements.habitList) return;
    elements.habitList.addEventListener('click', (e) => {
        const btn = e.target.closest('button');
        if (!btn) return;

        const id = btn.dataset.id;
        const action = btn.dataset.action;

        if (id && action) {
            handler(action, id);
        }
    });
}
