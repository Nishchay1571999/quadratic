// set this in .env (if set to false then all debug flags are turned off)
export const debug = process.env.REACT_APP_DEBUG === '1' ? true : false;

// shows renderer light
export const debugShowRenderer = debug && false;

// shows FPS meter
export const debugShowFPS = debug && false;

// shows rendering time for components
export const debugShowTime = debug && false;

// counts number of children and which are visible in the viewport
export const debugShowCountRenderedObjects = debug && false;

// shows count of cached sprites for formatting
export const debugShowCachedSpriteCounts = debug && false;

export const debugSkipPythonLoad = debug && false;

export function warn(...args: any): void {
  if (debug) {
    console.warn(...args);
  }
}
