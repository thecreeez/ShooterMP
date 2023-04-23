class InputManager {
    constructor(game) {
        this._game = game;

        this._prevMouseX = 0;
        this._prevMouseY = 0;

        this._mouseX = 0;
        this._mouseY = 0;

        this._deltaX = 0;
        this._deltaY = 0;

        this._mouseDown = false;
        this._prevMouseDown = false;
        this._clicked = false;

        this._keys = new Map();

        window.onmousedown = function (e) {
            GameInstance.getInputManager()._mouseDown = true;
        }

        window.onmouseup = function (e) {
            GameInstance.getInputManager()._mouseDown = false;
        }

        window.onmousemove = function (e) {
            GameInstance.getInputManager()._mouseX = e.clientX;
            GameInstance.getInputManager()._mouseY = e.clientY;
        }

        window.onkeydown = function (e) {
            GameInstance.getInputManager()._keys.set(e.code, true);

            GameInstance.getInputManager().onkeydown(e);
        }

        window.onkeyup = function (e) {
            GameInstance.getInputManager()._keys.set(e.code, false);
        }
    }

    update() {
        this.updateValues();

        for (let key of this._keys) {
            if (!key[1])
                continue;

            this.onkeypress(key);
        }
    }

    updateValues() {
        this._deltaX = this._mouseX - this._prevMouseX;
        this._deltaY = this._mouseY - this._prevMouseY;

        this._prevMouseX = this._mouseX;
        this._prevMouseY = this._mouseY;

        if (this._mouseDown && !this._prevMouseDown) {
            this._clicked = true;
        } else {
            this._clicked = false;
        }

        this._prevMouseDown = this._mouseDown;
    }

    onkeypress(key) {
        if (this._game.getState().onkeypress)
            this._game.getState().onkeypress(key);
    }

    onkeydown(ev) {
        GameInstance.getState().onkeydown({
            key: ev.key,
            code: ev.code
        })
    }

    getKeys() {
        return this._keys;
    }

    isPressed(key) {
        if (this._game.getInputManager().getKeys().get(key))
            return true;

        return false;
    }
}