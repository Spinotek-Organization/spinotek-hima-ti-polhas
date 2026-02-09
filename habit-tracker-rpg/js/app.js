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

    if (!habit) return;

    if (actionType === 'exec') {
        window.Store.executeHabit(habitId);
    } else if (actionType === 'abort') {
        window.Store.abortHabit(habitId);
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
