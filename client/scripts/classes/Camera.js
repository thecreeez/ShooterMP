class Camera {
    constructor(game) {
        this._game = game;
        this.pos = [10,20];
        this.yaw = 0;
        this.pitch = 0;
        this.fov = 90;
    }

    getLookVector() {
        return Vec2.getByDirection(this.yaw);
    }

    setYaw(yaw) {
        if (yaw < 0) {
            this.yaw = 360 - (yaw % 360);
        } else {
            this.yaw = yaw % 360;
        }
    }

    move(x,y) {
        if (this._game.canMove(this.pos[0] + x,this.pos[1] + y)) {
            this.pos[0] += x;
            this.pos[1] += y;
        }

    }

    setPos(pos) {
        this.pos = pos;
    }
}