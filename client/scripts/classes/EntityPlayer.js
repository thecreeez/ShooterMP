class EntityPlayer extends Entity {
    constructor({ name,pos }) {
        super(pos, "green");
        this.name = name;
        this.width = 400;

        this.type = "player";
    }

    render(worldRenderer) {
        super.render(worldRenderer)

        if (!this.isNeedRender(worldRenderer))
            return;

        worldRenderer._renderTextOnWorld(this.pos, this.name, 20)
    }

    getName() {
        return this.name;
    }
}