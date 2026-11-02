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


/**
 * Ersetzt setInterval: Spiel-Schleifen laufen nur, wenn das Spiel gestartet und nicht pausiert ist.
 * @param {Function} callback - Funktion, die regelmäßig ausgeführt wird
 * @param {number} delay - Abstand in Millisekunden
 * @returns {number} ID des Intervalls
 */
window.setInterval = function (callback, delay) {
    return originalSetInterval(() => {
        if (isGameStarted && !isPaused) {
            callback();
        }
    }, delay);
};


/**
 * Öffnet das Menü nach dem ersten Tastendruck oder Tippen (Press a key).
 */
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


/**
 * Erzeugt Level und Welt (wird im Hintergrund vorbereitet).
 */
function init() {
    canvas = document.getElementById('canvas');
    initLevel();
    world = new World(canvas, keyboard);
}


/**
 * Startet das Spiel über den Start-Button.
 */
function startGame() {
    unlockSounds();
    hideElement('startScreen');
    showElement('canvas');
    showElement('touchControls');
    stopSound('menu');
    beginGame();
}


/**
 * Startet das Spiel nach Spielende neu, ohne die Seite neu zu laden.
 */
function restartGame() {
    stopCurrentGame();
    beginGame();
}


/**
 * Beendet das Spiel und kehrt zum Startbildschirm zurück.
 */
function goHome() {
    stopCurrentGame();
    hideElement('canvas');
    hideElement('touchControls');
    showElement('settingsButton');
    showElement('startScreen');
    playBackgroundMusic();
    prepareGame();
}


/**
 * Stoppt Zeichnen, Intervalle, Sounds und Eingaben des laufenden Spiels.
 */
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


/**
 * Setzt alle Tastenzustände auf "nicht gedrückt".
 */
function resetKeyboard() {
    keyboard.LEFT = false;
    keyboard.RIGHT = false;
    keyboard.UP = false;
    keyboard.DOWN = false;
    keyboard.SPACE = false;
    keyboard.C = false;
}


/**
 * Öffnet das Einstellungsfenster und pausiert dabei ein laufendes Spiel.
 */
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


/**
 * Schließt das Einstellungsfenster und setzt das Spiel fort.
 */
function closeSettings() {
    hideElement('settingsDialog');
    resumeGame();
}


/**
 * Schließt das Impressum und setzt das Spiel fort.
 */
function closeImpressum() {
    hideElement('impressumDialog');
    resumeGame();
}


/**
 * Hält das Spiel und die Sounds an.
 */
function pauseGame() {
    isPaused = true;
    pauseSounds();
}


/**
 * Setzt ein pausiertes Spiel fort.
 */
function resumeGame() {
    if (!isPaused) {
        return;
    }
    isPaused = false;
    resumeSounds();
}


/**
 * Zeigt ein Element an.
 * @param {string} id - ID des Elements
 */
function showElement(id) {
    document.getElementById(id).classList.remove('d-none');
}


/**
 * Versteckt ein Element.
 * @param {string} id - ID des Elements
 */
function hideElement(id) {
    document.getElementById(id).classList.add('d-none');
}


/**
 * Beendet alle laufenden Intervalle.
 */
function stopGame() {
    for (let i = 1; i < 99999; i++) {
        clearInterval(i);
    }
}


/**
 * Merkt sich, ob eine Spieltaste gedrückt oder losgelassen wurde.
 * @param {KeyboardEvent} event - Tastenereignis
 * @param {boolean} isPressed - true bei Drücken, false bei Loslassen
 */
function setKeyState(event, isPressed) {
    let name = keyMap[event.key.toLowerCase()];
    if (name) {
        keyboard[name] = isPressed;
    }
}


/**
 * Beendet das laufende Spiel über die Einstellungen und zeigt den Startbildschirm.
 */
function quitGame() {
    hideElement('settingsDialog');
    goHome();
}


