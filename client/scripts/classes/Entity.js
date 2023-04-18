class Entity {
    constructor(pos, color) {
        this.pos = pos;
        this.color = color;

        this.width = 400;
    }

    static fromServer(entity) {
        switch (entity.type) {
            case "player": {
                return new EntityPlayer({
                    name: entity.name,
                    pos: entity.pos,
                });
                break;
            }
        }
    }

    teleport(pos) {
        this.pos = pos;
    }

    render(worldRenderer) {
        if (!this.isNeedRender(worldRenderer))
            return;

        let posVec = new Vec2(this.pos[0], this.pos[1]);
        let cam = worldRenderer._gameState._camera;

        posVec.addVec(new Vec2(-cam.pos[0], -cam.pos[1]));

        let angleToEntity = posVec.getAngle() % 360;

        let angleOnScreen = cam.yaw - angleToEntity;

        if (cam.yaw > 180 && angleToEntity < 180) {
            angleOnScreen -= 360;
        }

        if (cam.yaw < 180 && angleToEntity > 180) {
            angleOnScreen -= 360;
        }

        let xScreen = (-angleOnScreen + 45) / cam.fov;

        ctx.fillStyle = this.getColor(posVec.getLength(), worldRenderer);

        let texture = worldRenderer._gameState.getGame().getTextureManager().getEntityTexture(this.type);

        if (!texture)
            return ctx.fillRect(canvas.width * xScreen, worldRenderer.getFloorY(posVec.getLength()), this.width * 2 / posVec.getLength(), canvas.height * worldRenderer.WORLD_SIZE / posVec.getLength());

        ctx.drawImage(texture, canvas.width * xScreen, worldRenderer.getFloorY(posVec.getLength()), this.width * 2 / posVec.getLength(), canvas.height * worldRenderer.WORLD_SIZE / posVec.getLength())
    }

    getColor(distance, worldRenderer) {
        let distanceModifier = 1 - (distance / worldRenderer._maxDistance);
        return `rgba(${100 * distanceModifier},${255 * distanceModifier},${100 * distanceModifier},1)`
    }

    getRenderPlace(worldRenderer) {
        if (!this.isNeedRender(worldRenderer))
            return false;

        let posVec = new Vec2(this.pos[0], this.pos[1]);
        let cam = worldRenderer._gameState._camera;

        posVec.addVec(new Vec2(-cam.pos[0], -cam.pos[1]));

        let angleToEntity = posVec.getAngle() % 360;

        let angleOnScreen = cam.yaw - angleToEntity;

        if (cam.yaw > 180 && angleToEntity < 180) {
            angleOnScreen -= 360;
        }

        if (cam.yaw < 180 && angleToEntity > 180) {
            angleOnScreen -= 360;
        }

        let xScreen = (-angleOnScreen + 45) / cam.fov;

        let place = {
            x: [canvas.width * xScreen - this.width / posVec.getLength(), canvas.width * xScreen + this.width / posVec.getLength() * 3],
            y: [worldRenderer.getFloorY(posVec.getLength()), worldRenderer.getFloorY(posVec.getLength()) + canvas.height * 2 / posVec.getLength()]
        }
        return place;
    }

    getDistanceToCamera(worldRenderer) {
        let posVec = new Vec2(this.pos[0], this.pos[1]);
        let cam = worldRenderer._gameState._camera;

        posVec.addVec(new Vec2(-cam.pos[0], -cam.pos[1]));

        return posVec.getLength();
    }

    isNeedRender(worldRenderer) {
        let posVec = new Vec2(this.pos[0], this.pos[1]);
        let cam = worldRenderer._gameState._camera;

        posVec.addVec(new Vec2(-cam.pos[0], -cam.pos[1]));

        let angleToEntity = posVec.getAngle();
        let diff = cam.yaw - angleToEntity;

        //if (Math.abs(diff) > cam.fov) {
        //    return false;
        //}

        return true;
    }
}

function degrees_to_radians(degrees) {
    var pi = Math.PI;
    return degrees * (pi / 180);
}