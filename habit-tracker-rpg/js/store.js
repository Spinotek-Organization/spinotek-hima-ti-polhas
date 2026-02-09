/**
 * store.js
 * State Management & Persistence using Module Pattern.
 * Adapted for Global Scope.
 */

const STORAGE_KEY = 'habit_rpg_data_v4';

// Initial state factory to allow lazy access to window.RPG
function getInitialState() {
    const { calculateNextLevelExp, CHARACTER_STATUS } = window.RPG;
    return {
        character: {
            level: 1,
            currentExp: 0,
            maxExp: calculateNextLevelExp(1),
            hp: 50,
            maxHp: 50,
            gold: 0, // Will need to cheat this for testing
            status: CHARACTER_STATUS.NORMAL,
            lastFaintedTimestamp: null,
            debuff: null, // { expMultiplier: 0.5, expiresAt: <ts>, stabilized: false }
            passiveUpgrades: {
                vitalCore: 0,
                learningAmplifier: 0,
                failureDampener: 0
            },
            flags: {
                hasFainted: false,
                hasUpgraded: false,
                faintCount: 0
            }
        },
        habits: [
            { id: 'h1', name: 'Code for 1 hour', difficulty: 'HARD', streak: 0 },
            { id: 'h2', name: 'Drink Water', difficulty: 'TRIVIAL', streak: 0 },
            { id: 'h3', name: 'Read Documentation', difficulty: 'MEDIUM', streak: 0 }
        ],
        logs: [
            { id: Date.now(), timestamp: new Date().toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit' }), message: 'SYSTEM: Welcome to Habit-Core RPG v4.0. Core Augmentation Online.', type: 'system' }
        ]
    };
}

let state = null;
let listeners = [];

function load() {
    const raw = localStorage.getItem(STORAGE_KEY);
    const defaults = getInitialState();

    if (raw) {
        try {
            state = JSON.parse(raw);
            // Ensure data integrity (merge with defaults)
            if (!state.character) state.character = { ...defaults.character };
            // Ensure debuff field exists if migrating from older version (though we changed key)
            if (state.character.debuff === undefined) state.character.debuff = null;
            if (!state.character.passiveUpgrades) state.character.passiveUpgrades = { ...defaults.character.passiveUpgrades };

            if (!state.habits) state.habits = [...defaults.habits];
            if (!state.logs) state.logs = [...defaults.logs];
        } catch (e) {
            console.error('Failed to parse save data', e);
            state = JSON.parse(JSON.stringify(defaults));
        }
    } else {
        state = JSON.parse(JSON.stringify(defaults));
    }

    // Check for passive recovery on load
    const { checkStatusRecovery } = window.RPG;
    const recoveredChar = checkStatusRecovery(state.character);
    if (recoveredChar !== state.character) {
        state.character = recoveredChar;
        addLog('SYSTEM: You have recovered from fainting.', 'system');
        save();
    }
}

function save() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    notify();
}

function notify() {
    listeners.forEach(cb => cb(state));
}

/**
 * Public API
 */
