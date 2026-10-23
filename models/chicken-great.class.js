class ChickenGreat extends MovableObject{
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
    'img/3_enemies_chicken/chicken_normal/2_dead/dead.png'
];

   constructor(){

        super().loadImage('img/3_enemies_chicken/chicken_normal/1_walk/1_w.png');
        this.loadImages(this.IMAGES_WALKING);
        this.x = 200 + Math.random() * 500;
        this.speed = 2.5 + Math.random() * 0.55

        this.animate();
    }

    

     animate(){
        
         setInterval(() => {
            this.moveLeft();
        }, 1000 / 30)
        setInterval(() =>{
            this.playAnimation(this.IMAGES_WALKING);
        }, 1000/ 30);
    }



}