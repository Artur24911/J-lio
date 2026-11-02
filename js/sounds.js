let isMuted = localStorage.getItem('isMuted') == 'true';
let audioContext = null;
let soundBuffers = {};
let switchBuffers = [];
let endbossBuffers = [];
let activeSources = [];
let pendingSounds = 0;
let switchIndex = 0;
let endbossIndex = 0;
let endbossNextPlay = 0;
let endbossSoundStart = 0.3;
let musicStart = 2.5;
let musicSpeed = 1;

let soundFiles = {
    music: { path: 'audio/gameplay.ogg', volume: 0.2 },
    menu: { path: 'audio/menusound.mp3', volume: 0.2 },
    jump: { path: 'audio/Jump.ogg', volume: 1 },
    coin: { path: 'audio/coin.wav', volume: 1 },
    splash: { path: 'audio/splash.wav', volume: 1 },
    throwBottle: { path: 'audio/car_spinning.wav', volume: 1 },
    chickenDead: { path: 'audio/chicken_dead.wav', volume: 1 },
    chickenAppear: { path: 'audio/Chicken_Sound_Effect.mp3', volume: 0.4 },
    hitCharacter: { path: 'audio/hit_character.mp3', volume: 1 },
    endbossDead: { path: 'audio/deathEndboss.ogg', volume: 1 },
    gameOver: { path: 'audio/gameover.mp3', volume: 1 },
    won: { path: 'audio/Won.wav', volume: 1 },
    pickupBottle: { path: 'audio/pickup.mp3', volume: 1 },
    yawn: { path: 'audio/Yawn.wav', volume: 1 },
    sleep: { path: 'audio/Sleep.wav', volume: 1 }
};

let switchSoundPaths = [];
for (let i = 1; i <= 13; i++) {
    switchSoundPaths.push('audio/swishes/swish' + i + '.wav');
}

let endbossSoundPaths = [];
for (let i = 1; i <= 38; i++) {
    endbossSoundPaths.push('audio/drunk-dwarf-pack/' + i + '.ogg');
}


/**
 * Erzeugt den Audio-Kontext des Browsers (auch für ältere Safari-Versionen).
 */
function createAudioContext() {
    let AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (AudioContextClass) {
        audioContext = new AudioContextClass();
    }
}


/**
 * Lädt alle Sounds beim Öffnen der Seite.
 */
function loadAllSounds() {
    createAudioContext();
    if (!audioContext) {
        return;
    }
    loadNamedSounds();
    loadSoundList(switchSoundPaths, switchBuffers);
    loadSoundList(endbossSoundPaths, endbossBuffers);
}


/**
 * Lädt die benannten Sounds aus der Liste soundFiles.
 */
function loadNamedSounds() {
    Object.keys(soundFiles).forEach((name) => {
        loadBuffer(soundFiles[name].path, (buffer) => onSoundLoaded(name, buffer));
    });
}


/**
 * Speichert einen geladenen Sound und startet bei Bedarf die Menümusik.
 * @param {string} name - Name des Sounds
 * @param {AudioBuffer} buffer - Der entpackte Sound
 */
function onSoundLoaded(name, buffer) {
    soundBuffers[name] = buffer;
    if (name == 'menu' && menuOpened) {
        playBackgroundMusic();
    }
}


/**
 * Lädt eine Liste von Sounds in eine Ziel-Liste.
 * @param {string[]} paths - Pfade der Sounddateien
 * @param {AudioBuffer[]} targetList - Liste, in die die Sounds gespeichert werden
 */
function loadSoundList(paths, targetList) {
    paths.forEach((path, i) => loadBuffer(path, (buffer) => targetList[i] = buffer));
}


/**
 * Lädt eine Sounddatei (bei .ogg zur Not als .mp3) und zählt sie als "wird geladen".
 * @param {string} path - Pfad der Sounddatei
 * @param {Function} callback - Wird mit dem entpackten Sound aufgerufen
 */
