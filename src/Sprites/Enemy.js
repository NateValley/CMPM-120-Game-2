class Enemy extends Phaser.GameObjects.Sprite {
    constructor(scene, x, y, texture, frame, enemySpeed, enemyBullet, enemyType) {
        super(scene, x, y, texture, frame);

        this.enemySpeed = enemySpeed;
        this.enemyBullet = enemyBullet;
        this.enemyType = enemyType;

        this.visible = false;
        this.active = false;

        return this;
    }

    update() {
        if (this.active) {
            switch (this.enemyType) {
                case 1:
                    this.y += this.enemySpeed;
                    break;
                case 2:
                    if (this.y > 300 || this.y > this.player.y) {
                        this.y += this.enemySpeed * 1.5;
                    }
                    else
                    {
                        this.goToPlayer(this.player);
                    }
                    break;
            }

            if (this.y > 640) {
                this.makeInactive();
            }
        }
    }

    makeActive() {
        this.visible = true;
        this.active = true;
    }

    makeInactive() {
        this.visible = false;
        this.active = false;
    }

    goToPlayer(player) {
        const dx = player.x - this.x;
        const dy = player.y - this.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        console.log(dist);
        console.log(this.x + " " + this.y);

        const vectorX = dx / dist;
        const vectorY = dy / dist;
        console.log(vectorX + " " + vectorY)
        console.log(this.x + " " + this.y)

        this.x += vectorX * this.enemySpeed;
        this.y += vectorY * this.enemySpeed;

        console.log(this.x + " " + this.y)
    }
}