const level1 = new Level(
    [ 
        new Chicken(),
        new Chicken(),
        new Chicken(),
        new Endboss(),
        new ChickenGreat(),
        new ChickenGreat(),
        new ChickenGreat(),
        

    ],
    [
        new Cloude()
    ],
    [
           new BackgroundObject('img/5_background/layers/air.png', -720,),
        new BackgroundObject('img/5_background/layers/3_third_layer/2.png', -720,),
        new BackgroundObject('img/5_background/layers/2_second_layer/2.png', -720,),
        new BackgroundObject('img/5_background/layers/1_first_layer/2.png', -720,),
         new BackgroundObject('img/5_background/layers/air.png', 0,),
        new BackgroundObject('img/5_background/layers/3_third_layer/1.png', 0,),
        new BackgroundObject('img/5_background/layers/2_second_layer/1.png', 0,),
        new BackgroundObject('img/5_background/layers/1_first_layer/1.png', 0,),
        new BackgroundObject('img/5_background/layers/air.png', 720,),
        new BackgroundObject('img/5_background/layers/3_third_layer/2.png', 720,),
        new BackgroundObject('img/5_background/layers/2_second_layer/2.png', 720,),
        new BackgroundObject('img/5_background/layers/1_first_layer/2.png', 720,),
           new BackgroundObject('img/5_background/layers/air.png', 720*2,),
        new BackgroundObject('img/5_background/layers/3_third_layer/1.png', 720*2,),
        new BackgroundObject('img/5_background/layers/2_second_layer/1.png', 720*2,),
        new BackgroundObject('img/5_background/layers/1_first_layer/1.png', 720*2,),
           new BackgroundObject('img/5_background/layers/air.png', 720*3,),
        new BackgroundObject('img/5_background/layers/3_third_layer/2.png', 720*3,),
        new BackgroundObject('img/5_background/layers/2_second_layer/2.png', 720*3,),
        new BackgroundObject('img/5_background/layers/1_first_layer/2.png', 720*3,),
    ],

      [
        new Bottle(300 + Math.random() * 1800),
        new Bottle(300 + Math.random() * 1800),
        new Bottle(300 + Math.random() * 1800),
        new Bottle(300 + Math.random() * 1800),
        new Bottle(300 + Math.random() * 1800),
        new Bottle(300 + Math.random() * 1800),
        new Bottle(300 + Math.random() * 1800),
        new Bottle(300 + Math.random() * 1800),
        new Bottle(300 + Math.random() * 1800),
        new Bottle(300 + Math.random() * 1800)
    ],

    [
        new Coin(450, 320),
        new Coin(500, 320),
        new Coin(900, 160),
        new Coin(960, 110),
        new Coin(1020, 70),
        new Coin(1080, 110),
        new Coin(1140, 160),
        new Coin(1600, 320),
        new Coin(1800, 100),
        new Coin(2000, 120)
    ],
);