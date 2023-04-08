class WorldRenderer {
    constructor(game) {
        this._game = game;
        this._worldWalls = [
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

        this._entities = [
            new Entity([6,10], "blue")
        ];

        this._maxDistance = 30;
        this._rays = 200;
    }

    render() {
        this._renderWalls();
        this._entities.forEach((entity) => {
            entity.render(this);
        })

        this._renderWalls(this._entities);
    }

    _renderWalls(entities) {
        let lastIntersection = null;
        for (let i = 0; i <= this._rays; i++) {
            let angle = (-this._rays / 2 + i) * (this._game._camera.fov / this._rays);

            let cameraPosVec = new Vec2(this._game._camera.pos[0], this._game._camera.pos[1]);
            let rayVec = Vec2.getByDirection(angle + this._game._camera.yaw);

            let distanceToObj = -1;
            let currDistance = 0;
            while (currDistance < this._maxDistance && distanceToObj == -1) {
                rayVec.add(10 / this._rays)
                currDistance += 10 / this._rays;

                let isWall = this._getWallId(Vec2.addVectors(cameraPosVec, rayVec));
                if (isWall) {
                    distanceToObj = currDistance;
                }
            }

            if (distanceToObj != -1) {
                let intersectionPoint = Vec2.addVectors(cameraPosVec, rayVec);
                let wallPos = this._getWallPosByVec(intersectionPoint);
                let isEdge = false;
                if (lastIntersection != wallPos[0] + ":" + wallPos[1]) {
                    isEdge = true;
                }

                let height = 2 / distanceToObj;

                let canvasFrame = (canvas.height - (canvas.height * height)) / 2;

                ctx.fillStyle = this._getWallColor(this._getWallId(intersectionPoint), distanceToObj, i, isEdge);

                if (entities) {
                    entities.forEach((entity) => {
                        let renderPlace = entity.getRenderPlace(this);

                        if (renderPlace.x[0] < canvas.width / this._rays * i - 0.5 && renderPlace.x[1] > canvas.width / this._rays * i - 0.5 + canvas.width / this._rays + 1) {
                            if (distanceToObj < entity.getDistanceToCamera(this)) {
                                ctx.fillRect(canvas.width / this._rays * i - 0.5, canvasFrame, canvas.width / this._rays + 1, canvas.height * height);
                                this._game.debug.draws++;
                            }
                        }
                    })
                } else {
                    ctx.fillRect(canvas.width / this._rays * i - 0.5, canvasFrame, canvas.width / this._rays + 1, canvas.height * height);
                    this._game.debug.draws++;
                }

                lastIntersection = wallPos[0] + ":" + wallPos[1];
            }
        }
    }

    _renderTextOnWorld(pos, text, height) {
        let posVec = new Vec2(pos[0], pos[1]);
        let cam = this._game._camera;

        posVec.addVec(new Vec2(-cam.pos[0], -cam.pos[1]));

        if (posVec.getLength() > this._maxDistance)
            return;

        let angleToText = posVec.getAngle() % 360;

        let angleOnScreen = cam.yaw - angleToText;

        if (cam.yaw > 180 && angleToText < 180) {
            angleOnScreen -= 360;
        }

        if (cam.yaw < 180 && angleToText > 180) {
            angleOnScreen -= 360;
        }

        let xScreen = (-angleOnScreen + 45) / cam.fov;

        ctx.fillStyle = "red";
        ctx.font = (100 / posVec.getLength())+"px arial";
        ctx.fillText(text, canvas.width * xScreen, this.getFloorY(posVec.getLength()) + canvas.height / posVec.getLength() + height / posVec.getLength())
    }

    _getWallId(vec2) {
        let x = Math.floor(vec2.x);
        let y = Math.floor(vec2.y);

        if (x >= this._worldWalls[0].length)
            return false;

        if (y >= this._worldWalls.length)
            return false;

        if (x < 0)
            return false;

        if (y < 0)
            return false;
        if (this._worldWalls[y][x] != 0) {
            return this._worldWalls[y][x];
        }

        return false;
    }

    _getWallPosByVec(vec2) {
        return [Math.floor(vec2.x), Math.floor(vec2.y)];
    }

    _getWallColor(id, distance, i, isEdge) {
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

    getFloorY(distance) {
        let height = 2 / distance;

        let canvasFrame = (canvas.height - (canvas.height * height)) / 2;
        return canvasFrame;
    }
}