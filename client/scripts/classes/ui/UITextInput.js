class UITextInput extends UIElement {
    static getMinWidth() {
        return 200;
    }

    constructor({ state, pos, placeholder, onClick, isActive, isRender, layer, maxSymbols, blackList, whiteList }) {
        super({
            state: state,
            pos: pos,
            onclick: onClick,
            layer: layer,
            isRender: isRender,
            isActive: isActive
        })

        this.value = "";
        this._placeholder = placeholder;
        this._defaultFontSize = 30;
        this._defaultWidth = UITextInput.getMinWidth();

        this.maxSymbols = maxSymbols;
        this.blackList = blackList;
        this.whiteList = whiteList;

        this.onclick = (elem) => {
            elem.getState().setSelectedUI(elem);
        }

        this.type = "input"
    }

    static createDefault({ state, pos, placeholder, layer, maxSymbols, blackList, whiteList }) {
        return new UITextInput({
            state: state,
            pos: pos,
            placeholder: placeholder,
            layer: layer,
            isActive: true,
            isRender: true,
            maxSymbols: maxSymbols,
            blackList: blackList,
            whiteList: whiteList
        })
    }

    render() {
        ctx.font = this._defaultFontSize + "px arial";

        let size = this._getSize();

        ctx.fillStyle = `rgb(${HUD_COLORS.TEXTINPUT_BACKGROUND[0]},${HUD_COLORS.TEXTINPUT_BACKGROUND[1]},${HUD_COLORS.TEXTINPUT_BACKGROUND[2]})`;

        ctx.fillRect(this._pos[0] - size[0] / 2, this._pos[1] - size[1], size[0], size[1]);

        if (this.isHover || this.isSelected()) {
            ctx.strokeStyle = `rgb(${HUD_COLORS.TEXTINPUT_HOVER_STROKE[0]},${HUD_COLORS.TEXTINPUT_HOVER_STROKE[1]},${HUD_COLORS.TEXTINPUT_HOVER_STROKE[2]})`
            ctx.lineWidth = 5
            ctx.strokeRect(this._pos[0] - size[0] / 2, this._pos[1] - size[1], size[0], size[1])
        }

        if (this.value.length < 1) {
            ctx.fillStyle = "rgba(0,0,0,0.5)";
            ctx.fillText(this._placeholder, this._pos[0] - size[0] / 2 + 5, this._pos[1] - this._defaultFontSize * 0.3);
        } else {
            ctx.fillStyle = "rgba(0,0,0,1)";
            ctx.fillText(this.value, this._pos[0] - size[0] / 2 + 5, this._pos[1] - this._defaultFontSize * 0.3);
        }
    }

    setValue(value) {
        this.value = value;
    }

    addInValue(symb) {
        if (this.isBlacklistEnabled() && this.isInBlackList(symb)) {
            return false;
        }

        if (this.isWhitelistEnabled() && !this.isInWhiteList(symb)) {
            return false;
        }

        if (this.maxSymbols <= this.value.length) {
            return false;
        }

        if (symb.length > 1) {
            return false;
        }

        this.value += symb;
    }

    getValue() {
        return this.value;
    }

    removeSymb() {
        if (this.value.length > 0) {
            this.value = this.value.slice(0, this.value.length - 1)
        }
    }

    _getSize() {
        ctx.font = this._defaultFontSize + "px arial";

        let textInputWidth = this._defaultFontSize * 1.3;

        return [this._defaultWidth, textInputWidth];
    }

    isWhitelistEnabled() {
        if (!this.whiteList)
            return false;

        return true;
    }

    isBlacklistEnabled() {
        if (!this.blackList)
            return false;

        return true;
    }

    isInBlackList(symb) {
        return false;
    }

    isInWhiteList(symb) {
        return true;
    }
}