class Bottle extends DrawableObject {
    width = 60;
    height = 70;
    y = 360;

    IMAGES = [
        'img/6_salsa_bottle/1_salsa_bottle_on_ground.png',
        'img/6_salsa_bottle/2_salsa_bottle_on_ground.png'
    ];

    offset = {
        top: 10,
        left: 15,
        right: 15,
        bottom: 5
    };

    constructor(x) {
        super().loadImage(this.IMAGES[Math.floor(Math.random() * this.IMAGES.length)]);
        this.x = x;
    }
}