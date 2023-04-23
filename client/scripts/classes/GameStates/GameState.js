class GameState {
    constructor(id, game) {
        this._id = id;
        this._game = game;
        this._selectedUI = null;

        console.log("Loaded " + this._id + " state.")
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

    onmousedown(pos) {
        this.setSelectedUI(null);
    }

    onmouseup(pos) {
        
    }

    onkeydown(ev) {
        
    }

    getGame() {
        return this._game;
    }

    setSelectedUI(elem) {
        this._selectedUI = elem;
    }

    getSelectedUI() {
        return this._selectedUI;
    }
}