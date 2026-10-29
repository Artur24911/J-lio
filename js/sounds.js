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


function createAudioContext() {
    let AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (AudioContextClass) {
        audioContext = new AudioContextClass();
    }
}


function loadAllSounds() {
    createAudioContext();
    if (!audioContext) {
        return;
    }
    Object.keys(soundFiles).forEach((name) => {
        loadBuffer(soundFiles[name].path, (buffer) => {
            soundBuffers[name] = buffer;
            if (name == 'menu' && menuOpened) {
                playBackgroundMusic();
            }
        });
    });
    switchSoundPaths.forEach((path, i) => loadBuffer(path, (buffer) => switchBuffers[i] = buffer));
    endbossSoundPaths.forEach((path, i) => loadBuffer(path, (buffer) => endbossBuffers[i] = buffer));
}

window.addEventListener('load', loadAllSounds);


function loadBuffer(path, callback) {
    pendingSounds++;
    fetchBuffer(path)
        .catch(() => fetchBuffer(path.replace('.ogg', '.mp3')))
        .then(callback)
        .catch(() => {})
        .finally(() => pendingSounds--);
}


function fetchBuffer(path) {
    return fetch(path)
        .then((response) => response.arrayBuffer())
        .then((data) => new Promise((resolve, reject) => {
            audioContext.decodeAudioData(data, resolve, reject);
        }));
}


function startSource(name, buffer, volume, loop, offset, duration) {
    let source = audioContext.createBufferSource();
    let gain = audioContext.createGain();
    source.buffer = buffer;
    source.loop = loop;
    gain.gain.value = volume;
    if (name == 'music') {
        source.playbackRate.value = musicSpeed;
    }
    source.connect(gain);
    gain.connect(audioContext.destination);
    let entry = { name: name, source: source };
    activeSources.push(entry);
    source.onended = () => removeSource(entry);
    if (duration) {
        source.start(0, offset, duration);
    } else {
        source.start(0, offset);
    }
}


function removeSource(entry) {
    activeSources = activeSources.filter((e) => e !== entry);
}


function stopEntry(entry) {
    try {
        entry.source.stop();
    } catch (error) {}
    removeSource(entry);
}


function isSoundPlaying(name) {
    return activeSources.some((entry) => entry.name == name);
}


function playSound(name) {
    if (isMuted || !audioContext || !soundBuffers[name]) {
        return;
    }
    startSource(name, soundBuffers[name], soundFiles[name].volume, false, 0);
}


function loopSound(name) {
    if (isMuted || !audioContext || !soundBuffers[name] || isSoundPlaying(name)) {
        return;
    }
    let offset = name == 'music' ? musicStart : 0;
    startSource(name, soundBuffers[name], soundFiles[name].volume, true, offset);
}


function stopSound(name) {
    activeSources.filter((entry) => entry.name == name).forEach(stopEntry);
}


function stopAllSounds() {
    activeSources.slice().forEach(stopEntry);
    musicSpeed = 1;
}


function setMusicSpeed(speed) {
    musicSpeed = speed;
    activeSources.filter((entry) => entry.name == 'music').forEach((entry) => {
        entry.source.playbackRate.value = speed;
    });
}


function playSwitchSound() {
    let list = switchBuffers.filter((buffer) => buffer);
    if (isMuted || !audioContext || list.length == 0) {
        return;
    }
    startSource('switch', list[switchIndex % list.length], 0.5, false, 0);
    switchIndex++;
}


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


function stopEndbossSounds() {
    stopSound('endboss');
    endbossNextPlay = 0;
}


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


function pauseSounds() {
    if (audioContext) {
        audioContext.suspend();
    }
}


function resumeSounds() {
    if (audioContext) {
        audioContext.resume();
        playBackgroundMusic();
    }
}


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


function updateMuteButton() {
    let button = document.getElementById('muteButton');
    if (isMuted) {
        button.textContent = 'Ton aus';
    } else {
        button.textContent = 'Ton an';
    }
}


function playBackgroundMusic() {
    if (isStartScreenVisible()) {
        loopSound('menu');
    } else if (!world.gameEnded) {
        loopSound('music');
    }
}


function isStartScreenVisible() {
    return !document.getElementById('startScreen').classList.contains('d-none');
}

function playSoundIfFree(name) {
    if (isSoundPlaying(name)) {
        return;
    }
    playSound(name);
}