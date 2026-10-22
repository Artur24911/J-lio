class Chicken extends MovableObject{
    height = 60;
    width =  40; 
    y = 360;
    IMAGES_WALKING = [
        '../img/3_enemies_chicken/chicken_small/1_walk/1_w.png',
        '../img/3_enemies_chicken/chicken_small/1_walk/2_w.png',
        '../img/3_enemies_chicken/chicken_small/1_walk/3_w.png',
    ];

    offset = {
        top: -10,
        left: 20,
        right: 20,
        bottom: -10
    };

    constructor(){

        super().loadImage('../img/3_enemies_chicken/chicken_small/1_walk/1_w.png');
        this.loadImages(this.IMAGES_WALKING);
        this.x = 200 + Math.random() * 500;
        this.speed = 0.15 + Math.random() * 0.55

        this.animate();
    }

    

     animate(){
        
         setInterval(() => {
            this.moveLeft();
        }, 1000 / 60)
        setInterval(() =>{
            this.playAnimation(this.IMAGES_WALKING);
        }, 1000/ 60);
    }

    

}