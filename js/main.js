/**
 * Sebastian Fojcik
 */

const canvas = document.getElementById('myCanvas');
const webgl = new WebGL(canvas);

const world = new World(webgl);

canvas.onclick = function (e) {
    const x = e.offsetX;
    const y = e.offsetY;

    world.addQuad(x, y, 100, new Color("#FF0000"));
};

window.addEventListener("load", () => {
    setup();
});

Game = {
    lastTime: 0,
    mainLoop: null
};

/**
 * Funkcja uruchamiana przy uruchomieniu gry.
 */
function setup() {
    start();
}

/**
 * Główna pętla gry.
 */
function draw(time) {
    const delta = time - Game.lastTime;
    Game.lastTime = time;
    // Wyczyść ekran
    webgl.clear(new Color("#171a2e"));

    world.update(delta);
    world.draw();

    Game.mainLoop = window.requestAnimationFrame(draw);
}

/**
 * Uruchomienie głównej pętli
 */
function start() {
    if(!Game.mainLoop) {
        Game.lastTime = window.performance.now();
        Game.mainLoop = window.requestAnimationFrame(draw);
        console.log("START");
        document.getElementById("state").textContent = "";
    }
}

/**
 * Zatrzymanie głównej pętli
 */
function stop() {
    if(Game.mainLoop) {
        window.cancelAnimationFrame(Game.mainLoop);
        console.log("PAUZA");
        document.getElementById("state").innerHTML = "&nbsp; PAUZA";
    }
    Game.mainLoop = null;
}

function Test1() {
    start();
}
function Test2() {
    stop();
}
