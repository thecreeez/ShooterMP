class PlayState extends GameState {
    constructor(game) {
        super("scene", game)
        this._camera = new Camera(this, 221);
        this._worldRenderer = new WorldRenderer({
            state: this,
            deltaLight: 1,
            maxDistance: 15,
            rays: 300
        });

        this.controlsEnabled = true;

        this.inverted = false;
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

        let minimapSize = 200;

        this._renderMinimap({
            pos: [canvas.width - minimapSize - 10, 10],
            size: minimapSize,
            drawNames: true
        });
        this._renderDebug({
            pos: [10, canvas.height / 2],
            size: 20
        });
    }

    _renderMinimap({pos, size, drawNames}) {
        let cellSize = size / this._worldRenderer._worldWalls[0].length;
        ctx.fillStyle = MAP_COLORS.BACKGROUND;
        ctx.fillRect(pos[0], pos[1], size, size);
        this._game.debug.draws++;

        this._worldRenderer._worldWalls.forEach((row, y) => {
            row.forEach((place, x) => {
                if (place != 0) {
                    switch (Math.ceil(place)) {
                        case 1: ctx.fillStyle = "gray"; break;
                        case 2: ctx.fillStyle = "red"; break;
                        case 3: ctx.fillStyle = "green"; break;
                    }
                    ctx.fillRect(pos[0] + x * cellSize, pos[1] + y * cellSize, cellSize, cellSize)
                    this._game.debug.draws++;
                }
            })
        })

        // ENTITY RENDER
        this._worldRenderer.getEntities().forEach((entity, index) => {
            let entityPosOnMap = [entity.pos[0] * cellSize, entity.pos[1] * cellSize];

            ctx.fillStyle = MAP_COLORS.ENEMY;
            ctx.beginPath();
            ctx.arc(pos[0] + entityPosOnMap[0], pos[1] + entityPosOnMap[1], cellSize / 2, 0, 2 * Math.PI);
            ctx.fill();
            this._game.debug.draws++;

            if (drawNames) {
                ctx.font = (cellSize)+"px arial";
                ctx.fillStyle = "white";
                ctx.fillText(entity.name, pos[0] + entityPosOnMap[0] - ctx.measureText(entity.name).width / 2, pos[1] + entityPosOnMap[1] - cellSize / 1.5)
            }
        })

        let cameraPosOnMap = [cellSize * this._camera.pos[0], cellSize * this._camera.pos[1]];

        // LOOK VECTOR
        ctx.strokeStyle = MAP_COLORS.VECTORS;
        ctx.beginPath();
        ctx.moveTo(pos[0] + cameraPosOnMap[0], pos[1] + cameraPosOnMap[1]);
        ctx.lineTo(pos[0] + cameraPosOnMap[0] + Vec2.getByDirection(this._camera.yaw).x * cellSize * 2, pos[1] + cameraPosOnMap[1] + Vec2.getByDirection(this._camera.yaw).y * cellSize * 2)
        ctx.stroke()
        this._game.debug.draws++;

        // BODY CIRCLE
        ctx.fillStyle = MAP_COLORS.PLAYER;
        ctx.beginPath();
        ctx.arc(pos[0] + cameraPosOnMap[0], pos[1] + cameraPosOnMap[1], cellSize / 2, 0, 2 * Math.PI);
        ctx.fill();
        this._game.debug.draws++;
    }

    _renderDebug({pos, size}) {
        let i = 0;
        ctx.fillStyle = "white";
        ctx.font = size+"px arial";

        ctx.fillText("FPS: " + this._game.debug.fps + " Ticks: " + this._game.debug.ticks, pos[0], pos[1] + (size * 1.05) * i);
        i++;

        ctx.fillText("Max Distance: " + (Math.floor(this._worldRenderer._maxDistance * 10) / 10) + " Rays: " + this._worldRenderer._rays, pos[0], pos[1] + size * i);
        i++;

        ctx.fillText("Draws: " + this._game.debug.draws + " yaw: " + this._camera.yaw, pos[0], pos[1] + size * i);
        i++;

        ctx.fillText("Light: " + Math.floor(this._worldRenderer._deltaLight * 10) / 10 + " Pos: [" + Math.floor(this._camera.pos[0] * 10) / 10 + ", " + Math.floor(this._camera.pos[1] * 10) / 10 + "]", pos[0], pos[1] + size * i);
        i++;

        ctx.fillText("Net: " + this._game.getPacketManager().getState() + " Players: " + this._worldRenderer.getEntities().length, pos[0], pos[1] + size * i);
        i++;

        ctx.fillText("Canvas width: "+canvas.width+" ", pos[0], pos[1] + size * i);
        i++;

        ctx.fillText("Name: " + localStorage.getItem("username"), pos[0], pos[1] + size * i);
    }

    update() {
        if (this.controlsEnabled)
            this._updateControls();

        this._updateConnection();
        this._updateDayCycle();
    }

    _updateDayCycle() {
        let cyclePeriod = 5000;
        if (this._game.debug.ticks % cyclePeriod == 0) {
            this.inverted = !this.inverted;
        }

        if (this.inverted) {
            this._worldRenderer._deltaLight = (this._game.debug.ticks % cyclePeriod) / cyclePeriod;
        } else {
            this._worldRenderer._deltaLight = (cyclePeriod - (this._game.debug.ticks % cyclePeriod)) / cyclePeriod;
        }
    }

    _updateConnection() {
        if (this._game.getPacketManager().getState() != CONNECT_STATE.OPENED) {
            this._game.getLoggerRenderer().log("PacketManager", "Соединение с сервером прервано.", LOG_TYPE.ERROR)
            this._game.setState(new MenuState(this._game));
        }
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
            console.log(this._worldRenderer.getCameraLookAt());
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
        return true;
        let xW = Math.round(x);
        let yW = Math.round(y);

        if (this._worldRenderer._worldWalls[yW] != 0) {
            return false;
        }

        if (this._worldRenderer._worldWalls[yW][xW] != 0) {
            return false;
        }

        return true;
    }
}