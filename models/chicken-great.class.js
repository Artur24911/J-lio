class ChickenGreat extends MovableObject{
    hasEnteredScreen = false;
    height = 90;
    width = 70;
    y = 340;

    offset = {
        top: 10,
        left: 5,
        right: 5,
        bottom: 10
    };

IMAGES_WALKING = [
    'img/3_enemies_chicken/chicken_normal/1_walk/1_w.png',
    'img/3_enemies_chicken/chicken_normal/1_walk/2_w.png',
    'img/3_enemies_chicken/chicken_normal/1_walk/3_w.png'
];

IMAGES_DEAD = [
    'img/3_enemies_chicken/chicken_normal/2_dead/dead.png',
    'img/grabkreuz_chicken_spiel.png'
];

   constructor(){

        super().loadImage('img/3_enemies_chicken/chicken_normal/1_walk/1_w.png');
        this.loadImages(this.IMAGES_WALKING);
        this.x = 800 + Math.random() * 1200;
        this.speed = 2.5 + Math.random() * 0.55
        this.loadImages(this.IMAGES_DEAD);
        this.animate();
    }

    

     animate(){
        
         setInterval(() => {
            if (!this.isDead()) {
            this.moveLeft();
        }
        }, 1000 / 30)
        setInterval(() =>{
            if (this.isDead()) {
            this.img = this.imageCache[this.IMAGES_DEAD[0]];
        } else {
            this.playAnimation(this.IMAGES_WALKING);
        }
        }, 1000/ 8);
    }



}