class GameScene extends Phaser.Scene {
    constructor() {
        super("gameScene");
        this.my = {sprite: {}};  // Create an object to hold sprite bindings

        // PLAYER
        this.playerSpeed = 15;
        this.currentScore = 0;

        this.playerLives = 5;

        this.counter = 0;
        this.snakeSide = 1;

        // BAIT (BULLETS)
        this.baitCooldown = 4;
        this.baitCooldownCounter = 0;
        this.baitSpeed = 10;

        // BLUE FISH (ENEMY TYPE 1)
        this.blueCooldown = 20;
        this.blueCooldownCounter = 0;

        // PINK FISH (ENEMY TYPE 2)
        this.pinkCooldown = 40;
        this.pinkCooldownCounter = 0;

        // WAVES
        this.wave = false;
        this.waveCountdown = 0;
        this.waveCounter = 0;
    }

    // Use preload to load art and sound assets before the scene starts running.
    preload() {

        // PLATFORMER EXTENDED

        // Path
        this.load.setPath("./assets/")

        // Worm (Player)
        this.load.image("playerSprite", "snakeSlime.png");

        // Player Lives
        this.load.image("lifeSprite", "snake.png");

        // Bait (Bullets)
        this.load.image("bait", "worm.png");

        // ENEMIES
        
        // Blue Fish
        this.load.image("blueFish", "piranha.png");

        // Pink Fish
        this.load.image("pinkFish", "fishPink.png");


        // AUDIO

        // Fish eating bait
        this.load.audio("eat", "minimize_006.ogg");

        // Player getting hit
        this.load.audio("hit", "switch_003.ogg");

        // Game Over
        this.load.audio("end", "question_002.ogg");

        // SCRIBBLE PLATFORMER
        // this.load.setPath("./assets/kenney_scribble-platformer/PNG/")
    }

    init() {
        // PLAYER
        this.playerSpeed = 15;
        this.currentScore = 0;

        this.playerLives = 5;

        this.counter = 0;
        this.snakeSide = 1;

        // BAIT (BULLETS)
        this.baitCooldown = 4;
        this.baitCooldownCounter = 0;
        this.baitSpeed = 10;

        // BLUE FISH (ENEMY TYPE 1)
        this.blueCooldown = 20;
        this.blueCooldownCounter = 0;

        // WAVES
        this.wave = false;
        this.waveCountdown = 0;
        this.waveCounter = 0;
    }

    create() {
        let my = this.my;

/****************************************************************************************************/
        // KEYS
        
        // CONTROLS
	    this.leftKey = this.input.keyboard.addKey("A");
        this.rightKey = this.input.keyboard.addKey("D");
        this.shootKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);

/****************************************************************************************************/

        // SPRITES

        // WORM SPRITE
        // my.wormSprite = this.add.sprite(this.startX, this.startY, "snakeSlime.png");
        // my.wormSprite2 = this.add.sprite(this.startX, this.startY, "snakeSlime_ani.png");
        // my.wormSprite2.visible = false;

        my.sprite.playerWorm = new Player(this, game.config.width/2, game.config.height - 40, "playerSprite", null,
                                this.leftKey, this.rightKey, this.playerSpeed);

/****************************************************************************************************/

        // GROUPS

        // BULLET GROUP
        my.sprite.baitGroup = this.add.group({
            active: true,
            defaultKey: "bait",
            maxSize: 20,
            runChildUpdate: true
        });

        my.sprite.baitGroup.createMultiple({
            classType: Bullet,
            active: false,
            visible: false,
            key: my.sprite.baitGroup.defaultKey,
            repeat: my.sprite.baitGroup.maxSize-1,
            setRotation: {value: Math.PI/2},
            setScale: {x: 0.7, y: 0.7}
        });

        my.sprite.baitGroup.propertyValueSet("speed", this.baitSpeed)

        // LIVES GROUP
        my.sprite.livesGroup = this.add.group({
            active: false,
            defaultKey: "lifeSprite",
            maxSize: 5
        });

        my.sprite.livesGroup.createMultiple({
            active: true,
            visible: true,
            key: my.sprite.livesGroup.defaultKey,
            repeat: my.sprite.livesGroup.maxSize-1,
            setScale: {x: 1.2, y: 1},
            setXY: {x: 890, stepX: 40, y: 590},
            setRotation: {value: Math.PI/2}
        });

        // ENEMY GROUPS

        // BLUE FISH
        my.sprite.blueGroup = this.add.group({
            defaultKey:"blueFish",
            maxSize: 8,
            runChildUpdate: true
        });
        
