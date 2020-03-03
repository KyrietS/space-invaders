/**
 * Sebastian Fojcik
 */

/**
 * Pomocnicza klasa reprezentująca kolor.
 */
class Color {
    constructor(hex) {
        this.hex = hex;
        this.nor = {};
        this._parseHex();
    }

    /**
     * Konwertuje string-hex kolor na wartości RGB.
     * @private
     */
    _parseHex() {
        let result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(this.hex);
        if(!result) {
            console.error("Color parsing error: " + this.hex);
        }
        this.r = parseInt(result[1], 16);
        this.g = parseInt(result[2], 16);
        this.b = parseInt(result[3], 16);
        this.nor.r = this.r / 255;
        this.nor.g = this.g / 255;
        this.nor.b = this.b / 255;
    }
}

/**
 * Klasa pomocnicza do przechowywania punktu.
 */
class Point{
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
}

class PointRGB extends Point{
    constructor(x, y, color = new Color("#f542f2")) {
        super(x,y);
        this.r = color.r / 255;
        this.g = color.g / 255;
        this.b = color.b / 255;
    }
}

class PointST extends Point{
    constructor(x, y, s, t){
        super(x,y);
        this.s = s;
        this.t = t;
    }
}