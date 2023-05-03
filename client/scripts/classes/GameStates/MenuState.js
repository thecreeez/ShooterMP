class MenuState extends GameState {
    constructor(game) {
        super("main_menu", game);

        this.elements = [];

        this.DEFAULT_IP = "localhost";
        this.DEFAULT_PORT = 2020;

        this.elements.push(UIButton.createDefault({
            state: this,
            pos: [canvas.width / 2, canvas.height / 2],
            text: "Join",
            layer: 0,
            onClick: async (elem) => {
                if (!localStorage.getItem("username")) {
                    GameInstance.getLoggerRenderer().log("Game", "Невозможно подключиться, установите имя (setNickname())", LOG_TYPE.ERROR)
                }

                try {
                    await GameInstance._packetManager.connect(this.DEFAULT_IP, this.DEFAULT_PORT);
                    GameInstance._packetManager.onConnect(() => {
                        GameInstance._packetManager.send("handshake/" + localStorage.getItem("username"))
                    })
                } catch (e) {
                    console.error(e);
                }
            }
        }))

        this.elements.push(UIButton.createDefault({
            state: this,
            pos: [canvas.width / 2, canvas.height / 2 + this.elements[0]._defaultFontSize * 1.5],
            text: "Update",
            layer: 0,
            onClick: (elem) => {
                let name = elem.getState().getNameInput();

                if (name.getValue() == localStorage.getItem("username")) {
                    GameInstance.getLoggerRenderer().log("Game", "Имя не изменилось", LOG_TYPE.DEFAULT)
                    return;
                }
                GameInstance.getLoggerRenderer().log("Game", "Установлено имя: " + name.getValue(), LOG_TYPE.FINE)
                localStorage.setItem("username", name.getValue())
            }
        }))

        this.elements.push(UITextInput.createDefault({
            state: this,
            pos: [canvas.width / 2, canvas.height / 2 + this.elements[0]._defaultFontSize * 1.5 * 2],
            placeholder: "Your name",
            maxSymbols: 10,
            layer: 0,
            blackList: [" "]
        }))

        this.elements.push(UISlider.createDefault({
            state: this,
            pos: [canvas.width / 2, canvas.height / 2 + this.elements[0]._defaultFontSize * 1.5 * 4],
            text: "Sensivity",
            min: 0,
            max: 5,
            value: 2.5
        }))

        if (localStorage.getItem("username"))
            this.elements[2].setValue(localStorage.getItem("username"))
    }

    getNameInput() {
        return this.elements[2];
    }


    render() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        this.elements.forEach((elem) => {
            elem.render();
        })
    }

    update() {
        this.elements.forEach((elem) => {
            elem.update();
        })
    }

    onkeydown(ev) {
        if (!this.getSelectedUI())
            return false;

        if (this.getSelectedUI().type != "input")
            return false;

        if (ev.code == "Backspace") {
            this.getSelectedUI().removeSymb();    
        } else {
            this.getSelectedUI().addInValue(ev.key);
        }
    }

    onmousemove(pos) {
        this.elements.forEach((elem) => {
            elem.checkHover(pos);
        })
    }

    onmousedown(pos) {
        super.onmousedown(pos);
        this.elements.forEach((elem) => {
            elem.checkClick(pos);
        })
    }

    onmouseup(pos) {
        this.elements.forEach((elem) => {
            if (elem.isClicked)
                elem.isClicked = false;
        })
    }
}