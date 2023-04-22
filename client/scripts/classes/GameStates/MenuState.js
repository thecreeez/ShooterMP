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
            text: "Test button",
            layer: 0,
            onClick: (elem) => {
                GameInstance.getLoggerRenderer().log("Game", "Кнопка работает, жесть!", LOG_TYPE.FINE)
            }
        }))

        this.elements[1].setActive(true);
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

    onmousemove(pos) {
        this.elements.forEach((elem) => {
            elem.checkHover(pos);
        })
    }

    onmousedown(pos) {
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