class Game {
    constructor() {
        this.mousePos = [0, 0];
        this.mouse = {
            isDown: false,
            pos: [0, 0],
            focus: null
        }


        this._map = [
            [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
            [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1],
            [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1],
            [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1],
            [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1],
            [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1],
            [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
            [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
            [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1],
            [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1],
            [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 0, 0, 1, 1, 1, 1],
            [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 1],
            [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 1],
            [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 1],
            [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 1],
            [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 1],
            [1, 0, 0, 0, 0, 0, 1, 1.4, 1.3, 1.3, 1.4, 1, 0, 0, 0, 0, 0, 0, 1],
            [1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
            [1, 0, 0, 0, 0, 0, 3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
            [1, 0, 0, 0, 0, 0, 3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
            [1, 0, 0, 0, 0, 0, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
            [1, 2, 1, 2, 1, 2, 1, 1, 1, 1, 1, 1, 1.3, 2.4, 3.5, 2.4, 1.3, 1, 1]
        ]

        this._camera = new Camera(this);
        this.inputManager = new InputManager(this);

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

        ctx.fillStyle = "brown"
        ctx.fillRect(0, canvas.height / 2, canvas.width, canvas.height / 2)

        ctx.fillStyle = "blue"
        ctx.fillRect(0, 0, canvas.width, canvas.height / 2)
        this.renderMapOld();
        this.renderMinimap();
        ctx.fillStyle = `black`;
        ctx.fillRect(canvas.width / 2 - 5, canvas.height / 2 - 5, 5, 5)

        ctx.fillStyle = "white";
        ctx.fillText("FPS: "+this.debug.fps+" Ticks: "+this.debug.ticks+" Rays: "+this._rays+" MD: "+this._maxDistance+" Draws: "+this.debug.draws+" Pos: "+this._camera.pos, 10, canvas.height - 60);

        this.debug.fpsC++;
    }

    renderMapOld() {
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

                let height = (this._maxDistance - distanceToObj) / this._maxDistance;
                
                let canvasFrame = (canvas.height - (canvas.height * height)) / 2;

                ctx.fillStyle = this.getWallColor(this.hasWallOn(intersectionPoint), distanceToObj, i, isEdge);
                
                ctx.fillRect(canvas.width / this._rays * i - 0.5, canvasFrame, canvas.width / this._rays + 1, canvas.height * height);
                this.debug.draws++;

                lastIntersection = wallPos[0] + ":" + wallPos[1];
            }
        }
    }

    // Нужно учесть дальний оффсет
    renderMap() {
        for (let i = 0; i <= this._rays; i++) {
            let angle = (-this._rays / 2 + i) * (this._camera.fov / this._rays);

            let currDistance = this._maxDistance;
            while (currDistance > 0) {
                let cameraPosVec = new Vec2(this._camera.pos[0], this._camera.pos[1]);
                let rayVec = Vec2.getByDirection(angle + this._camera.yaw);
                let wall = this.hasWallOn(Vec2.addVectors(cameraPosVec, rayVec.setLength(currDistance)));

                if (wall) {
                    let height = (this._maxDistance - currDistance) / this._maxDistance;
                    let canvasFrame = (canvas.height - (canvas.height * height)) / 2;

                    let intersectionPoint = Vec2.addVectors(cameraPosVec, rayVec.setLength(currDistance));
                    ctx.fillStyle = this.getWallColor(this.hasWallOn(intersectionPoint), currDistance, i);

                    ctx.fillRect(canvas.width / this._rays * i - 0.5, canvasFrame, canvas.width / this._rays + 1, canvas.height * height);
                    this.debug.draws++;

                    rayVec.add(-2)
                    currDistance -= 2;
                } else {
                    rayVec.add(-10 / this._rays)
                    currDistance -= 10 / this._rays;
                }
            }
        }
    }

    getWallColor(id, distance, i, isEdge) {
        let r = 255;
        let g = 255;
        let b = 255;
        let a = 1;

        switch (Math.ceil(id)) {
            case 1: {
                r = 255 * ((this._maxDistance - distance) / (this._maxDistance * 2))
                g = 255 * ((this._maxDistance - distance) / (this._maxDistance * 2))
                b = 255 * ((this._maxDistance - distance) / (this._maxDistance * 2))
                break;
            }

            case 2: {
                r = 255 * ((this._maxDistance - distance) / (this._maxDistance * 2))
                g = 0;
                b = 0;
                break;
            }

            case 3: {
                r = 0;
                g = 255 * ((this._maxDistance - distance) / (this._maxDistance * 2));
                b = 0;
                break;
            }
        }

        if (id % 1 != 0)
            a = id % 1;

        if (isEdge) {
            r = 12;
            g = 12;
            b = 12;
            a = 1;
        }

        return `rgba(${r}, ${g}, ${b}, ${a})`
    }

    renderMinimap() {
        //200
        ctx.fillStyle = "black"
        let onePlace = 400 / this._map.length;
        ctx.fillRect(10, 10, onePlace * this._map[0].length, onePlace * this._map.length);
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


        this._map.forEach((row, y) => {
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

    hasWallOn(vec2) {
        let x = Math.floor(vec2.x);
        let y = Math.floor(vec2.y);

        if (x >= this._map[0].length)
            return false;

        if (y >= this._map.length)
            return false;

        if (x < 0)
            return false;

        if (y < 0)
            return false;
        if (this._map[y][x] != 0) {
            return this._map[y][x];
        }

        return false;
    }

    getPlacePosByVec(vec2) {
        return [Math.floor(vec2.x), Math.floor(vec2.y)];
    }

    update() {
        this.updateControls();
        if (this.debug.ticks == 0) {
            this._maxDistance = 0;
        } else if (this.debug.ticks > 0 && this.debug.ticks < 500) {
            this._maxDistance = this.debug.ticks / 25;
            this._camera.yaw = -this.debug.ticks / 10;
        }


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
            this._rays+=10;


            if (this._rays > 1000)
                this._rays = 1000;
        }

        if (this.inputManager.isPressed("KeyT")) {
            this._rays-=10;

            if (this._rays < 5)
                this._rays = 5;
        }

        if (this.inputManager.isPressed("KeyF")) {
            this._maxDistance += 0.1;
        }

        if (this.inputManager.isPressed("KeyG")) {
            this._maxDistance -= 0.1;
        }

        if (this._camera.pos[0] < 0)
            this._camera.pos[0] = 0;

        if (this._camera.pos[0] > this._map[0].length)
            this._camera.pos[0] = this._map[0].length;

        if (this._camera.pos[1] < 0)
            this._camera.pos[1] = 0;

        if (this._camera.pos[1] > this._map.length)
            this._camera.pos[1] = this._map.length;
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