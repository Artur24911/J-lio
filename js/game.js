let canvas;
let world;
let keyboard = new Keyboard();

function init(){
    canvas = document.getElementById('canvas');
    world = new World(canvas, keyboard);
    console.log('My Charakter is', world.character);    
}

function stopGame() {
    for (let i = 1; i < 99999; i++) {
        clearInterval(i);
    }
}

function restartGame() {
    location.reload();
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