        my.sprite.blueGroup.createMultiple({
            classType: Enemy,
            active: false,
            visible: false,
            key: my.sprite.blueGroup.defaultKey,
            repeat: my.sprite.blueGroup.maxSize-1,
            setRotation: {value: Math.PI}
        });

        my.sprite.blueGroup.propertyValueSet("enemyType", 1)
        my.sprite.blueGroup.propertyValueSet("enemySpeed", 12)
        my.sprite.blueGroup.propertyValueSet("enemyPoints", 10)
        my.sprite.blueGroup.propertyValueSet("x", 80)
        my.sprite.blueGroup.propertyValueSet("y", 80)

        // PINK FISH
        my.sprite.pinkGroup = this.add.group({
            defaultKey:"pinkFish",
            maxSize: 8,
            runChildUpdate: true
        });
        
        my.sprite.pinkGroup.createMultiple({
            classType: Enemy,
            active: false,
            visible: false,
            key: my.sprite.pinkGroup.defaultKey,
            repeat: my.sprite.pinkGroup.maxSize-1,
            setRotation: {value: Math.PI * 1.5}
        });

        my.sprite.pinkGroup.propertyValueSet("enemyType", 2)
        my.sprite.pinkGroup.propertyValueSet("enemySpeed", 12)
        my.sprite.pinkGroup.propertyValueSet("enemyPoints", 20)
        my.sprite.pinkGroup.propertyValueSet("x", 80)
        my.sprite.pinkGroup.propertyValueSet("y", 80)


/****************************************************************************************************/

        // TITLE AND DESCRIPTIONS

        document.getElementById('description').innerHTML = '<h2>CMPM 120 Game 2</h2><br>A: left // D: right // Space: shoot // S: Next Scene'

        this.scoreText = this.add.text(880, 70, 'Score:\n' + this.currentScore, {
            fontFamily: "'Poetsen One'",
            fontSize: 40
        });

        this.waveText = this.add.text(880, 10, '', {
            fontFamily: "'Poetsen One'",
            fontSize: 40
        });


        this.livesText = this.add.text(880, 490, 'Lives', {
            fontFamily: "'Poetsen One'",
            fontSize: 40
        });
    }

    update() {
        let my = this.my;

        // WAVE COUNTER
        this.waveCountdown++;

        if (this.waveCountdown == 90)
        {
            console.log("wave start");
            this.wave = true;
            this.waveCounter++;
            
            this.waveText.setText('Wave  ' + (this.waveCounter));
        }
        else if (this.waveCountdown == 330)
        {
            this.wave = false;
            this.waveCountdown = 0;
            console.log("wave reset");
        }


        // BLUE FISH (ENEMY TYPE 1)

        if (this.wave) {
            this.blueCooldownCounter -= this.waveCounter;

            if (this.blueCooldownCounter < 0) {

                let blueFish = my.sprite.blueGroup.getFirstDead();

                if (blueFish != null) {
                    blueFish.makeActive();
                    blueFish.x = my.sprite.playerWorm.x;
                    blueFish.y = 0;
                    this.blueCooldownCounter = this.blueCooldown;

                    blueFish.enemySpeed = 10 + this.waveCounter * 4;
                    console.log(blueFish.enemySpeed);
                }
            }
        }

        // PINK FISH (ENEMY TYPE 2)

        if (this.wave) {
            this.pinkCooldownCounter -= this.waveCounter;

            if (this.pinkCooldownCounter < 0) {

                let pinkFish = my.sprite.pinkGroup.getFirstDead();

                if (pinkFish != null) {
                    pinkFish.player = my.sprite.playerWorm;

                    pinkFish.makeActive();
                    pinkFish.x = Phaser.Math.Between(0, 800);
                    pinkFish.y = 0;

                    this.pinkCooldownCounter = this.pinkCooldown;

                    pinkFish.enemySpeed = 10 + this.waveCounter * 4;
                }
            }
        }

/****************************************************************************************************/

        // BAIT (BULLETS)
        
        this.baitCooldownCounter--;

        // SPACE Key -> Shoot
        if (this.shootKey.isDown) {
            
            if (this.baitCooldownCounter < 0) {

                let bait = my.sprite.baitGroup.getFirstDead();

                if (bait != null) {
                    bait.makeActive();
                    bait.x = my.sprite.playerWorm.x;
                    bait.y = my.sprite.playerWorm.y - (my.sprite.playerWorm.displayHeight/2);
                    this.baitCooldownCounter = this.baitCooldown;

                    bait.speed = this.baitSpeed + this.waveCounter * 3;
                }
            }
        }

        // BAIT-ENEMY COLLISION
        for (let bait of my.sprite.baitGroup.getChildren()) {
            if (bait.active == true)
            {
                for (let blue of my.sprite.blueGroup.getChildren())
                {
                    if (this.collides(blue, bait))
                    {
                        bait.y = -200;
                        blue.y = 700;
    
                        this.currentScore += blue.enemyPoints;
                        this.updateScore();
    
                        this.sound.play("eat", {
                            volume: 0.6   // Can adjust volume using this, goes from 0 to 1
                        });
                    }
                }
            }
            
        }

        for (let bait of my.sprite.baitGroup.getChildren()) {
            if (bait.active == true)
            {
                for (let pink of my.sprite.pinkGroup.getChildren()) {
                    if (this.collides(pink, bait))
                    {
                        bait.y = -200;
                        pink.y = 700;

                        this.currentScore += pink.enemyPoints;
                        this.updateScore();

                        this.sound.play("eat", {
                        volume: 0.6   // Can adjust volume using this, goes from 0 to 1
                        });
                    }
                }
            }
            
        }


/****************************************************************************************************/

        // MOVEMENT CONTROLS

        my.sprite.playerWorm.update();


        // PLAYER-ENEMY COLLISIONS
        for (let blue of my.sprite.blueGroup.getChildren())
        {
            if (blue.active == true)
            {            
                if (this.collides(my.sprite.playerWorm, blue))
                {
                    if (this.playerLives != 1)
                    {
                        this.playerLives--;
    
                        let life = my.sprite.livesGroup.getFirstAlive();
                        if (life != null)
                        {
                            life.active = false;
                            life.visible = false;
                        }
    
                        this.sound.play("hit", {
                            volume: 0.4
                        });
                    }
                    else
                    {
                        this.sound.play("hit", {
                            volume: 0.4
                        });
                        this.gameLose();
                    }
                    
                    blue.y = 700;
                }
            }

        }

        for (let pink of my.sprite.pinkGroup.getChildren())
        {
            if (pink.active == true)
            {
                if (this.collides(my.sprite.playerWorm, pink))
                {
                    if (this.playerLives != 1)
                    {
                        this.playerLives--;
    
                        let life = my.sprite.livesGroup.getFirstAlive();
                        if (life != null)
                        {
                            life.active = false;
                            life.visible = false;
                        }
        
                        this.sound.play("hit", {
                            volume: 0.4
                        });
                    }
                    else
                    {
                        this.sound.play("hit", {
                            volume: 0.4
                        });
                        this.gameLose();
                    }
                        
                    pink.y = 700;
                }
            }

        }
    }

