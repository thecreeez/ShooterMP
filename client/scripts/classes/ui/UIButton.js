class UIButton extends UIElement {
    static getMinWidth() {
        return 200;
    }

    constructor({state, pos, text, onClick, isActive, isRender, layer}) {
        super({
            state: state,
            pos: pos,
            onclick: onClick,
            layer: layer,
            isRender: isRender,
            isActive: isActive
        })

        this._text = text;
        this._defaultFontSize = 30;
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

        if (buttonWidth < UIButton.getMinWidth())
            buttonWidth = UIButton.getMinWidth();

        this._setColor();

        let posOffset = [0,0];

        if (this.isClicked)
            posOffset[1] += 5;

        ctx.fillRect(this._pos[0] - buttonWidth / 2 + posOffset[0], this._pos[1] - buttonHeight + posOffset[1], buttonWidth, buttonHeight);

        ctx.fillStyle = "white";
        ctx.fillText(this._text, this._pos[0] - ctx.measureText(this._text).width / 2 + posOffset[0], this._pos[1] - this._defaultFontSize * 0.3 + posOffset[1]);
    }

    _getSize() {
        ctx.font = this._defaultFontSize + "px arial";

        let buttonWidth = ctx.measureText(this._text).width * 1.5;
        let buttonHeight = this._defaultFontSize * 1.3;

        if (buttonWidth < UIButton.getMinWidth())
            buttonWidth = UIButton.getMinWidth();

        return [buttonWidth, buttonHeight];
    }

    _setColor() {
        let r = HUD_COLORS.BUTTON_INACTIVE[0];
        let g = HUD_COLORS.BUTTON_INACTIVE[1];
        let b = HUD_COLORS.BUTTON_INACTIVE[2];

        if (!this.isActive)
            return ctx.fillStyle = `rgb(${r},${g},${b})`;

        if (this.isHover) {
            r = HUD_COLORS.BUTTON_HOVER[0] - HUD_COLORS.BUTTON_DEFAULT[0] * (1-this.animationState);
            g = HUD_COLORS.BUTTON_HOVER[1] - HUD_COLORS.BUTTON_DEFAULT[1] * (1-this.animationState);
            b = HUD_COLORS.BUTTON_HOVER[2] - HUD_COLORS.BUTTON_DEFAULT[2] * (1-this.animationState);
        } else {
            r = HUD_COLORS.BUTTON_DEFAULT[0] + HUD_COLORS.BUTTON_HOVER[0] * (1-this.animationState);
            g = HUD_COLORS.BUTTON_DEFAULT[1] + HUD_COLORS.BUTTON_HOVER[1] * (1-this.animationState);
            b = HUD_COLORS.BUTTON_DEFAULT[2] + HUD_COLORS.BUTTON_HOVER[2] * (1-this.animationState);
        }

        return ctx.fillStyle = `rgb(${r},${g},${b})`;
    }
}