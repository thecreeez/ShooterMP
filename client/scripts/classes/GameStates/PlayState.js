class PlayState extends GameState {
    constructor(game) {
        super("scene", game)
        this._camera = new Camera(this);
        this._worldRenderer = new WorldRenderer(this);

        this.controlsEnabled = true;
    }

    static fromServer(game, args) {
        let state = new PlayState(game);

        state._worldRenderer.setMap(JSON.parse(args[2]));
        state._worldRenderer.setEntities(JSON.parse(args[3]));
        state._camera.setPos(JSON.parse(args[4]));
        
        return state;
    }

    addEntity(entity) {
        this._worldRenderer.addEntity(entity);
    }

    removeEntity(entity) {
        this._worldRenderer.removeEntity(entity.name);
    }

    getEntity(name) {
        if (this._worldRenderer)
            return this._worldRenderer.getEntity(name);

        return false;
    }

    render() {
        this._worldRenderer.render();

        this._renderMinimap({
            pos: [10, 10],
            size: 30
        });
        this._renderDebug({
            pos: [10, 10],
            size: 10
        });
    }

    // To-do: Переделать мини-карту (Сделать передвигаемой и изменяемой по размеру)
    _renderMinimap() {
        //200
        ctx.fillStyle = "black"
        let onePlace = 400 / this._worldRenderer._worldWalls.length;
        ctx.fillRect(10, 10, onePlace * this._worldRenderer._worldWalls[0].length, onePlace * this._worldRenderer._worldWalls.length);
        this._game.debug.draws++;

        ctx.fillStyle = "yellow";
        let playerPos = [onePlace * this._camera.pos[0] - onePlace / 2, onePlace * this._camera.pos[1] - onePlace / 2];
        ctx.fillRect(playerPos[0], playerPos[1], onePlace, onePlace)
        this._game.debug.draws++;

        ctx.strokeStyle = "blue"
        ctx.beginPath();
        ctx.moveTo(10 + playerPos[0], 10 + playerPos[1]);
        ctx.lineTo(10 + playerPos[0] + Vec2.getByDirection(this._camera.yaw).x * 30, 10 + playerPos[1] + Vec2.getByDirection(this._camera.yaw).y * 30)
        ctx.stroke()


        this._worldRenderer._worldWalls.forEach((row, y) => {
            row.forEach((place, x) => {
                if (place != 0) {
                    switch (Math.ceil(place)) {
                        case 1: ctx.fillStyle = "gray"; break;
                        case 2: ctx.fillStyle = "red"; break;
                        case 3: ctx.fillStyle = "green"; break;
                    }
                    ctx.fillRect(10 + x * onePlace, 10 + y * onePlace, onePlace, onePlace)
                    this._game.debug.draws++;
                }
            })
        })
    }

    _renderDebug({pos, size}) {
        ctx.fillStyle = "white";
        ctx.font = size+"px arial";
        ctx.fillText("FPS: " + this._game.debug.fps + " Ticks: " + this._game.debug.ticks + " Rays: " + this._worldRenderer._rays + " MD: " + this._worldRenderer._maxDistance + " Draws: " + this._game.debug.draws + " Pos: [" + Math.floor(this._camera.pos[0] * 10) / 10 + ", " + Math.floor(this._camera.pos[1] * 10) / 10 + "]", 10, canvas.height - 60);
        ctx.fillText("Name: " + localStorage.getItem("username"), 10, canvas.height - 80);
        ctx.fillText("Time: " + this._worldRenderer._deltaLight, 10, canvas.height - 100);
    }

    update() {
        if (this.controlsEnabled)
            this._updateControls();

        this._updateConnection();
    }

    _updateConnection() {

    }

    _updateControls() {
        let inputManager = this._game.getInputManager();
        let packetManager = this._game.getPacketManager();

        this.prevPos = [this._camera.pos[0], this._camera.pos[1]];
        if (inputManager.isPressed("KeyW")) {
            let moveVec = Vec2.getByDirection(this._camera.yaw);
            moveVec = moveVec.setLength(0.05);
            this._camera.move(moveVec.x, moveVec.y);
        }

        if (inputManager.isPressed("KeyA")) {
            let moveVec = Vec2.getByDirection(this._camera.yaw + 90);
            moveVec = moveVec.setLength(0.025);
            this._camera.move(-moveVec.x, -moveVec.y);
        }

        if (inputManager.isPressed("KeyS")) {
            let moveVec = Vec2.getByDirection(this._camera.yaw);
            moveVec = moveVec.setLength(0.05);
            this._camera.move(-moveVec.x, -moveVec.y);
        }

        if (inputManager.isPressed("KeyD")) {
            let moveVec = Vec2.getByDirection(this._camera.yaw + 90);
            moveVec = moveVec.setLength(0.025);
            this._camera.move(moveVec.x, moveVec.y);
        }

        if (packetManager.getState() == CONNECT_STATE.OPENED && this.prevPos[0] != this._camera.pos[0] || this.prevPos[1] != this._camera.pos[1]) {
            packetManager.send("event/move/" + JSON.stringify(this._camera.pos))
        }

        if (inputManager.isPressed("KeyR")) {
            this._worldRenderer._rays += 10;


            if (this._worldRenderer._rays > 1000)
                this._worldRenderer._rays = 1000;
        }

        if (inputManager.isPressed("KeyT")) {
            this._worldRenderer._rays -= 10;

            if (this._worldRenderer._rays < 5)
                this._worldRenderer._rays = 5;
        }

        if (inputManager.isPressed("KeyF")) {
            this._worldRenderer._maxDistance += 0.1;
        }

        if (inputManager.isPressed("KeyG")) {
            this._worldRenderer._maxDistance -= 0.1;
        }

        if (inputManager.isPressed("KeyE")) {
            this._loggerRenderer.log("Game", "Кажется эта кнопка не является интерактивной.", LOG_TYPE.DEFAULT);
        }

        if (this._camera.pos[0] < 0)
            this._camera.pos[0] = 0;

        if (this._camera.pos[0] > this._worldRenderer._worldWalls[0].length)
            this._camera.pos[0] = this._worldRenderer._worldWalls[0].length;

        if (this._camera.pos[1] < 0)
            this._camera.pos[1] = 0;

        if (this._camera.pos[1] > this._worldRenderer._worldWalls.length)
            this._camera.pos[1] = this._worldRenderer._worldWalls.length;
    }

    onmousemove(pos) {
        let delta = [pos[0] - this._game.mouse.pos[0], pos[1] - this._game.mouse.pos[1]];

        if (this._game.mouse.isDown) {
            this._camera.setYaw(this._camera.yaw - delta[0] / 20);
            //this._camera.pitch += delta[1] / 200
        }
        this._game.mouse.pos = pos;
    }

    canMove(x, y) {
        let xW = Math.round(x);
        let yW = Math.round(y);

        if (this._worldRenderer._worldWalls[yW][xW] != 0) {
            return false;
        }

        return true;
    }
}