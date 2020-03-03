/**
 * Klasa reprezentująca i zarządzająca światem gry
 */
class World {
    /**
     * Konstruktor
     * @param webgl kontekst WebGL
     */
    constructor(webgl) {
        this.webgl = webgl;
        this.entities = [];
        this.playersShip = this._addPlayerShip(350, 650, 20);
        this.playerSpeed = 0.3;
        this.enemies = this._addEnemies(4, 10);
        this.enemyShootFrequency = 0.005;
        this.bullets = [];

        const bg = new Background(this.webgl, this.webgl.width, this.webgl.height);
        this.entities.push(bg);
    }

    /**
     * Aktualizuje świat gry
     */
    update(delta) {
        for(let entity of this.entities) {
            entity.update(delta);
        }
        for(let bullet of this.bullets) {
            bullet.update(delta);
        }
        this._updatePlayer(delta);
        this._enemyHit();
        this._playerHit();
        this._enemyShoot();
        this._removeOldBullets();
    }

    /**
     * Rysuj klatkę gry
     */
    draw() {
        for(let entity of this.entities) {
            entity.draw();
        }
        for(let enemy of this.enemies) {
            enemy.draw();
        }
        for(let bullet of this.bullets) {
            bullet.draw();
        }
        if(this.gameOver !== true)
            this.playersShip.draw();
        webgl.finish();
    }

    /**
     * Dodaj kwadrat do świata gry
     * @param {Number} x współrzędna X środka
     * @param {Number} y współrzędna Y środka
     * @param {Number} size długość boku
     * @param {Color} color kolor wypełnienia
     */
    addQuad(x, y, size, color) {
        x = x - size/2;
        y = y - size/2;
        const newEntity = new Rectangle(this.webgl, [
            new PointRGB(x, y, color),
            new PointRGB(x + size, y, color),
            new PointRGB(x + size, y + size, color),
            new PointRGB(x, y + size, color)
        ]);
        newEntity.depth = 0.9;
        this.entities.push(newEntity);
    }

    /**
     * Dodaje statek gracza do świata gry
     * @param x początkowa współrzędna X
     * @param y początkowa współrzędna Y
     * @param size rozmiar statku
     * @returns {Ship}
     * @private
     */
    _addPlayerShip(x, y, size) {
        x = x - size/2;
        y = y - size;
        const ship = new Ship(this.webgl, size);
        ship.move.x = x;
        ship.move.y = y;
        return ship;
    }

    _addEnemies(rows, numInRow) {
        const size = 30;
        const enemies = [];
        for( let i = 0; i < rows; i++) {
            const y = 50*i + 50;
            for(let k = 0; k < numInRow; k++) {
                const enemy = new Enemy(this.webgl, size);
                const delta = Math.floor(this.webgl.width / numInRow);
                const x = delta*k + delta/2;
                enemy.setPos(x, y);
                enemies.push(enemy);
            }
        }
        return enemies;
    }

    /**
     * Aktualizuje pozycję gracza na planszy w zależności
     * od wciśniętych klawiszy
     * @param delta
     * @private
     */
    _updatePlayer(delta) {
        if(LEFT && this.playersShip.move.x > 10) {
            this.playersShip.move.x -= this.playerSpeed * delta;
        }
        if(RIGHT && this.playersShip.move.x + this.playersShip.size < this.webgl.width - 10) {
            this.playersShip.move.x += this.playerSpeed * delta;
        }
        if(SPACE) {
            this._playerShoot();
            SPACE = false;
        }
    }

    _playerShoot() {
        const playerBullet = new PlayerBullet(this.webgl);
        playerBullet.move.x = this.playersShip.move.x + this.playersShip.size / 2;
        playerBullet.move.y = this.playersShip.move.y;
        this.bullets.push(playerBullet);
    }

    _enemyHit() {
        this.enemies = this.enemies.filter( enemy => {
            for (let bullet of this.bullets) {
                const x = bullet.move.x;
                const y = bullet.move.y;
                if (bullet instanceof PlayerBullet && enemy.isHit(x, y)) {
                    const index = this.bullets.indexOf(bullet);
                    this.bullets.splice(index, 1);
                    return false;
                }
            }
            return true;
        });
    }

    _playerHit() {
        for (let bullet of this.bullets) {
            const x = bullet.move.x;
            const y = bullet.move.y;
            if (bullet instanceof EnemyBullet && this.playersShip.isHit(x, y)) {
                this.gameOver = true;
                setTimeout( function() {
                    stop();
                }, 0);
            }
        }
    }

    _enemyShoot() {
        for(let enemy of this.enemies) {
            if(Math.random() < this.enemyShootFrequency) {
                const enemyBullet = new EnemyBullet(this.webgl);
                enemyBullet.move.x = enemy.move.x + enemy.size * Math.random();
                enemyBullet.move.y = enemy.move.y;
                this.bullets.push(enemyBullet);
            }
        }
    }

    _removeOldBullets() {
        this.bullets = this.bullets.filter(entity =>entity.move.y > 0 && entity.move.y < this.webgl.height);
    }
}

