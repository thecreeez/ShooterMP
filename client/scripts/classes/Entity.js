class Entity {
    constructor(pos, color) {
        this.pos = pos;
        this.color = color;
    }

    render(worldRenderer) {
        if (!this.needRender(worldRenderer))
            return;
    }

    needRender(worldRenderer) {
        let posVec = new Vec2(this.pos[0], this.pos[1]);
        let cam = worldRenderer._game._camera;

        posVec = posVec.addVec(new Vec2(-cam.pos[0], -cam.pos[1])).addVec(cam.getLookVector()).normalize();
        console.log(radians_to_degrees(posVec.getAngle()))
    }
}

function radians_to_degrees(radians) {
    var pi = Math.PI;
    return radians * (180 / pi);
}