class GameOverScene extends Phaser.Scene {
    constructor(endScore) {
        super("gameOverScene", endScore);
        this.my = {sprite: {}};

        return this;
    }

    init(data) {
        this.score = data.endScore
    }

    create() {
        this.scoreText = this.add.text(this.cameras.main.centerX, this.cameras.main.centerY + 10, 'Score: ' + this.score, {
            fontFamily: "'Poetsen One'",
            fontSize: 50,
            align: 'center'
        });

        this.scoreText.setOrigin(0.5);

        this.overText = this.add.text(this.cameras.main.centerX, this.cameras.main.centerY - 80, 'The fish ate you! D:', {
            fontFamily: "'Poetsen One'",
            fontSize: 40,
            align: 'center',
            color: 'red'
        });

        this.overText.setOrigin(0.5);

        this.resetText = this.add.text(this.cameras.main.centerX, this.cameras.main.centerY + 100, 'Press R to restart', {
            fontFamily: "'Poetsen One'",
            fontSize: 30,
            align: 'center',
            color: 'green'
        });

        this.resetText.setOrigin(0.5);

        /********************************************************************************/

        // RESET KEY

        this.resetKey = this.input.keyboard.addKey("R");
    }

    update() {
        
        if (this.resetKey.isDown) {
            this.scene.start("gameScene");
        }
    
    }
}