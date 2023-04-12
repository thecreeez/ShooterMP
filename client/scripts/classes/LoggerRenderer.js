class LoggerRenderer {
    constructor(game) {
        this._game = game;
        this.logs = []
    }

    log(module, text, type) {
        this.logs.unshift({
            module: module,
            text: text,
            type: type,
            time: 300,
        });
    }

    render(pos, maxShowLog) {
        this.logs.forEach((log, i) => {
            ctx.font = "15px arial";

            if (i < maxShowLog) {
                ctx.fillStyle = log.type+(log.time / 100)+")";

                let index = (maxShowLog - i);

                if (maxShowLog > this.logs.length)
                    index = this.logs.length - i;
                ctx.fillText(`[${log.module}]: ${log.text}`, pos[0], pos[1] + index * 15 + 15);
            }

            log.time--;
        })

        this.removeExpired();
    }

    removeExpired() {
        this.logs = this.logs.filter(log => log.time > 0);
    }
}

const LOG_TYPE = {
    ERROR: `rgba(255,0,0,`,
    FINE: "rgba(0,255,0,",
    DEFAULT: "rgba(255,255,255,"
}