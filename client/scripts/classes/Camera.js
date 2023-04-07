class Camera {
    constructor(game) {
        this._game = game;
        this.pos = [0,4];
        this.yaw = 0;
        this.fov = 70;
    }

    getLookVector() {
        return Vec2.getByDirection(this.yaw);
    }
}