window.Store = {
    init() {
        // Ensure RPG is loaded
        if (!window.RPG) {
            console.error('FATAL: window.RPG not found during Store init');
            return null;
        }
        load();

        // Bind visibility change to auto-validate
        document.addEventListener('visibilitychange', () => {
            if (document.visibilityState === 'visible') {
                window.Store.validateState();
            }
        });

        // Validate immediately on init just in case
        this.validateState();

        return state;
    },

    getState() {
        return state;
    },

    subscribe(callback) {
        listeners.push(callback);
        if (state) callback(state);
        return () => {
            listeners = listeners.filter(l => l !== callback);
        }
    },

    updateCharacter(newCharacterState) {
        state.character = newCharacterState;
        save();
    },

    triggerStabilizer() {
        // Validate state first to prevent wasted gold
        this.validateState();

        // Use Guard Function
        const char = state.character;
        if (!window.RPG.canUseNeuralStabilizer(char)) {
            // Specific feedback based on why it failed
            if (char.status !== window.RPG.CHARACTER_STATUS.FAINTED) {
                addLog(`SYSTEM: Stabilizer aborted. Neural patterns already normalized.`, 'system');
            } else if (char.debuff && char.debuff.stabilized) {
                addLog(`SYSTEM: Stabilizer aborted. Already active.`, 'system');
            } else if (char.gold < window.RPG.NEURAL_STABILIZER_COST) {
                addLog(`SYSTEM: Stabilizer aborted. Insufficient resources.`, 'failure');
            }
            return; // Stop execution
        }

        const { useNeuralStabilizer } = window.RPG;
        const result = useNeuralStabilizer(char);

        if (result.success) {
            state.character = result.character;
            addLog(`SYSTEM: Neural Stabilizer activated. EXP penalty reduced.`, 'success');
            save(); // Triggers notify
        } else {
            addLog(`SYSTEM: Stabilizer failed. ${result.reason}`, 'failure');
            notify(); // Ensure UI reflects any attempt
        }
    },

    purchaseUpgrade(type) {
        this.validateState(); // Ensure stats are fresh

        // Use Guard Function
        const char = state.character;
        // Note: Logic inside purchaseUpgrade also checks this, but Store shouldn't call it if invalid.
        if (!window.RPG.canPurchaseUpgrade(char, type)) {
            addLog(`SYSTEM: Authorization denied. Criteria met for ${type}? [NEGATIVE]`, 'failure');
            notify();
            return;
        }

        const { purchaseUpgrade } = window.RPG;
        const result = purchaseUpgrade(char, type);

        if (result.success) {
            // Narrative Flag
            if (!state.character.flags) state.character.flags = { hasUpgraded: false };
            if (!state.character.flags.hasUpgraded) {
                this.addLogEntry('HARDWARE DETECTED: Initialization of first augmentation successful.', 'UPGRADE', 'SUCCESS');
                state.character.flags.hasUpgraded = true;
            }

            state.character = result.character;
            // Persist flag changes (result.character might not have them if RPG logic didn't pass them back)
            // Actually RPG logic returns {...character, ...} so it should preserve flags if they existed.
            // But we just added flags to state.character above.
            // Let's ensure they are synced. 
            state.character.flags = state.character.flags || {};
            state.character.flags.hasUpgraded = true;

            this.addLogEntry(`Augmentation installed: ${result.upgradeName} (Lvl ${result.newLevel})`, 'UPGRADE', 'SUCCESS');
            save();
        } else {
            addLog(`SYSTEM: Upgrade Error: ${result.reason}`, 'failure');
            notify();
        }
    },

    /**
     * Centralized State Validation
     * Checks time-based recovery and ensures consistency.
     */
    validateState() {
        if (!state || !state.character) return false;

        const { checkStatusRecovery } = window.RPG;
        const oldChar = state.character;
        const newChar = checkStatusRecovery(oldChar);

        if (newChar !== oldChar) {
            state.character = newChar;
            addLog('SYSTEM: Temporal synchronization complete. Biological functions restored.', 'system');
            save();
            return true;
        }
        return false;
    },

    addLogEntry(message, type = 'system') {
        const entry = {
            id: Date.now(),
            timestamp: new Date().toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit' }),
            message,
            type
        };
        state.logs.push(entry);
        if (state.logs.length > 50) state.logs.shift(); // Remove oldest (from front)
        save();
    },

    addHabit(habitData) {
        state.habits.push(habitData);
        save();
        notify(); // Triggers UI re-render
    },

    reset() {
        state = JSON.parse(JSON.stringify(getInitialState()));
        save();
    },

    /**
     * Core Action: Execute Habit
     * Handles Logic + Narrative + State Update
     */
    executeHabit(habitId) {
        this.validateState();
        const habit = state.habits.find(h => h.id === habitId);
        if (!habit) return;

        // RPG Logic
        const result = window.RPG.executeHabit(state.character, habit.difficulty);

        // Narrative & Logging
        if (result._justRecovered) {
            this.addLogEntry(`SYSTEM: Recovery complete. Character stabilized.`, 'SYSTEM', 'SUCCESS');
        }

        let msg = `+${result.currentExp - state.character.currentExp} EXP from '${habit.name}'`;
        let severity = 'SUCCESS';

        if (state.character.status === window.RPG.CHARACTER_STATUS.FAINTED && !result._justRecovered) {
            msg += ` (PENALTY APPLIED)`;
            severity = 'WARN';
        }

        if (result._leveledUp) {
            msg += ` | LEVEL UP! Now Level ${result.level}.`;
            // Milestone Narrative
            if (result.level % 5 === 0) {
                this.addLogEntry(`MILESTONE: Level ${result.level} Reached. Performance limits broken.`, 'SYSTEM', 'SUCCESS');
            } else {
                this.addLogEntry(`LEVEL UP: You have reached Level ${result.level}!`, 'SYSTEM', 'SUCCESS');
            }
        }

        this.addLogEntry(msg, 'HABIT', severity);

        // Update State
        state.character = result;

        // Update Habit Streak (Simple increment for now, logic not in RPG yet?)
        // Assuming simplistic streak logic resides in Store or App usually, but sticking to result usage.
        // Wait, RPG logic didn't return updated habits. We must update habit manually here?
        // Previous app.js didn't update habit streak! It just accessed logic. 
        // We should fix that too as a bonus or stick to previous behavior?
        // Looking at app.js: "const habit = state.habits.find..." -> "executeHabit(state.character...)" -> "Store.updateCharacter".
        // Use "streak" from somewhere? No, streak was in habit object but logic didn't update it.
        // I will increment streak here to improve it.
        habit.streak = (habit.streak || 0) + 1;

        save();
    },

    /**
     * Core Action: Abort Habit
     */
    abortHabit(habitId) {
        this.validateState();
        const habit = state.habits.find(h => h.id === habitId);
        if (!habit) return;

        // RPG Logic
        const result = window.RPG.abortHabit(state.character, habit.difficulty);
        const hpLost = state.character.hp - result.hp;

        // Narrative Logic
        if (result.status === window.RPG.CHARACTER_STATUS.FAINTED && state.character.status !== window.RPG.CHARACTER_STATUS.FAINTED) {
            // Just Fainted
            const flags = state.character.flags || { faintCount: 0 };
            flags.faintCount = (flags.faintCount || 0) + 1;
            flags.hasFainted = true;
            result.flags = flags;

            if (flags.faintCount === 1) {
                this.addLogEntry(`CRITICAL ALERT: Life Signs Critical. First shutdown imminent.`, 'SYSTEM', 'CRITICAL');
            } else {
                this.addLogEntry(`SYSTEM FAILURE. Reboot sequence initiated. (Occurrence #${flags.faintCount})`, 'SYSTEM', 'ERROR');
            }

            this.addLogEntry(`[SYSTEM WARNING] Vital core depleted. EXP gain reduced for 24h.`, 'COMBAT', 'ERROR');
        } else {
            this.addLogEntry(`FAILED '${habit.name}'. -${hpLost} HP.`, 'COMBAT', 'WARN');
        }

        // Reset Streak
        habit.streak = 0;

        state.character = result;
        save();
    }
};

// Internal helper 
function addLog(msg, type) {
    if (window.Store && window.Store.addLogEntry) {
        window.Store.addLogEntry(msg, type);
    }
}
