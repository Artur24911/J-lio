let isPaused = false;
let isGameStarted = false;
let isPrepared = false;
let originalSetInterval = window.setInterval;

window.setInterval = function (callback, delay) {
    return originalSetInterval(() => {
        if (isGameStarted && !isPaused) {
            callback();
        }
    }, delay);
};

let canvas;
let world;
let keyboard = new Keyboard();
let menuOpened = false;
let pendingImages = 0;


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
}

function startGame() {
    // unlockSounds();
    hideElement('startScreen');
    showElement('canvas');
    showElement('touchControls');
    stopSound('menu');
    beginGame();
}

function restartGame() {
    stopCurrentGame();
    beginGame();
}

function goHome() {
    stopCurrentGame();
    hideElement('canvas');
    hideElement('touchControls');
    showElement('startScreen');
    playBackgroundMusic();
    prepareGame();
}

function stopCurrentGame() {
    world.stop();
    stopGame();
    stopAllSounds();
    hideElement('endButtons');
    isPaused = false;
    isGameStarted = false;
    isPrepared = false;
}

window.addEventListener('load', prepareGame);

function openSettings() {
    document.getElementById('settingsButton').blur();
    updateMuteButton();
    if (isStartScreenVisible()) {
        hideElement('quitButton');
    } else {
        showElement('quitButton');
        if (!world.gameEnded) {
            pauseGame();
        }
    }
    showElement('settingsDialog');
}

function closeSettings() {
    hideElement('settingsDialog');
    resumeGame();
}

function closeImpressum() {
    hideElement('impressumDialog');
    resumeGame();
}

function pauseGame() {
    isPaused = true;
    pauseSounds();
}

function resumeGame() {
    if (!isPaused) {
        return;
    }
    isPaused = false;
    resumeSounds();
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

function quitGame() {
    hideElement('settingsDialog');
    goHome();
}

function openImpressum() {
    hideElement('settingsDialog');
    showElement('impressumDialog');
}

function bindTouchButton(id, key) {
    let button = document.getElementById(id);
    button.addEventListener('touchstart', (event) => {
        event.preventDefault();
        keyboard[key] = true;
    }, { passive: false });
    button.addEventListener('touchend', (event) => {
        event.preventDefault();
        keyboard[key] = false;
    });
    button.addEventListener('touchcancel', () => {
        keyboard[key] = false;
    });
}

function bindTouchControls() {
    bindTouchButton('touchLeft', 'LEFT');
    bindTouchButton('touchRight', 'RIGHT');
    bindTouchButton('touchJump', 'SPACE');
    bindTouchButton('touchThrow', 'C');
}

window.addEventListener('DOMContentLoaded', bindTouchControls);

function toggleFullscreen() {
    if (document.fullscreenElement || document.webkitFullscreenElement) {
        exitFullscreen();
    } else {
        enterFullscreen();
    }
}

function enterFullscreen() {
    let element = document.documentElement;
    if (element.requestFullscreen) {
        element.requestFullscreen();
    } else if (element.webkitRequestFullscreen) {
        element.webkitRequestFullscreen();
    }
}

function exitFullscreen() {
    if (document.exitFullscreen) {
        document.exitFullscreen();
    } else if (document.webkitExitFullscreen) {
        document.webkitExitFullscreen();
    }
}

function isFullscreenSupported() {
    let element = document.documentElement;
    return !!(element.requestFullscreen || element.webkitRequestFullscreen);
}

function setupFullscreenButton() {
    if (!isFullscreenSupported()) {
        hideElement('fullscreenButton');
    }
}

window.addEventListener('DOMContentLoaded', setupFullscreenButton);

function trackImage(img) {
    pendingImages++;
    let finish = () => pendingImages--;
    img.onload = () => {
        if (img.decode) {
            img.decode().then(finish).catch(finish);
        } else {
            finish();
        }
    };
    img.onerror = finish;
}
function waitForImages(callback) {
    let check = originalSetInterval(() => {
        if (pendingImages <= 0) {
            clearInterval(check);
            callback();
        }
    }, 100);
}

function prepareGame() {
    if (isPrepared) {
        return;
    }
    isPrepared = true;
    init();
}

function beginGame() {
    showElement('loadingScreen');
    prepareGame();
    waitForImages(finishLoading);
}

function finishLoading() {
    hideElement('loadingScreen');
    isGameStarted = true;
    world.character.lastAction = new Date().getTime();
    playBackgroundMusic();
}