/**
 * Öffnet das Impressum aus den Einstellungen.
 */
function openImpressum() {
    hideElement('settingsDialog');
    showElement('impressumDialog');
}


/**
 * Verbindet einen Touch-Button mit einer Taste.
 * @param {string} id - ID des Buttons
 * @param {string} key - Name der Taste im Keyboard-Objekt
 */
function bindTouchButton(id, key) {
    let button = document.getElementById(id);
    button.addEventListener('touchstart', (event) => handleTouch(event, key, true), { passive: false });
    button.addEventListener('touchend', (event) => handleTouch(event, key, false));
    button.addEventListener('touchcancel', (event) => handleTouch(event, key, false));
}


/**
 * Setzt die Taste eines Touch-Buttons und verhindert Scrollen und Zoomen.
 * @param {TouchEvent} event - Touch-Ereignis
 * @param {string} key - Name der Taste im Keyboard-Objekt
 * @param {boolean} isPressed - true beim Berühren, false beim Loslassen
 */
function handleTouch(event, key, isPressed) {
    event.preventDefault();
    keyboard[key] = isPressed;
}


/**
 * Verbindet alle vier Touch-Buttons.
 */
function bindTouchControls() {
    bindTouchButton('touchLeft', 'LEFT');
    bindTouchButton('touchRight', 'RIGHT');
    bindTouchButton('touchJump', 'SPACE');
    bindTouchButton('touchThrow', 'C');
}


/**
 * Wechselt zwischen Vollbild und normaler Ansicht.
 */
function toggleFullscreen() {
    if (document.fullscreenElement || document.webkitFullscreenElement) {
        exitFullscreen();
    } else {
        enterFullscreen();
    }
}


/**
 * Schaltet in den Vollbildmodus.
 */
function enterFullscreen() {
    let element = document.documentElement;
    if (element.requestFullscreen) {
        element.requestFullscreen();
    } else if (element.webkitRequestFullscreen) {
        element.webkitRequestFullscreen();
    }
}


/**
 * Verlässt den Vollbildmodus.
 */
function exitFullscreen() {
    if (document.exitFullscreen) {
        document.exitFullscreen();
    } else if (document.webkitExitFullscreen) {
        document.webkitExitFullscreen();
    }
}


/**
 * Prüft, ob der Browser Vollbild unterstützt.
 * @returns {boolean} true, wenn Vollbild möglich ist
 */
function isFullscreenSupported() {
    let element = document.documentElement;
    return !!(element.requestFullscreen || element.webkitRequestFullscreen);
}


/**
 * Versteckt den Vollbild-Button, wenn der Browser kein Vollbild kann.
 */
function setupFullscreenButton() {
    if (!isFullscreenSupported()) {
        hideElement('fullscreenButton');
    }
}


/**
 * Zählt ein Bild als "wird geladen", bis es fertig geladen und entpackt ist.
 * @param {HTMLImageElement} img - Das Bild
 */
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


/**
 * Wartet, bis alle Bilder und Sounds geladen sind, und ruft dann die Funktion auf.
 * @param {Function} callback - Wird nach dem Laden aufgerufen
 */
function waitForImages(callback) {
    let check = originalSetInterval(() => {
        if (pendingImages <= 0 && pendingSounds <= 0) {
            clearInterval(check);
            callback();
        }
    }, 100);
}


/**
 * Bereitet das Spiel im Hintergrund vor (einmal pro Durchgang).
 */
function prepareGame() {
    if (isPrepared) {
        return;
    }
    isPrepared = true;
    init();
}


/**
 * Zeigt den Ladebildschirm und startet das Spiel, sobald alles geladen ist.
 */
function beginGame() {
    showElement('loadingScreen');
    showElement('touchControls');
    showElement('settingsButton');
    prepareGame();
    waitForImages(finishLoading);
}


/**
 * Gibt das Spiel nach dem Laden frei und startet die Musik.
 */
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
