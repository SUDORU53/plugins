// JsMacros script for Minecraft.
// Sends /salary every 30 minutes, but only after you manually send /salary once.
//
// Installation:
// 1. Put this file into your JsMacros scripts folder.
// 2. In JsMacros, bind this file to the "SendMessage" event.
// 3. Join a world/server and type /salary manually once.

const COMMAND = '/salary';
const INTERVAL_MS = 30 * 60 * 1000;

const STATE_KEY = 'salary_auto_state';

function getState() {
  let state = GlobalVars.getObject(STATE_KEY);
  if (!state) {
    state = { active: false, nextRunAt: 0, workerRunning: false };
    GlobalVars.putObject(STATE_KEY, state);
  }
  return state;
}

function saveState(state) {
  GlobalVars.putObject(STATE_KEY, state);
}

function isInWorld() {
  try {
    return World.getWorld() !== null && Player.getPlayer() !== null;
  } catch (error) {
    return false;
  }
}

function sendCommand() {
  if (!isInWorld()) return false;

  Chat.say(COMMAND);
  return true;
}

function ensureWorker() {
  const state = getState();
  if (state.workerRunning) return;

  state.workerRunning = true;
  saveState(state);

  JsMacros.runScript(() => {
    while (true) {
      const currentState = getState();

      if (!currentState.active) {
        currentState.workerRunning = false;
        saveState(currentState);
        return;
      }

      if (!isInWorld()) {
        currentState.active = false;
        currentState.workerRunning = false;
        currentState.nextRunAt = 0;
        saveState(currentState);
        return;
      }

      const now = Date.now();
      const waitMs = currentState.nextRunAt - now;

      if (waitMs > 0) {
        Time.sleep(Math.min(waitMs, 1000));
        continue;
      }

      if (sendCommand()) {
        currentState.nextRunAt = Date.now() + INTERVAL_MS;
        saveState(currentState);
      } else {
        currentState.active = false;
        currentState.workerRunning = false;
        currentState.nextRunAt = 0;
        saveState(currentState);
        return;
      }
    }
  });
}

const eventMessage = String(event.message || '').trim();

if (eventMessage === COMMAND) {
  const state = getState();
  state.active = true;
  state.nextRunAt = Date.now() + INTERVAL_MS;
  saveState(state);
  ensureWorker();
}
