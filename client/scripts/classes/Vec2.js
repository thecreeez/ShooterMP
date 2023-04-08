class Vec2 {
    static getByDirection(angle) {
        return new Vec2(Math.cos(angle * Math.PI / 180), Math.sin(angle * Math.PI / 180))
    }

    static addVectors(vec1, vec2) {
        return new Vec2(vec1.x + vec2.x, vec1.y + vec2.y);
    }

    constructor(x,y) {
        this.x = x;
        this.y = y;
    }

    normalize() {
        let length = this.getLength();

        return new Vec2(this.x * (1 / length), this.y * (1 / length));
    }

    getAngle() {
        var angle = Math.atan2(this.y, this.x);   //radians 
        var degrees = 180 * angle / Math.PI;  //degrees
        return (360 + Math.round(degrees)) % 360; //round number, avoid decimal fragments
    }

    getLength() {
        return Math.sqrt((this.x * this.x) + (this.y * this.y))
    }

    setLength(length) {
        let normalized = this.normalize();
        return new Vec2(normalized.x * length, normalized.y * length);
    }

    add(num) {
        let addVec = this.normalize();
        this.x += addVec.x * num;
        this.y += addVec.y * num;
        return this;
    }

    addVec(vec) {
        this.x += vec.x;
        this.y += vec.y;
        return this;
    }
}