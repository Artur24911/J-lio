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

/** Creates the browser's audio context (also for older Safari versions). */
function createAudioContext() {
    let AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (AudioContextClass) {
        audioContext = new AudioContextClass();
    }
}

/** Loads all sounds when the page opens. */
function loadAllSounds() {
    createAudioContext();
    if (!audioContext) {
        return;
    }
    loadNamedSounds();
    loadSoundList(switchSoundPaths, switchBuffers);
    loadSoundList(endbossSoundPaths, endbossBuffers);
}

/** Loads the named sounds from the soundFiles list. */
function loadNamedSounds() {
    Object.keys(soundFiles).forEach((name) => {
        loadBuffer(soundFiles[name].path, (buffer) => onSoundLoaded(name, buffer));
    });
}

/** Saves a loaded sound and starts the menu music when needed. */
function onSoundLoaded(name, buffer) {
    soundBuffers[name] = buffer;
    if (name == 'menu' && menuOpened) {
        playBackgroundMusic();
    }
}

/** Loads a list of sounds into a target list. */
function loadSoundList(paths, targetList) {
    paths.forEach((path, i) => loadBuffer(path, (buffer) => targetList[i] = buffer));
}

/** Loads a sound file (if it's .ogg, as a last resort .mp3) and counts it as "loading". */
function loadBuffer(path, callback) {
    pendingSounds++;
    fetchBuffer(path)
        .catch(() => fetchBuffer(path.replace('.ogg', '.mp3')))
        .then(callback)
        .catch(() => {})
        .finally(() => pendingSounds--);
}

/** Fetch a sound file from the server and unpack it. */
function fetchBuffer(path) {
    return fetch(path)
        .then((response) => response.arrayBuffer())
        .then((data) => new Promise((resolve, reject) => {
            audioContext.decodeAudioData(data, resolve, reject);
        }));
}

/** Plays a sound and remembers it as active. */
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

/** Connects a sound to the output through a volume control. */
function connectSource(source, volume) {
    let gain = audioContext.createGain();
    gain.gain.value = volume;
    source.connect(gain);
    gain.connect(audioContext.destination);
}

/** Remembers an active sound and removes it again after it ends. */
function registerSource(name, source) {
    let entry = { name: name, source: source };
    activeSources.push(entry);
    source.onended = () => removeSource(entry);
}

/** Removes a sound from the list of active sounds. */
function removeSource(entry) {
    activeSources = activeSources.filter((e) => e !== entry);
}

/** Stops an active sound. */
function stopEntry(entry) {
    try {
        entry.source.stop();
    } catch (error) {}
    removeSource(entry);
}

/** Checks if a sound is currently playing. */
function isSoundPlaying(name) {
    return activeSources.some((entry) => entry.name == name);
}

/** Plays a sound once. */
function playSound(name) {
    if (isMuted || !audioContext || !soundBuffers[name]) {
        return;
    }
    startSource(name, soundBuffers[name], soundFiles[name].volume, false, 0);
}

/** Only plays a sound if it's not already playing. */
function playSoundIfFree(name) {
    if (isSoundPlaying(name)) {
        return;
    }
    playSound(name);
}

/** Plays a sound on loop if it's not already playing. */
function loopSound(name) {
    if (isMuted || !audioContext || !soundBuffers[name] || isSoundPlaying(name)) {
        return;
    }
    let offset = name == 'music' ? musicStart : 0;
    startSource(name, soundBuffers[name], soundFiles[name].volume, true, offset);
}

/** Stops all sounds with this name. */
function stopSound(name) {
    activeSources.filter((entry) => entry.name == name).forEach(stopEntry);
}

/** Stops all sounds and resets the music tempo. */
function stopAllSounds() {
    activeSources.slice().forEach(stopEntry);
    musicSpeed = 1;
}

/** Changes the tempo of the background music. */
function setMusicSpeed(speed) {
    musicSpeed = speed;
    activeSources.filter((entry) => entry.name == 'music').forEach((entry) => {
        entry.source.playbackRate.value = speed;
    });
}

/** Plays the next throw sound of the bottle. */
function playSwitchSound() {
    let list = switchBuffers.filter((buffer) => buffer);
    if (isMuted || !audioContext || list.length == 0) {
        return;
    }
    startSource('switch', list[switchIndex % list.length], 0.5, false, 0);
    switchIndex++;
}

/** Plays the sounds of the final boss one after the other (each for no more than 3 seconds). */
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

/** Stops the sounds of the final boss. */
function stopEndbossSounds() {
    stopSound('endboss');
    endbossNextPlay = 0;
}

/** Unlocks the sound after a click (mandatory on iPhone). */
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

/** stops sound */
function pauseSounds() {
    if (audioContext) {
        audioContext.suspend();
    }
}

/** Resumes the sounds after a pause. */
function resumeSounds() {
    if (audioContext) {
        audioContext.resume();
        playBackgroundMusic();
    }
}

/** Turns the sound on or off and saves the choice in local storage */
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

/** Adjusts the label of the sound button. */
function updateMuteButton() {
    let button = document.getElementById('muteButton');
    if (isMuted) {
        button.textContent = 'Ton aus';
    } else {
        button.textContent = 'Ton an';
    }
}

/** Starts the menu music or the game music, depending on where you are. */
function playBackgroundMusic() {
    if (isStartScreenVisible()) {
        loopSound('menu');
    } else if (!world.gameEnded) {
        loopSound('music');
    }
}

/** Checks if the home screen is visible. */
function isStartScreenVisible() {
    return !document.getElementById('startScreen').classList.contains('d-none');
}

window.addEventListener('load', loadAllSounds);