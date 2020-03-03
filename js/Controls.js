document.addEventListener("keydown", keyPressed, false);
document.addEventListener("keyup", keyReleased, false);

let RIGHT, LEFT, SPACE = false;

function keyPressed(e) {
    switch(e.key) {
        case "ArrowRight": RIGHT = true; break;
        case "ArrowLeft":  LEFT = true; break;
        case " ": SPACE = true; break;
    }
}
function keyReleased(e) {
    switch(e.key) {
        case "ArrowRight": RIGHT = false; break;
        case "ArrowLeft":  LEFT = false; break;
        case " ": SPACE = false; break;
    }
}