/****************************************************************************************************/

        // EXTERNAL FUNCTIONS

        collides(a, b) {
            if (Math.abs(a.x - b.x) > (a.displayWidth/2 + b.displayWidth/2)) return false;
            if (Math.abs(a.y - b.y) > (a.displayHeight/2 + b.displayHeight/2)) return false;
            return true;
        }

        updateScore() {
            let my = this.my;
            this.scoreText.setText("Score:\n" + this.currentScore);
        }

        gameLose() {
            this.sound.play("end", {
                volume: 0.4
            });
            this.scene.start("gameOverScene", {endScore: this.currentScore});
        }
}



/****************************************************************************************************/

        // OLD MOVEMENT CONTROLS

//         let speed = 10;
//         let moving = false;

//         // A Key -> Left
//         if (this.aKey.isDown) {
// 		    my.wormSprite.x -= speed;
//             my.wormSprite2.x -= speed;
// 		    if (my.wormSprite.x <= 0) my.wormSprite.x = 0;
//             if (my.wormSprite2.x <= 0) my.wormSprite2.x = 0;

//             my.wormSprite.visible = false;
//             my.wormSprite2.visible = true;
//             moving = true;
// 	    }
    
//         // D Key -> Right
//         if (this.dKey.isDown) {
// 		    my.wormSprite.x += speed;
//             my.wormSprite2.x += speed;

//             my.wormSprite.visible = true;
//             my.wormSprite2.visible = false;
//             moving = true;
// 	    }


// /****************************************************************************************************/
//         // WORM WIGGLE
//         this.counter++;
//         if (this.counter % 6 == 0 && moving != true) {
//             switch (this.snakeSide)
//             {
//                 case 0:
//                     my.wormSprite.visible = true;
//                     my.wormSprite2.visible = false;
//                     this.snakeSide = 1;
//                     break;
//                 case 1:
//                     my.wormSprite.visible = false;
//                     my.wormSprite2.visible = true;
//                     this.snakeSide = 0;
//                     break;
//             }
//         }
//     }