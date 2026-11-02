let isPaused = false;
let isGameStarted = false;
let isPrepared = false;
let originalSetInterval = window.setInterval;
let canvas;
let world;
let keyboard = new Keyboard();
let menuOpened = false;
let pendingImages = 0;
let keyMap = {
    arrowright: 'RIGHT',
    arrowleft: 'LEFT',
    arrowup: 'UP',
    arrowdown: 'DOWN',
    ' ': 'SPACE',
    c: 'C'
};

/**Replaces setInterval: Game loops only run when the game is started and not paused. */
window.setInterval = function (callback, delay) {
    return originalSetInterval(() => {
        if (isGameStarted && !isPaused) {
            callback();
        }
    }, delay);
};

/** Opens the menu after the first key press or tap (Press a key). */
function openMenu() {
    if (menuOpened) {
        return;
    }
    menuOpened = true;
    unlockSounds();
    hideElement('pressKey');
    showElement('startButtons');
    showElement('settingsButton');
    updateMuteButton();
    playBackgroundMusic();
}

/** Generates level and world (prepared in the background). */
function init() {
    canvas = document.getElementById('canvas');
    initLevel();
    world = new World(canvas, keyboard);
}

/** Start the game using the start button. */
function startGame() {
    unlockSounds();
    hideElement('startScreen');
    showElement('canvas');
    showElement('touchControls');
    stopSound('menu');
    beginGame();
}

/** Restart the game after it ends without reloading the page. */
function restartGame() {
    stopCurrentGame();
    beginGame();
}

/** Quit the game and return to the main menu. */
function goHome() {
    stopCurrentGame();
    hideElement('canvas');
    hideElement('touchControls');
    showElement('settingsButton');
    showElement('startScreen');
    playBackgroundMusic();
    prepareGame();
}

/** Stops drawing, intervals, sounds, and inputs of the running game. */
function stopCurrentGame() {
    world.stop();
    stopGame();
    stopAllSounds();
    resetKeyboard();
    hideElement('endButtons');
    isPaused = false;
    isGameStarted = false;
    isPrepared = false;
}

/** Sets all key states to 'not pressed'. */
function resetKeyboard() {
    keyboard.LEFT = false;
    keyboard.RIGHT = false;
    keyboard.UP = false;
    keyboard.DOWN = false;
    keyboard.SPACE = false;
    keyboard.C = false;
}

/** Opens the settings window and pauses any game currently running. */
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

/** Closes the settings window and resumes the game. */
function closeSettings() {
    hideElement('settingsDialog');
    resumeGame();
}

/** Closes the impressum and resumes the game. */
function closeImpressum() {
    hideElement('impressumDialog');
    resumeGame();
}

/** Pauses the game and the sounds. */
function pauseGame() {
    isPaused = true;
    pauseSounds();
}

/** Resumes a paused game. */
function resumeGame() {
    if (!isPaused) {
        return;
    }
    isPaused = false;
    resumeSounds();
}

/** Displays an element. */
function showElement(id) {
    document.getElementById(id).classList.remove('d-none');
}

/** Hides an element. */
function hideElement(id) {
    document.getElementById(id).classList.add('d-none');
}

/** Stops all running intervals. */
function stopGame() {
    for (let i = 1; i < 99999; i++) {
        clearInterval(i);
    }
}

/** Remembers whether a game button was pressed or released. */
function setKeyState(event, isPressed) {
    let name = keyMap[event.key.toLowerCase()];
    if (name) {
        keyboard[name] = isPressed;
    }
}

/** Ends the current game through the settings and shows the start screen. */
function quitGame() {
    hideElement('settingsDialog');
    goHome();
}

/** Open the imprint from the settings. */
function openImpressum() {
    hideElement('settingsDialog');
    showElement('impressumDialog');
}

/** Connects a touch button to a key. */
function bindTouchButton(id, key) {
    let button = document.getElementById(id);
    button.addEventListener('touchstart', (event) => handleTouch(event, key, true), { passive: false });
    button.addEventListener('touchend', (event) => handleTouch(event, key, false));
    button.addEventListener('touchcancel', (event) => handleTouch(event, key, false));
}

/** Sets the button of a touch button and prevents scrolling and zooming. */
function handleTouch(event, key, isPressed) {
    event.preventDefault();
    keyboard[key] = isPressed;
}

/** Connect all four touch buttons. */
function bindTouchControls() {
    bindTouchButton('touchLeft', 'LEFT');
    bindTouchButton('touchRight', 'RIGHT');
    bindTouchButton('touchJump', 'SPACE');
    bindTouchButton('touchThrow', 'C');
}

/** Switches between full screen and normal view. */
function toggleFullscreen() {
    if (document.fullscreenElement || document.webkitFullscreenElement) {
        exitFullscreen();
    } else {
        enterFullscreen();
    }
}

/** Switches to full-screen mode. */
function enterFullscreen() {
    let element = document.documentElement;
    if (element.requestFullscreen) {
        element.requestFullscreen();
    } else if (element.webkitRequestFullscreen) {
        element.webkitRequestFullscreen();
    }
}

/** Exits full screen mode. */
function exitFullscreen() {
    if (document.exitFullscreen) {
        document.exitFullscreen();
    } else if (document.webkitExitFullscreen) {
        document.webkitExitFullscreen();
    }
}

/** Checks if the browser supports fullscreen. */
function isFullscreenSupported() {
    let element = document.documentElement;
    return !!(element.requestFullscreen || element.webkitRequestFullscreen);
}

/** Hide the fullscreen button if the browser can't do fullscreen. */
function setupFullscreenButton() {
    if (!isFullscreenSupported()) {
        hideElement('fullscreenButton');
    }
}

/** An image counts as 'loading' until it is fully loaded and unpacked. */
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

/** Wait until all the images and sounds are loaded, and then call the function. */
function waitForImages(callback) {
    let check = originalSetInterval(() => {
        if (pendingImages <= 0 && pendingSounds <= 0) {
            clearInterval(check);
            callback();
        }
    }, 100);
}

/** Prepares the game in the background (once per run). */
function prepareGame() {
    if (isPrepared) {
        return;
    }
    isPrepared = true;
    init();
}

/** Shows the loading screen and starts the game as soon as everything is loaded. */
function beginGame() {
    showElement('loadingScreen');
    showElement('touchControls');
    showElement('settingsButton');
    prepareGame();
    waitForImages(finishLoading);
}

/** Unlocks the game after loading and starts the music. */
function finishLoading() {
    hideElement('loadingScreen');
    isGameStarted = true;
    world.character.lastAction = new Date().getTime();
    playBackgroundMusic();
}

window.addEventListener('keydown', openMenu);
window.addEventListener('click', openMenu);
window.addEventListener('load', prepareGame);
window.addEventListener('keydown', (event) => setKeyState(event, true));
window.addEventListener('keyup', (event) => setKeyState(event, false));
window.addEventListener('DOMContentLoaded', bindTouchControls);
window.addEventListener('DOMContentLoaded', setupFullscreenButton);
