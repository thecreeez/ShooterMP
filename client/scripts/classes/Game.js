class Game {
    constructor() {
        this.mousePos = [0, 0];
        this.mouse = {
            isDown: false,
            pos: [0, 0],
            focus: null
        }

        this._camera = new Camera(this);
        this.inputManager = new InputManager(this);
        this._worldRenderer = new WorldRenderer(this);
        this._packetManager = new PacketManager(this);
        this._loggerRenderer = new LoggerRenderer(this);

        this.debug = {
            fps: 0,
            ticks: 0,

            fpsC: 0,
            draws: 0
        }

        this._rays = 50;
        this._maxDistance = 10;
    }

    load({map, entities, pos}) {
        this._worldRenderer.setMap(map);
        this._worldRenderer.setEntities(entities);
        this._camera.setPos(pos);
        this._worldRenderer.shouldRender = true;
    }

    getEntity(name) {
        return this._worldRenderer.getEntity(name);
    }
    
    join(entity) {
        this._worldRenderer.addEntity(entity);
    }

    disconnect(entity) {
        this._worldRenderer.removeEntity(entity.name);
    }

    render() {
        this.debug.draws = 0;
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        ctx.fillStyle = "black";
        ctx.fillRect(0,0,canvas.width, canvas.height);

        if (this._worldRenderer.shouldRender) {
            this._worldRenderer.render();
            this.renderMinimap();
        }

        this.renderDebug();

        this.debug.fpsC++;
    }

    renderDebug() {
        ctx.fillStyle = "white";
        ctx.font = "20px arial";
        ctx.fillText("FPS: " + this.debug.fps + " Ticks: " + this.debug.ticks + " Rays: " + this._rays + " MD: " + this._maxDistance + " Draws: " + this.debug.draws + " Pos: " + this._camera.pos, 10, canvas.height - 60);
        ctx.fillText("Name: " + localStorage.getItem("username"), 10, canvas.height - 80);
        this._loggerRenderer.render([10, 10], 50);
    }

    renderMinimap() {
        //200
        ctx.fillStyle = "black"
        let onePlace = 400 / this._worldRenderer._worldWalls.length;
        ctx.fillRect(10, 10, onePlace * this._worldRenderer._worldWalls[0].length, onePlace * this._worldRenderer._worldWalls.length);
        this.debug.draws++;

        ctx.fillStyle = "yellow";
        let playerPos = [onePlace * this._camera.pos[0] - onePlace / 2, onePlace * this._camera.pos[1] - onePlace / 2];
        ctx.fillRect(playerPos[0], playerPos[1], onePlace, onePlace)
        this.debug.draws++;

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
                    this.debug.draws++;
                }
            })
        })
    }

    update() {
        if (this._worldRenderer.shouldRender) {
            this.updateControls();
        }

        this.debug.ticks++;
    }

    updateControls() {
        this.prevPos = [this._camera.pos[0], this._camera.pos[1]];
        if (this.inputManager.isPressed("KeyW")) {
            let moveVec = Vec2.getByDirection(this._camera.yaw);
            moveVec = moveVec.setLength(0.05);
            this._camera.move(moveVec.x, moveVec.y);
        }

        if (this.inputManager.isPressed("KeyA")) {
            let moveVec = Vec2.getByDirection(this._camera.yaw + 90);
            moveVec = moveVec.setLength(0.025);
            this._camera.move(-moveVec.x, -moveVec.y);
        }

        if (this.inputManager.isPressed("KeyS")) {
            let moveVec = Vec2.getByDirection(this._camera.yaw);
            moveVec = moveVec.setLength(0.05);
            this._camera.move(-moveVec.x, -moveVec.y);
        }

        if (this.inputManager.isPressed("KeyD")) {
            let moveVec = Vec2.getByDirection(this._camera.yaw + 90);
            moveVec = moveVec.setLength(0.025);
            this._camera.move(moveVec.x, moveVec.y);
        }

        if (this._packetManager.getState() == CONNECT_STATE.OPENED && this.prevPos[0] != this._camera.pos[0] || this.prevPos[1] != this._camera.pos[1]) {
            this._packetManager.send("event/move/"+JSON.stringify(this._camera.pos))
        }

        if (this.inputManager.isPressed("KeyR")) {
            this._worldRenderer._rays+=10;


            if (this._worldRenderer._rays > 1000)
                this._worldRenderer._rays = 1000;
        }

        if (this.inputManager.isPressed("KeyT")) {
            this._worldRenderer._rays-=10;

            if (this._worldRenderer._rays < 5)
                this._worldRenderer._rays = 5;
        }

        if (this.inputManager.isPressed("KeyF")) {
            this._worldRenderer._maxDistance += 0.1;
            this._loggerRenderer.log("TEST", "TEST TEST TEST", LOG_TYPE.DEFAULT)
        }

        if (this.inputManager.isPressed("KeyG")) {
            this._worldRenderer._maxDistance -= 0.1;
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

    onmouseup(pos) {
        this.mouse.isDown = false;
        this.mouse.focus = null;
    }

    onmousemove(pos) {
        let delta = [pos[0] - this.mouse.pos[0], pos[1] - this.mouse.pos[1]];

        if (this.mouse.isDown) {
            this._camera.setYaw(this._camera.yaw - delta[0] / 20);
            //this._camera.pitch += delta[1] / 200
        }
        this.mouse.pos = pos;
    }

    onmousedown(pos) {
        this.mouse.isDown = true;
    }

    count() {
        this.debug.fps = this.debug.fpsC * 2;
        this.debug.fpsC = 0;
    }

    getDefaultSpawn() {
        return [this._map.length / 2, this._map[0].length / 2];
    }

    getInputManager() {
        return this.inputManager;
    }

    getPacketManager() {
        return this._packetManager;
    }

    getLoggerRenderer() {
        return this._loggerRenderer;
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