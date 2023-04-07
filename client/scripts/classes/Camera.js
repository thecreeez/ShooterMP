class Camera {
    constructor(game) {
        this._game = game;
        this.pos = [10,20];
        this.yaw = 0;
        this.fov = 90;
    }

    getLookVector() {
        return Vec2.getByDirection(this.yaw);
    }
}