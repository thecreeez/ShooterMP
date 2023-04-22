class UIButton extends UIElement {
    constructor({state, pos, text, onClick, isActive, isRender, layer}) {
        super({
            state: state,
            pos: pos,
            onclick: onClick,
            layer: layer,
            isRender: isActive,
            isActive: isActive
        })

        this._text = text;
        this._defaultFontSize = 30;

        this._defaultColor = [0,0,51];
        this._hoverColor = [0,51,204];
        this._inactiveColor = [0,0,20];
    }

    static createDefault({state, pos, text, layer, onClick}) {
        return new UIButton({
            state: state,
            isActive: true,
            isRender: true,
            layer: layer,
            onClick: onClick,
            pos: pos,
            text: text
        })
    }

    render() {
        ctx.font = this._defaultFontSize + "px arial";

        let buttonWidth = ctx.measureText(this._text).width * 1.5;
        let buttonHeight = this._defaultFontSize * 1.3;

        this._setColor();

        let posOffset = [0,0];

        if (this.isClicked)
            posOffset[1] += 5;

        ctx.fillRect(this._pos[0] - buttonWidth / 2 + posOffset[0], this._pos[1] - buttonHeight + posOffset[1], buttonWidth, buttonHeight);

        ctx.fillStyle = "white";
        ctx.fillText(this._text + " " + this.animationState, this._pos[0] - ctx.measureText(this._text).width / 2 + posOffset[0], this._pos[1] - this._defaultFontSize * 0.3 + posOffset[1]);
    }

    _getSize() {
        ctx.font = this._defaultFontSize + "px arial";

        let buttonWidth = ctx.measureText(this._text).width * 1.5;
        let buttonHeight = this._defaultFontSize * 1.3;

        return [buttonWidth, buttonHeight];
    }

    _setColor() {
        let r = this._inactiveColor[0];
        let g = this._inactiveColor[1];
        let b = this._inactiveColor[2];

        if (!this.isActive)
            return ctx.fillStyle = `rgb(${r},${g},${b})`;

        if (this.isHover) {
            r = this._hoverColor[0] - this._defaultColor[0] * (1-this.animationState);
            g = this._hoverColor[1] - this._defaultColor[1] * (1-this.animationState);
            b = this._hoverColor[2] - this._defaultColor[2] * (1-this.animationState);
        } else {
            r = this._defaultColor[0] - this._hoverColor[0] * (1-this.animationState);
            g = this._defaultColor[1] - this._hoverColor[1] * (1-this.animationState);
            b = this._defaultColor[2] - this._hoverColor[2] * (1-this.animationState);
        }

        return ctx.fillStyle = `rgb(${r},${g},${b})`;
    }
}