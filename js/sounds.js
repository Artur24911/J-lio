let isMuted = localStorage.getItem('isMuted') == 'true';

let sounds = {
    music: new Audio('audio/gameplay.ogg'),
    menu: new Audio('audio/menusound.mp3'),
    jump: new Audio('audio/Jump.ogg'),
    coin: new Audio('audio/coin.wav'),
    splash: new Audio('audio/splash.wav'),
    throwBottle: new Audio('audio/car_spinning.wav'),
    chickenDead: new Audio('audio/chicken_dead.wav'),
    chickenAppear: new Audio('audio/Chicken_Sound_Effect.mp3'),
    hitCharacter: new Audio('audio/hit_character.mp3'),
    endbossDead: new Audio('audio/deathEndboss.ogg'),
    gameOver: new Audio('audio/gameover.mp3'),
    won: new Audio('audio/Won.wav'),
    pickupBottle: new Audio('audio/pickup.mp3'), 
    yawn: new Audio('audio/Yawn.wav'),
    sleep: new Audio('audio/Sleep.wav')
};

let switchSoundPaths = [
    '../audio/swishes/swish1.wav',
    '../audio/swishes/swish2.wav',
    '../audio/swishes/swish3.wav',
    '../audio/swishes/swish4.wav',
    '../audio/swishes/swish5.wav',
    '../audio/swishes/swish6.wav',
    '../audio/swishes/swish7.wav',
    '../audio/swishes/swish8.wav',
    '../audio/swishes/swish9.wav',
    '../audio/swishes/swish10.wav',
    '../audio/swishes/swish11.wav',
    '../audio/swishes/swish12.wav',
    '../audio/swishes/swish13.wav'
];

let endbossSoundPaths = [
    '../audio/drunk-dwarf-pack/1.ogg',
    '../audio/drunk-dwarf-pack/2.ogg',
    '../audio/drunk-dwarf-pack/3.ogg',
    '../audio/drunk-dwarf-pack/4.ogg',
    '../audio/drunk-dwarf-pack/5.ogg',
    '../audio/drunk-dwarf-pack/6.ogg',
    '../audio/drunk-dwarf-pack/7.ogg',
    '../audio/drunk-dwarf-pack/8.ogg',
    '../audio/drunk-dwarf-pack/9.ogg',
    '../audio/drunk-dwarf-pack/10.ogg',
    '../audio/drunk-dwarf-pack/11.ogg',
    '../audio/drunk-dwarf-pack/12.ogg',
    '../audio/drunk-dwarf-pack/13.ogg',
    '../audio/drunk-dwarf-pack/14.ogg',
    '../audio/drunk-dwarf-pack/15.ogg',
    '../audio/drunk-dwarf-pack/16.ogg',
    '../audio/drunk-dwarf-pack/17.ogg',
    '../audio/drunk-dwarf-pack/18.ogg',
    '../audio/drunk-dwarf-pack/19.ogg',
    '../audio/drunk-dwarf-pack/20.ogg',
    '../audio/drunk-dwarf-pack/21.ogg',
    '../audio/drunk-dwarf-pack/22.ogg',
    '../audio/drunk-dwarf-pack/23.ogg',
    '../audio/drunk-dwarf-pack/24.ogg',
    '../audio/drunk-dwarf-pack/25.ogg',
    '../audio/drunk-dwarf-pack/26.ogg',
    '../audio/drunk-dwarf-pack/27.ogg',
    '../audio/drunk-dwarf-pack/28.ogg',
    '../audio/drunk-dwarf-pack/29.ogg',
    '../audio/drunk-dwarf-pack/30.ogg',
    '../audio/drunk-dwarf-pack/31.ogg',
    '../audio/drunk-dwarf-pack/32.ogg',
    '../audio/drunk-dwarf-pack/33.ogg',
    '../audio/drunk-dwarf-pack/34.ogg',
    '../audio/drunk-dwarf-pack/35.ogg',
    '../audio/drunk-dwarf-pack/36.ogg',
    '../audio/drunk-dwarf-pack/37.ogg',
    '../audio/drunk-dwarf-pack/38.ogg',
];

let switchSounds = loadSounds(switchSoundPaths, 0.5);
let endbossSounds = loadSounds(endbossSoundPaths, 0.8);
let switchIndex = 0;
let endbossIndex = 0;

sounds.music.loop = true;
sounds.music.volume = 0.2;
sounds.menu.loop = true;
sounds.menu.volume = 0.2;
sounds.chickenAppear.volume = 0.4;
let endbossSoundStart = 0.3;
let endbossNextPlay = 0;
let musicStart = 2.5;


function loadSounds(paths, volume) {
    let list = [];
    paths.forEach((path) => {
        let audio = new Audio(path);
        audio.volume = volume;
        list.push(audio);
    });
    return list;
}


function playSound(name) {
    if (isMuted) {
        return;
    }
    sounds[name].currentTime = 0;
    sounds[name].play().catch(() => {});
}


function loopSound(name) {
    if (isMuted || !sounds[name].paused) {
        return;
    }
    sounds[name].loop = true;
    sounds[name].play().catch(() => {});
}


function stopSound(name) {
    stopAudio(sounds[name]);
}


function stopAudio(sound) {
    sound.pause();
    sound.currentTime = 0;
}


function stopAllSounds() {
    Object.values(sounds).forEach(stopAudio);
    switchSounds.forEach(stopAudio);
    endbossSounds.forEach(stopAudio);
    sounds.music.playbackRate = 1;
}


function playSwitchSound() {
    if (isMuted || switchSounds.length == 0) {
        return;
    }
    switchSounds[switchIndex].currentTime = 0;
    switchSounds[switchIndex].play().catch(() => {});
    switchIndex = (switchIndex + 1) % switchSounds.length;
}


function loopEndbossSounds() {
    let now = new Date().getTime();
    if (isMuted || endbossSounds.length == 0 || now < endbossNextPlay) {
        return;
    }
    let sound = endbossSounds[endbossIndex];
    let playTime = getEndbossPlayTime(sound);
    sound.currentTime = endbossSoundStart;
    sound.play().catch(() => {});
    setTimeout(() => stopAudio(sound), playTime * 1000);
    endbossNextPlay = now + playTime * 1000;
    endbossIndex = (endbossIndex + 1) % endbossSounds.length;
}


function getEndbossPlayTime(sound) {
    let length = sound.duration - endbossSoundStart;
    if (isNaN(length) || length > 3) {
        return 3;
    }
    return Math.max(length, 0.3);
}


function stopEndbossSounds() {
    endbossSounds.forEach(stopAudio);
    endbossNextPlay = 0;
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


function pauseSounds() {
    Object.values(sounds).forEach((sound) => sound.pause());
    switchSounds.forEach((sound) => sound.pause());
    endbossSounds.forEach((sound) => sound.pause());
}


function resumeSounds() {
    if (isMuted || isStartScreenVisible() || world.gameEnded) {
        return;
    }
    loopSound('music');
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
        startGameMusic();
    }
}


function startGameMusic() {
    if (sounds.music.paused) {
        sounds.music.currentTime = musicStart;
    }
    loopSound('music');
}

function isStartScreenVisible() {
    return !document.getElementById('startScreen').classList.contains('d-none');
}

function setMusicSpeed(speed) {
    sounds.music.playbackRate = speed;
}

function isAnyPlaying(list) {
    let playing = false;
    list.forEach((sound) => {
        if (!sound.paused && !sound.ended && !sound.error) {
            playing = true;
        }
    });
    return playing;
}