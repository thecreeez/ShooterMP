class UISlider extends UIElement {
    static getMinWidth() {
        return 200;
    }

    constructor({ state, pos, text, isActive, isRender, layer, min, max, value }) {
        super({
            state: state,
            pos: pos,
            onclick: (elem) => {
                console.log(elem)
            },
            layer: layer,
            isRender: isRender,
            isActive: isActive
        })

        this.value = value;
        this._text = text;
        this._defaultFontSize = 20;
        this._defaultWidth = UISlider.getMinWidth();

        this.min = min;
        this.max = max;

        this.onclick = (elem) => {
            elem.getState().setSelectedUI(elem);
        }

        this.type = "input";
    }

    static createDefault({ state, pos, text, layer, min, max, value }) {
        return new UISlider({
            state: state,
            pos: pos,
            text: text,
            layer: layer,
            isActive: true,
            isRender: true,
            min: min,
            max: max,
            value: value
        })
    }

    render() {
        ctx.font = this._defaultFontSize + "px arial";

        let size = this._getSize();

        ctx.fillStyle = `rgb(${HUD_COLORS.SLIDER_BACKGROUND[0]},${HUD_COLORS.SLIDER_BACKGROUND[1]},${HUD_COLORS.SLIDER_BACKGROUND[2]})`;

        ctx.fillRect(this._pos[0] - size[0] / 2, this._pos[1] - size[1], size[0], size[1]);

        ctx.fillStyle = `rgb(${HUD_COLORS.SLIDER_FOREGROUND[0]},${HUD_COLORS.SLIDER_FOREGROUND[1]},${HUD_COLORS.SLIDER_FOREGROUND[2]})`;
        ctx.fillRect(this._pos[0] - size[0] / 2, this._pos[1] - size[1], size[0] * this.getValueOffset(), size[1]);

        ctx.fillStyle = `white`;
        ctx.fillText(this.min, this._pos[0] - size[0] / 2 - this._defaultFontSize / 4, this._pos[1] - size[1] - 5);
        ctx.fillText(this.max, this._pos[0] + size[0] / 2 - this._defaultFontSize / 4, this._pos[1] - size[1] - 5);

        if (this.value != this.min && this.value != this.max)
            ctx.fillText(Math.round(this.value * 100) / 100, this._pos[0] - size[0] / 2 + size[0] * this.getValueOffset() - this._defaultFontSize / 2   , this._pos[1] - size[1] - 5);
    }

    update() {
        super.update();

        if (!this.isClicked && this.isSelected())
            this.getState().setSelectedUI(null)
    }

    checkHover(pos) {
        if (this.isSelected()) {
            let size = this._getSize();

            let startWidth = (this._pos[0] - size[0] / 2);

            console.log(startWidth)

            if (pos[0] - startWidth < 0) {
                this.value = this.min;
                return;
            }
            
            let proportion = (pos[0] - startWidth) / size[0];

            if (proportion > 1) {
                this.value = this.max;
                return;
            }

            this.value = this.min + (proportion * this.max);
        }
    }

    getValueOffset() {
        return this.value / this.max;
    }

    setValue(value) {
        this.value = value;
    }

    getValue() {
        return this.value;
    }

    _getSize() {
        ctx.font = this._defaultFontSize + "px arial";

        let textInputWidth = this._defaultFontSize * 1.3;

        return [this._defaultWidth, 10];
    }
}