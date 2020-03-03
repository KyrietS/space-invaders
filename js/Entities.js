/**
 * Sebastian Fojcik
 */

/**
 * Abstrakcyjna klasa reprezentująca wyświetlany element na ekranie
 */
class Entity {
    /**
     * @param webgl referencja do kontekstu WebGL
     */
    constructor(webgl) {
        this.webgl = webgl;
        this.buffer = null;
        this.depth = 0;
        this.move = new Point(0,0);
    }

    /**
     * Wypełnia bufor wierzchołkami do narysowania
     * @param points
     */
    setPoints(points) {
        this.buffer.setBufferData(points);
    }

    /**
     * Wypełnia bufor indeksami wierzchołków do narysowania
     * @param indices
     */
    setIndices(indices) {
        this.buffer.setIndexData(indices);
    }

    /**
     * Rysuje obiekt
     */
    draw() {
        this.buffer.depth = this.depth;
        this.buffer.move = this.move;
        this.buffer.draw();
    }

    update(delta) {}
}

/**
 * Klasa reprezentująca kwadrat o jednolitym wypełnieniu
 */
class Rectangle extends Entity {
    /**
     * @param webgl kontekst WebGL
     * @param points tablica czterech wierzchołków kwadratu (clockwise)
     */
    constructor(webgl, points = []) {
        super(webgl);
        super.buffer = webgl.createBufferRGB(gl.TRIANGLES);
        super.setPoints(points);
        super.setIndices([
            0, 1, 2,
            2, 3, 0
        ]);
    }

    draw() {
        super.draw();
    }
}

class Background extends Entity {
    constructor(webgl, width, height) {
        super(webgl, gl.TRIANGLES);
        const img = document.getElementById("background");
        this.buffer = webgl.createBufferST(gl.TRIANGLES, img);
        this.buffer.setBufferData([
            new PointST(0,0, 1, 0),
            new PointST(width, 0, 0, 0),
            new PointST(width, height, 0, 1),
            new PointST(0, height, 1, 1)
        ]);
        this.buffer.setIndexData([
            3, 0, 1,
            1, 2, 3
        ]);
        this.buffer.depth = 0.5;
    }

    draw(){
        this.buffer.draw();
    }
}

/**
 * Statek gracza
 */
class Ship extends Entity{
    constructor(webgl, size) {
        super(webgl, gl.TRIANGLES);
        const img = document.getElementById("rocket");
        this.buffer = webgl.createBufferST(gl.TRIANGLES, img);
        this.buffer.setBufferData([
            new PointST(0, 0, 1, 0),
            new PointST(size, 0, 0, 0),
            new PointST(size, size*2, 0, 1),
            new PointST(0, size*2, 1, 1)
        ]);
        this.buffer.setIndexData([
            3, 0, 1,
            1, 2, 3
        ]);
        this.buffer.move = new Point(300, -300);
        this.move = this.buffer.move;
        this.size = size;
    }

    isHit(x, y) {
        const myX = this.move.x;
        const myY = this.move.y;
        const mySize = this.size;
        if(myX <= x && myX + mySize >= x && myY <= y && myY + mySize*2 >= y) {
            return true;
        } else {
            return false;
        }
    }

    draw() {
        this.buffer.draw();
    }
}

let enemyInstance = null;
class Enemy extends Entity{
    // static buffer = null; // Firefox nie wspiera

    constructor(webgl, size) {
        super(webgl);
        const img = document.getElementById("ufo");
        if(enemyInstance == null) {
            enemyInstance = webgl.createBufferST(gl.TRIANGLES, img);
            enemyInstance.setBufferData([
                new PointST(0, 0, 1, 0),
                new PointST(size*1.5, 0, 0, 0),
                new PointST(size*1.5, size, 0, 1),
                new PointST(0, size, 1, 1)
            ]);
            enemyInstance.setIndexData([
                3, 0, 1,
                1, 2, 3
            ]);
        }

        this.move = new Point(0, 0);
        this.size = size;
    }

    setPos(x, y) {
        this.move = new Point(x - this.size/2,y - this.size/2);
    }

    isHit(x, y) {
        const myX = this.move.x;
        const myY = this.move.y;
        const mySize = this.size;
        if(myX <= x && myX + mySize*1.5 >= x && myY <= y && myY + mySize >= y) {
            return true;
        } else {
            return false;
        }
    }

    draw() {
        enemyInstance.move = this.move;
        enemyInstance.draw();
    }
}

class Bullet extends Entity{
    constructor(webgl) {
        super(webgl);
    }

    update(delta) {}

    draw() {
        super.draw();
    }
}

let playerBulletInstance = null;
class PlayerBullet extends Bullet {
    // static instance = null; // Firefox nie wspiera
    constructor(webgl, color = new Color("#FFFFFF"), size = 5) {
        super(webgl);
        if(playerBulletInstance == null) {
            playerBulletInstance = new Rectangle(webgl, [
                new PointRGB(0, 0, color),
                new PointRGB(size, 0, color),
                new PointRGB(size, size*2, color),
                new PointRGB(0, size*2, color)
            ]);
        }
    }

    update(delta) {
        this.move.y -= 0.5 * delta;
    }

    draw() {
        playerBulletInstance.move = this.move;
        playerBulletInstance.draw();
    }
}

let enemyBulletInstance = null;
class EnemyBullet extends Bullet {
    // static instance = null; // Firefox nie wspiera
    constructor(webgl, color = new Color("#FFFF00"), size = 5) {
        super(webgl);
        if(enemyBulletInstance == null) {
            enemyBulletInstance = new Rectangle(webgl, [
                new PointRGB(0, 0, color),
                new PointRGB(size, 0, color),
                new PointRGB(size, size*2, color),
                new PointRGB(0, size*2, color)
            ]);
        }
    }

    update(delta) {
        this.move.y += 0.5 * delta;
    }

    draw() {
        enemyBulletInstance.move = this.move;
        enemyBulletInstance.draw();
    }
}

