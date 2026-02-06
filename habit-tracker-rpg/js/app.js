/**
 * app.js
 * Entry Point & Controller
 * Adapted for Global Scope.
 */

// Globals: Store, UI, setupEventListeners, RPG
// Removed top-level destructuring to prevent init race conditions

// Initialize
function init() {
    // 1. Init Store (loads data, relies on RPG)
    const state = window.Store.init();

    // 2. Init UI (finds DOM elements)
    window.UI.init();

    // 3. Init Ritual (Drag & Drop)
    if (window.Ritual) window.Ritual.init();

    // 4. Initial Render
    window.UI.render(state);

    // Subscribe UI to State changes
    window.Store.subscribe((newState) => {
        window.UI.render(newState);
    });

    // Setup Interactions
    window.setupEventListeners(handleAction);

    console.log('Habit-Core RPG Initialized (Safe Mode)');
}

function handleAction(actionType, habitId) {
    const state = window.Store.getState();
    const habit = state.habits.find(h => h.id === habitId);

    // Access RPG logic lazily
    const { executeHabit, abortHabit } = window.RPG;

    if (!habit) return;

    if (actionType === 'exec') {
        const result = executeHabit(state.character, habit.difficulty);
        window.Store.updateCharacter(result);

        // Check for recovery flag from logic
        if (result._justRecovered) {
            window.Store.addLogEntry(`SYSTEM: Recovery complete. Character stabilized.`, 'system');
        }

        let msg = `+${result.currentExp - state.character.currentExp} EXP from '${habit.name}'`;
        if (state.character.status === 'FAINTED' && !result._justRecovered) {
            msg += ` (PENALTY APPLIED)`;
        }

        if (result._leveledUp) {
            msg += ` | LEVEL UP! Now Level ${result.level}.`;
            window.Store.addLogEntry(`LEVEL UP: You have reached Level ${result.level}!`, 'system');
        }

        window.Store.addLogEntry(msg, 'success');

    } else if (actionType === 'abort') {
        const result = abortHabit(state.character, habit.difficulty);
        const hpLost = state.character.hp - result.hp;

        window.Store.updateCharacter(result);
        window.Store.addLogEntry(`FAILED '${habit.name}'. -${hpLost} HP.`, 'failure');

        if (result.status === 'FAINTED' && state.character.status !== 'FAINTED') {
            window.Store.addLogEntry(`[SYSTEM WARNING] Vital core depleted. EXP gain reduced for 24h. Recovery protocol active.`, 'failure');
        }
    }
}

// System Reset Handler
function handleReset() {
    if (confirm('WARNING: IRREVERSIBLE ACTION.\n\nInitiate FACTORY RESET protocol? All progress (Level, Gold, Habits) will be purged.')) {
        window.Store.reset();
        location.reload();
    }
}

document.getElementById('btn-reset')?.addEventListener('click', handleReset);

// Boot
document.addEventListener('DOMContentLoaded', init);
