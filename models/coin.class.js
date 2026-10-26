class Coin extends DrawableObject {
    width = 100;
    height = 100;

    offset = {
        top: 10,
        left: 10,
        right: 10,
        bottom: 10
    };

    constructor(x, y) {
        super().loadImage('img/8_coin/coin_1.png');
        this.x = x;
        this.y = y;
    }
}