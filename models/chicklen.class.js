class Chicken extends MovableObject{
    height = 60;
    width =  40; 
    y = 360;
    constructor(){

        super().loadImage('../img/3_enemies_chicken/chicken_small/1_walk/1_w.png');
       
        this.x = 200 + Math.random() * 500;
        this.animate();
    }

    animate() {
        setInterval(() => {
            this.x -= 0.5;
        }, 1000 / 60)

    }

    

}