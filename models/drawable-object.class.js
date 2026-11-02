/**
 * Basisklasse für alles, was auf das Canvas gezeichnet wird.
 */
class DrawableObject {
    x = 120;
    y = 80;
    height = 150;
    width = 100;
    img;
    imageCache = {};
    currentImage = 0;


    /**
     * Lädt ein einzelnes Bild und meldet es beim Ladezähler an.
     * @param {string} path - Pfad zum Bild
     */
    loadImage(path) {
        this.img = new Image();
        trackImage(this.img);
        this.img.src = path;
    }


    /**
     * Lädt mehrere Bilder in den Bildspeicher (imageCache).
     * @param {string[]} arr - Liste der Bildpfade
     */
    loadImages(arr) {
        arr.forEach((path) => {
            let img = new Image();
            trackImage(img);
            img.src = path;
            this.imageCache[path] = img;
        });
    }


    /**
     * Zeichnet das Objekt, sofern das Bild vollständig geladen ist.
     * @param {CanvasRenderingContext2D} ctx - Zeichenfläche
     */
    draw(ctx) {
        if (this.img && this.img.complete && this.img.naturalWidth > 0) {
            ctx.drawImage(this.img, this.x, this.y, this.width, this.height);
        }
    }
}
