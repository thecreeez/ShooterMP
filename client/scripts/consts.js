const RENDER_TYPES = {
    OPTIMIZED: 0,
    TEXTURIZED: 1
}

// Rays is 5000 / y
let GAME_EVENT_Y_IS_RAYS = false;

// Height is y
let GAME_EVENT_Y_IS_HEIGHT = false;

// All pixels are random color
let GAME_EVENT_DANCING_ROOM = false;

// All colors inverted
let GAME_EVENT_INVERTED_COLORS = false;

// yepyep
let GAME_EVENT_WONT_DELETE_FRAMES = false;

// Max draws per frame
let GAME_EVENT_MAX_DRAWS = -1;

let RENDER_TYPE = RENDER_TYPES.TEXTURIZED; 

let SHOULD_RENDER_SKYBOX = true;
let SKY_COLOR = [0,15,0];
let FLOOR_COLOR = [25, 120, 0]