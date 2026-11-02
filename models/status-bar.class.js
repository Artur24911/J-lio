/**
 * Eine Statusanzeige für Leben, Flaschen oder Münzen.
 */
class StatusBar extends DrawableObject {
    STATUS_HEALTH = [
        'img/7_statusbars/1_statusbar/2_statusbar_health/orange/0.png',
        'img/7_statusbars/1_statusbar/2_statusbar_health/orange/20.png',
        'img/7_statusbars/1_statusbar/2_statusbar_health/orange/40.png',
        'img/7_statusbars/1_statusbar/2_statusbar_health/orange/60.png',
        'img/7_statusbars/1_statusbar/2_statusbar_health/orange/80.png',
        'img/7_statusbars/1_statusbar/2_statusbar_health/orange/100.png'
    ];

    STATUS_COIN = [
        'img/7_statusbars/1_statusbar/1_statusbar_coin/orange/0.png',
        'img/7_statusbars/1_statusbar/1_statusbar_coin/orange/20.png',
        'img/7_statusbars/1_statusbar/1_statusbar_coin/orange/40.png',
        'img/7_statusbars/1_statusbar/1_statusbar_coin/orange/60.png',
        'img/7_statusbars/1_statusbar/1_statusbar_coin/orange/80.png',
        'img/7_statusbars/1_statusbar/1_statusbar_coin/orange/100.png'
    ];

    STATUS_BOTTLE = [
        'img/7_statusbars/1_statusbar/3_statusbar_bottle/orange/0.png',
        'img/7_statusbars/1_statusbar/3_statusbar_bottle/orange/20.png',
        'img/7_statusbars/1_statusbar/3_statusbar_bottle/orange/40.png',
        'img/7_statusbars/1_statusbar/3_statusbar_bottle/orange/60.png',
        'img/7_statusbars/1_statusbar/3_statusbar_bottle/orange/80.png',
        'img/7_statusbars/1_statusbar/3_statusbar_bottle/orange/100.png'
    ];

    STATUS_ENDBOSS = [
        'img/7_statusbars/2_statusbar_endboss/orange/orange0.png',
        'img/7_statusbars/2_statusbar_endboss/orange/orange20.png',
        'img/7_statusbars/2_statusbar_endboss/orange/orange40.png',
        'img/7_statusbars/2_statusbar_endboss/orange/orange60.png',
        'img/7_statusbars/2_statusbar_endboss/orange/orange80.png',
        'img/7_statusbars/2_statusbar_endboss/orange/orange100.png'
    ];

    percentage = 100;


    /**
     * Erzeugt eine Statusanzeige.
     * @param {string} type - 'health', 'bottle' oder 'coin'
     * @param {number} y - Höhe der Anzeige im Bild
     */
    constructor(type, y) {
        super();
        this.images = this.getImages(type);
        this.loadImages(this.images);
        this.x = 10;
        this.y = y;
        this.width = 200;
        this.height = 40;
        this.setPercentage(type == 'health' ? 100 : 0);
    }


    /**
     * Liefert die Bilderfolge passend zum Typ.
     * @param {string} type - 'health', 'bottle' oder 'coin'
     * @returns {string[]} Liste der Bildpfade
     */
    getImages(type) {
        if (type == 'bottle') {
            return this.STATUS_BOTTLE;
        }
        if (type == 'coin') {
            return this.STATUS_COIN;
        }
        return this.STATUS_HEALTH;
    }


    /**
     * Setzt den Füllstand und zeigt das passende Bild.
     * @param {number} percentage - Wert von 0 bis 100
     */
    setPercentage(percentage) {
        this.percentage = percentage;
        let path = this.images[this.resolveImageIndex()];
        this.img = this.imageCache[path];
    }


    /**
     * Rechnet den Füllstand in die Nummer des Bildes um.
     * @returns {number} Nummer des Bildes von 0 bis 5
     */
    resolveImageIndex() {
        return Math.floor(this.percentage / 20);
    }
}
