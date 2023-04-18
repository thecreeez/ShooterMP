class GameState {
    constructor(id, game) {
        this._id = id;
        this._game = game;

        game.getLoggerRenderer().log("Game", "Loaded " + this._id + " state.", LOG_TYPE.DEFAULT)
    }

    render() {
        ctx.clearRect(0,0,canvas.width, canvas.height);
        ctx.font = "40px arial";
        ctx.fillStyle = "red";
        ctx.fillText("Wrong renderer!", canvas.width / 2, canvas.height / 2);
    }

    update() {

    }

    onmousemove(pos) {
        
    }

    getGame() {
        return this._game;
    }
}