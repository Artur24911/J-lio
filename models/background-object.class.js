/**
 * Ein Abschnitt einer Hintergrundebene.
 */
class BackgroundObject extends MovableObject {
    width = 720;
    height = 480;


    /**
     * Erzeugt einen Hintergrundabschnitt.
     * @param {string} imagePath - Pfad zum Bild
     * @param {number} x - Position im Level
     */
    constructor(imagePath, x) {
        super().loadImage(imagePath);
        this.x = x;
        this.y = 480 - this.height;
    }
}
