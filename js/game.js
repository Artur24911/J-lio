let canvas;
let world;
let keyboard = new Keyboard();
let menuOpened = false;


function openMenu() {
    if (menuOpened) {
        return;
    }
    menuOpened = true;
    hideElement('pressKey');
    showElement('startButtons');
    showElement('settingsButton');
    updateMuteButton();
    playBackgroundMusic();
}

window.addEventListener('keydown', openMenu);
window.addEventListener('click', openMenu);

function init() {
    canvas = document.getElementById('canvas');
    initLevel();
    world = new World(canvas, keyboard);
    playBackgroundMusic();
}

function startGame() {
    hideElement('startScreen');
    showElement('canvas');
    stopSound('menu');
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
    playBackgroundMusic();
}

function stopCurrentGame() {
    world.stop();
    stopGame();
    stopAllSounds();
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

function openSettings() {
    document.getElementById('settingsButton').blur();
    updateMuteButton();
    if (isStartScreenVisible()) {
        hideElement('quitButton');
    } else {
        showElement('quitButton');
    }
    showElement('settingsDialog');
}

function quitGame() {
    hideElement('settingsDialog');
    goHome();
}

function openImpressum() {
    hideElement('settingsDialog');
    showElement('impressumDialog');
}