function loadBuffer(path, callback) {
    pendingSounds++;
    fetchBuffer(path)
        .catch(() => fetchBuffer(path.replace('.ogg', '.mp3')))
        .then(callback)
        .catch(() => {})
        .finally(() => pendingSounds--);
}


/**
 * Holt eine Sounddatei vom Server und entpackt sie.
 * @param {string} path - Pfad der Sounddatei
 * @returns {Promise<AudioBuffer>} Der entpackte Sound
 */
function fetchBuffer(path) {
    return fetch(path)
        .then((response) => response.arrayBuffer())
        .then((data) => new Promise((resolve, reject) => {
            audioContext.decodeAudioData(data, resolve, reject);
        }));
}


/**
 * Spielt einen Sound ab und merkt ihn sich als aktiv.
 * @param {string} name - Name des Sounds
 * @param {AudioBuffer} buffer - Der Sound
 * @param {number} volume - Lautstärke von 0 bis 1
 * @param {boolean} loop - true für Dauerschleife
 * @param {number} offset - Startpunkt in Sekunden
 * @param {number} [duration] - Spieldauer in Sekunden
 */
function startSource(name, buffer, volume, loop, offset, duration) {
    let source = audioContext.createBufferSource();
    source.buffer = buffer;
    source.loop = loop;
    if (name == 'music') {
        source.playbackRate.value = musicSpeed;
    }
    connectSource(source, volume);
    registerSource(name, source);
    source.start(0, offset, duration);
}


/**
 * Verbindet einen Sound über einen Lautstärkeregler mit dem Ausgang.
 * @param {AudioBufferSourceNode} source - Der Sound-Knoten
 * @param {number} volume - Lautstärke von 0 bis 1
 */
function connectSource(source, volume) {
    let gain = audioContext.createGain();
    gain.gain.value = volume;
    source.connect(gain);
    gain.connect(audioContext.destination);
}


/**
 * Merkt sich einen aktiven Sound und entfernt ihn nach dem Ende wieder.
 * @param {string} name - Name des Sounds
 * @param {AudioBufferSourceNode} source - Der Sound-Knoten
 */
function registerSource(name, source) {
    let entry = { name: name, source: source };
    activeSources.push(entry);
    source.onended = () => removeSource(entry);
}


/**
 * Entfernt einen Sound aus der Liste der aktiven Sounds.
 * @param {Object} entry - Eintrag mit Name und Sound-Knoten
 */
function removeSource(entry) {
    activeSources = activeSources.filter((e) => e !== entry);
}


/**
 * Stoppt einen aktiven Sound.
 * @param {Object} entry - Eintrag mit Name und Sound-Knoten
 */
function stopEntry(entry) {
    try {
        entry.source.stop();
    } catch (error) {}
    removeSource(entry);
}


/**
 * Prüft, ob ein Sound gerade läuft.
 * @param {string} name - Name des Sounds
 * @returns {boolean} true, wenn der Sound läuft
 */
function isSoundPlaying(name) {
    return activeSources.some((entry) => entry.name == name);
}


/**
 * Spielt einen Sound einmal ab.
 * @param {string} name - Name des Sounds
 */
function playSound(name) {
    if (isMuted || !audioContext || !soundBuffers[name]) {
        return;
    }
    startSource(name, soundBuffers[name], soundFiles[name].volume, false, 0);
}


/**
 * Spielt einen Sound nur ab, wenn er nicht schon läuft.
 * @param {string} name - Name des Sounds
 */
function playSoundIfFree(name) {
    if (isSoundPlaying(name)) {
        return;
    }
    playSound(name);
}


/**
 * Spielt einen Sound in Dauerschleife, falls er nicht schon läuft.
 * @param {string} name - Name des Sounds
 */
function loopSound(name) {
    if (isMuted || !audioContext || !soundBuffers[name] || isSoundPlaying(name)) {
        return;
    }
    let offset = name == 'music' ? musicStart : 0;
    startSource(name, soundBuffers[name], soundFiles[name].volume, true, offset);
}


