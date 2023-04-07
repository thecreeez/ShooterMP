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

        this.debug = {
            fps: 0,
            ticks: 0,

            fpsC: 0,
            draws: 0
        }

        this._rays = 50;
        this._maxDistance = 10;
    }

    render() {
        this.debug.draws = 0;
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        ctx.fillStyle = "black"
        ctx.fillRect(0, canvas.height / 2, canvas.width, canvas.height / 2)

        ctx.fillStyle = "black"
        ctx.fillRect(0, 0, canvas.width, canvas.height / 2)
        this._worldRenderer.render();
        this.renderMinimap();
        ctx.fillStyle = `black`;
        ctx.fillRect(canvas.width / 2 - 5, canvas.height / 2 - 5, 5, 5)

        ctx.fillStyle = "white";
        ctx.fillText("FPS: "+this.debug.fps+" Ticks: "+this.debug.ticks+" Rays: "+this._rays+" MD: "+this._maxDistance+" Draws: "+this.debug.draws+" Pos: "+this._camera.pos, 10, canvas.height - 60);

        this.debug.fpsC++;
    }

    renderWorld() {
        let lastIntersection = null;
        for (let i = 0; i <= this._rays; i++) {
            let angle = (-this._rays / 2 + i) * (this._camera.fov / this._rays);
            
            let cameraPosVec = new Vec2(this._camera.pos[0], this._camera.pos[1]);
            let rayVec = Vec2.getByDirection(angle + this._camera.yaw);

            let distanceToObj = -1;
            let currDistance = 0;
            while (currDistance < this._maxDistance && distanceToObj == -1) {
                rayVec.add(10 / this._rays)
                currDistance += 10 / this._rays;

                let isWall = this.hasWallOn(Vec2.addVectors(cameraPosVec, rayVec));
                if (isWall) {
                    distanceToObj = currDistance;
                }
            }

            if (distanceToObj != -1) {
                let intersectionPoint = Vec2.addVectors(cameraPosVec, rayVec);
                let wallPos = this.getPlacePosByVec(intersectionPoint);
                let isEdge = false;
                if (lastIntersection != wallPos[0]+":"+wallPos[1]) {
                    isEdge = true;
                }

                let height = 2 / distanceToObj;
                
                let canvasFrame = (canvas.height - (canvas.height * height)) / 2;

                ctx.fillStyle = this.getWallColor(this.hasWallOn(intersectionPoint), distanceToObj, i, isEdge);
                
                ctx.fillRect(canvas.width / this._rays * i - 0.5, canvasFrame, canvas.width / this._rays + 1, canvas.height * height);
                this.debug.draws++;

                lastIntersection = wallPos[0] + ":" + wallPos[1];
            }
        }
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
        this.updateControls();

        /*
        if (this._worldRenderer._maxDistance < 30)
            this._worldRenderer._maxDistance+=0.05;

        if (this._worldRenderer._rays < 300)
            this._worldRenderer._rays += 1;*/

        this.debug.ticks++;
    }

    updateControls() {
        if (this.inputManager.isPressed("KeyW")) {
            let moveVec = Vec2.getByDirection(this._camera.yaw);
            moveVec = moveVec.setLength(0.05);
            this._camera.pos[0] += moveVec.x;
            this._camera.pos[1] += moveVec.y;
        }

        if (this.inputManager.isPressed("KeyA")) {
            let moveVec = Vec2.getByDirection(this._camera.yaw + 90);
            moveVec = moveVec.setLength(0.025);
            this._camera.pos[0] -= moveVec.x;
            this._camera.pos[1] -= moveVec.y;
        }

        if (this.inputManager.isPressed("KeyS")) {
            let moveVec = Vec2.getByDirection(this._camera.yaw);
            moveVec = moveVec.setLength(0.05);
            this._camera.pos[0] -= moveVec.x;
            this._camera.pos[1] -= moveVec.y;
        }

        if (this.inputManager.isPressed("KeyD")) {
            let moveVec = Vec2.getByDirection(this._camera.yaw + 90);
            moveVec = moveVec.setLength(0.025);
            this._camera.pos[0] += moveVec.x;
            this._camera.pos[1] += moveVec.y;
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

        if (this.mouse.isDown)
            this._camera.yaw -= delta[0] / 20;
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
}