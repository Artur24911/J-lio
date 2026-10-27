let canvas;
let world;
let keyboard = new Keyboard();

function init() {
    canvas = document.getElementById('canvas');
    initLevel();
    world = new World(canvas, keyboard);
}

function startGame() {
    hideElement('startScreen');
    showElement('canvas');
    init();
}

function restartGame() {
    stopCurrentGame();
    init();
}

function goHome() {
    stopCurrentGame();
    hideElement('canvas');
    showElement('startScreen');
}

function stopCurrentGame() {
    world.stop();
    stopGame();
    hideElement('endButtons');
}

function showElement(id) {
    document.getElementById(id).classList.remove('d-none');
}

function hideElement(id) {
    document.getElementById(id).classList.add('d-none');
}

function stopGame() {
    for (let i = 1; i < 99999; i++) {
        clearInterval(i);
    }
}


window.addEventListener('keydown', (event) => {
    let key = event.key;
    if(key == "ArrowRight"){
        keyboard.RIGHT = true;
    }
    if(key == "ArrowLeft"){
        keyboard.LEFT = true;
    }
    if(key == "ArrowUp"){
        keyboard.UP = true;
    }
    if(key == "ArrowDown"){
        keyboard.DOWN = true;
    }
    if(key == " "){
        keyboard.SPACE = true;
    }
    if(key.toLowerCase() == "c"){
        keyboard.C = true;
       }
});

window.addEventListener('keyup', (event) => {
    let key = event.key;
    if(key == "ArrowRight"){
        keyboard.RIGHT = false;
    }
    if(key == "ArrowLeft"){
        keyboard.LEFT = false;
    }
    if(key == "ArrowUp"){
        keyboard.UP = false;
    }
    if(key == "ArrowDown"){
        keyboard.DOWN = false;
    }
    if(key == " "){
        keyboard.SPACE = false;
    }
    if(key.toLowerCase() ==  "c"){
        keyboard.C = false;
    }
});