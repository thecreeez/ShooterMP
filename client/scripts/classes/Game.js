class Game {
    constructor() {
        this.mousePos = [0, 0];
        this.mouse = {
            isDown: false,
            pos: [0, 0],
            focus: null
        }

        this._inputManager = new InputManager(this);
        this._packetManager = new PacketManager(this);
        this._loggerRenderer = new LoggerRenderer(this);
        this._textureManager = new TextureManager(this);

        this.getLoggerRenderer().log("Game", "Game loaded.", LOG_TYPE.DEFAULT)

        this._state = new MenuState(this);

        this.debug = {
            fps: 0,
            ticks: 0,

            fpsC: 0,
            draws: 0
        }
    }

    setState(state) {
        this._state = state;
    }

    render() {
        this.debug.draws = 0;

        if (!GAME_EVENT_WONT_DELETE_FRAMES) {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
        }

        this._state.render();
        this._loggerRenderer.render([10, 10], 50);

        this.debug.fpsC++;
    }

    update() {
        this._state.update();

        this.debug.ticks++;
    } 

    onmouseup(pos) {
        this.mouse.isDown = false;
        this.mouse.focus = null;
    }

    onmousemove(pos) {
        this._state.onmousemove(pos);
    }

    onmousedown(pos) {
        this.mouse.isDown = true;
    }

    count() {
        this.debug.fps = this.debug.fpsC * 2;
        this.debug.fpsC = 0;
    }

    getInputManager() {
        return this._inputManager;
    }

    getPacketManager() {
        return this._packetManager;
    }

    getLoggerRenderer() {
        return this._loggerRenderer;
    }

    getTextureManager() {
        return this._textureManager;
    }
}