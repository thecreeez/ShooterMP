canvas.onmousedown = (ev) => {
    const pos = [ev.clientX, ev.clientY];

    GameInstance.onmousedown(pos);
}

canvas.onmouseup = (ev) => {
    const pos = [ev.clientX, ev.clientY];

    GameInstance.onmouseup(pos);
}

canvas.onmousemove = (ev) => {
    const pos = [ev.clientX, ev.clientY];

    GameInstance.onmousemove(pos);
}