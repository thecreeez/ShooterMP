class WorldRenderer {
    constructor({state, rays, maxDistance, deltaLight}) {
        this._gameState = state;

        this._worldWalls = false;

        this._entities = [];

        this._maxDistance = maxDistance;
        this._rays = rays;

        this._worldHeight = 1;

        this._deltaLight = deltaLight;
    }

    setMap(map) {
        this._worldWalls = map;
    }

    setEntities(entities) {
        this._entities = [];

        entities.forEach((entity) => {
            this._entities.push(Entity.fromServer(entity));
        })
    }

    addEntity(entity) {
        this._entities.push(Entity.fromServer(entity));
    }

    getEntity(name) {
        let entity = false;
        this._entities.forEach((entityCandidate, index) => {
            if (entityCandidate.name == name) {
                entity = entityCandidate;
            }
        });

        return entity;
    } 

    getEntities() {
        return this._entities;
    }

    removeEntity(entityName) {
        let removeI = -1;
        this._entities.forEach((entityCandidate, index) => {
            if (entityCandidate.name == entityName) {
                removeI = index;
            }
        });

        if (removeI != -1)
            this._entities.splice(removeI, 1);
    }

    getCameraLookAt() {
        return null
    }

    render() {
        if (!SHOULD_RENDER_SKYBOX) {
            ctx.fillStyle = "black";

            if (GAME_EVENT_INVERTED_COLORS) {
                ctx.fillStyle = "white";
            }
            ctx.fillRect(0, 0, canvas.width, canvas.height);
        } else {
            this.renderSky();
            this.renderFloor();
        }

        this._renderWallsWithTexture();


        this._entities.sort((a, b) => b.getDistanceToCamera(this) - a.getDistanceToCamera(this)).forEach((entity) => {
            entity.render(this);
        })

        this._renderWallsWithTexture(this._entities);

        if (GAME_EVENT_Y_IS_RAYS)
            this._rays = 5000 / this._gameState._camera.pos[1]
    }

    renderSky() {
        let r = SKY_COLOR[0]
        let g = SKY_COLOR[1]
        let b = SKY_COLOR[2]

        r *= this._deltaLight;
        g *= this._deltaLight;
        b *= this._deltaLight;

        if (GAME_EVENT_INVERTED_COLORS) {
            r = 255 - r;
            g = 255 - g;
            b = 255 - b;
        }

        ctx.fillStyle = `rgb(${r},${g},${b})`;

        ctx.fillRect(0, 0, canvas.width, canvas.height / 2);
    }

    renderFloor() {
        let r = FLOOR_COLOR[0]
        let g = FLOOR_COLOR[1]
        let b = FLOOR_COLOR[2]

        r *= this._deltaLight;
        g *= this._deltaLight;
        b *= this._deltaLight;

        if (GAME_EVENT_INVERTED_COLORS) {
            r = 255 - r;
            g = 255 - g;
            b = 255 - b;
        }

        ctx.fillStyle = `rgb(${r},${g},${b})`;

        ctx.fillRect(0, canvas.height / 2, canvas.width, canvas.height / 2);
    }

    _renderWallsWithTexture(entities) {
        for (let i = 0; i <= this._rays; i++) {
            let angle = (-this._rays / 2 + i) * (this._gameState._camera.fov / this._rays);

            let cameraPosVec = new Vec2(this._gameState._camera.pos[0], this._gameState._camera.pos[1]);
            let rayVec = Vec2.getByDirection(angle + this._gameState._camera.yaw);

            let distanceToObj = -1;
            let currDistance = 0;
            while (currDistance < this._maxDistance && distanceToObj == -1) {
                rayVec.add(5 / this._rays)
                currDistance += 5 / this._rays;

                let isWall = this._getWallId(Vec2.addVectors(cameraPosVec, rayVec));
                if (isWall) {
                    distanceToObj = currDistance;
                }
            }

            if (distanceToObj != -1) {
                let intersectionPoint = Vec2.addVectors(cameraPosVec, rayVec);
                let wallPos = this._getWallPosByVec(intersectionPoint);

                let height = this._worldHeight / distanceToObj / Math.cos(angle * (Math.PI / 180));

                let canvasFrame = (canvas.height - (canvas.height * height)) / 2;

                if (this._gameState._camera.pitch != 0)
                    canvasFrame *= this._gameState._camera.pitch;

                let texture = this._gameState.getGame().getTextureManager().getWallTexture(Math.ceil(this._getWallId(new Vec2(wallPos[0], wallPos[1]))));

                let textureLine = this._getTextureOffset(wallPos, intersectionPoint, texture.length);

                //console.log(textureLine, Math.floor(texture.length * Math.abs(intersectionPoint.x - wallPos[0])))

                if (entities) {
                    entities.forEach((entity) => {
                        let renderPlace = entity.getRenderPlace(this);

                        if (renderPlace.x[0] < canvas.width / this._rays * i - 0.5 && renderPlace.x[1] > canvas.width / this._rays * i - 0.5 + canvas.width / this._rays + 1) {
                            if (distanceToObj < entity.getDistanceToCamera(this)) {
                                this._renderTexturedLine({
                                    x: canvas.width / this._rays * i,
                                    y: canvasFrame,
                                    width: canvas.width / this._rays,
                                    height: canvas.height * height,
                                    xOffset: textureLine,
                                    texture: texture,
                                    distance: distanceToObj
                                });
                            }
                        }
                    })
                } else {
                    this._renderTexturedLine({
                        x: canvas.width / this._rays * i, 
                        y: canvasFrame, 
                        width: canvas.width / this._rays, 
                        height: canvas.height * height, 
                        xOffset: textureLine, 
                        texture: texture, 
                        distance: distanceToObj
                    });
                }
            }
        }
    }

    _getTextureOffset(wallPos, intersectionPos, textureSize) {
        let textureLineY = Math.round(textureSize * Math.abs(intersectionPos.y - wallPos[1]));
        let textureLineX = Math.round(textureSize * Math.abs(intersectionPos.x - wallPos[0]));

        if (textureLineY < textureLineX) {
            let offset = Math.floor(textureSize * (intersectionPos.y - wallPos[1] + 0.5));

            if (offset > textureSize - 1)
                offset--;

            return offset;
        }

        let offset = Math.floor(textureSize * (intersectionPos.x - wallPos[0] + 0.5));

        if (offset > textureSize - 1)
            offset--;

        return offset;
    }

    _renderTexturedLine({x, y, width, height, xOffset, texture, distance}) {
        for (let i = 0; i < texture[0].length; i++) {
            if (GAME_EVENT_MAX_DRAWS != -1 && this._gameState.getGame().debug.draws > GAME_EVENT_MAX_DRAWS)
                return;

            let r = texture[i][xOffset].r;
            let g = texture[i][xOffset].g;
            let b = texture[i][xOffset].b;
            let a = 1

            r = r * ((this._maxDistance - distance) / (this._maxDistance * 1.3))
            g = g * ((this._maxDistance - distance) / (this._maxDistance * 1.3))
            b = b * ((this._maxDistance - distance) / (this._maxDistance * 1.3))
            a = a * ((this._maxDistance - distance) / (this._maxDistance * 0.05))

            if (GAME_EVENT_INVERTED_COLORS) {
                r = 255 -r;
                g = 255 - g;
                b = 255 -b;
            }

            if (GAME_EVENT_DANCING_ROOM && Math.random() > 0.9) {
                r = 255 * Math.random();
                b = 255 * Math.random();
                a = Math.random() + 0.2;
            }

            r += r / distance * 3;
            g += g / distance * 3;
            b += b / distance * 3;

            r *= this._deltaLight;
            g *= this._deltaLight;
            b *= this._deltaLight;

            ctx.fillStyle = `rgba(${r},${g},${b},${a})`;

            ctx.fillRect(
                x + (width / texture.length * xOffset), 
                y + (height / texture.length * i), 
                width * 1.3, 
                height / texture.length
            );

            this._gameState.getGame().debug.draws++;
        }
    }

    _renderTextOnWorld(pos, text, height) {
        let posVec = new Vec2(pos[0], pos[1]);
        let cam = this._gameState._camera;

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
        ctx.fillText(text, canvas.width * xScreen, this.getFloorY(posVec.getLength()) + canvas.height * this._worldHeight / posVec.getLength() / 2 + height / posVec.getLength())
    }

    _getWallId(vec2) {
        let x = Math.round(vec2.x);
        let y = Math.round(vec2.y);

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
        return [Math.round(vec2.x), Math.round(vec2.y)];
    }

    getFloorY(distance) {
        let height = this._worldHeight / distance;

        let canvasFrame = (canvas.height - (canvas.height * height)) / 2;

        if (this._gameState._camera.pitch != 0)
            canvasFrame *= this._gameState._camera.pitch;
        return canvasFrame;
    }
}