/**
 * Stoppt alle Sounds mit diesem Namen.
 * @param {string} name - Name des Sounds
 */
function stopSound(name) {
    activeSources.filter((entry) => entry.name == name).forEach(stopEntry);
}


/**
 * Stoppt alle Sounds und setzt das Musiktempo zurück.
 */
function stopAllSounds() {
    activeSources.slice().forEach(stopEntry);
    musicSpeed = 1;
}


/**
 * Ändert das Tempo der Hintergrundmusik.
 * @param {number} speed - 1 ist normal, größer ist schneller
 */
function setMusicSpeed(speed) {
    musicSpeed = speed;
    activeSources.filter((entry) => entry.name == 'music').forEach((entry) => {
        entry.source.playbackRate.value = speed;
    });
}


/**
 * Spielt den nächsten Wurf-Sound der Flasche ab.
 */
function playSwitchSound() {
    let list = switchBuffers.filter((buffer) => buffer);
    if (isMuted || !audioContext || list.length == 0) {
        return;
    }
    startSource('switch', list[switchIndex % list.length], 0.5, false, 0);
    switchIndex++;
}


/**
 * Spielt die Sounds des Endbosses nacheinander ab (jeder höchstens 3 Sekunden).
 */
function loopEndbossSounds() {
    let now = new Date().getTime();
    let list = endbossBuffers.filter((buffer) => buffer);
    if (isMuted || !audioContext || list.length == 0 || now < endbossNextPlay) {
        return;
    }
    let buffer = list[endbossIndex % list.length];
    let playTime = Math.max(Math.min(buffer.duration - endbossSoundStart, 3), 0.3);
    startSource('endboss', buffer, 0.8, false, endbossSoundStart, playTime);
    endbossNextPlay = now + playTime * 1000;
    endbossIndex++;
}


/**
 * Stoppt die Sounds des Endbosses.
 */
function stopEndbossSounds() {
    stopSound('endboss');
    endbossNextPlay = 0;
}


/**
 * Schaltet den Ton nach einem Klick frei (Pflicht auf dem iPhone).
 */
function unlockSounds() {
    if (!audioContext) {
        return;
    }
    audioContext.resume();
    let source = audioContext.createBufferSource();
    source.buffer = audioContext.createBuffer(1, 1, 22050);
    source.connect(audioContext.destination);
    source.start(0);
}


/**
 * Hält alle Sounds an.
 */
function pauseSounds() {
    if (audioContext) {
        audioContext.suspend();
    }
}


/**
 * Setzt die Sounds nach einer Pause fort.
 */
function resumeSounds() {
    if (audioContext) {
        audioContext.resume();
        playBackgroundMusic();
    }
}


/**
 * Schaltet den Ton ein oder aus und speichert die Wahl im Local Storage.
 */
function toggleMute() {
    isMuted = !isMuted;
    localStorage.setItem('isMuted', isMuted);
    updateMuteButton();
    document.getElementById('muteButton').blur();
    if (isMuted) {
        stopAllSounds();
    } else if (!isPaused) {
        playBackgroundMusic();
    }
}


/**
 * Passt die Beschriftung des Ton-Buttons an.
 */
function updateMuteButton() {
    let button = document.getElementById('muteButton');
    if (isMuted) {
        button.textContent = 'Ton aus';
    } else {
        button.textContent = 'Ton an';
    }
}


/**
 * Startet die Menümusik oder die Spielmusik, je nachdem wo man ist.
 */
function playBackgroundMusic() {
    if (isStartScreenVisible()) {
        loopSound('menu');
    } else if (!world.gameEnded) {
        loopSound('music');
    }
}


/**
 * Prüft, ob der Startbildschirm sichtbar ist.
 * @returns {boolean} true, wenn der Startbildschirm sichtbar ist
 */
function isStartScreenVisible() {
    return !document.getElementById('startScreen').classList.contains('d-none');
}


window.addEventListener('load', loadAllSounds);
