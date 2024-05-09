"use strict"

// game config
let config = {
    parent: 'phaser-game',
    type: Phaser.CANVAS,
    render: {
        pixelArt: false  // prevent pixel art from getting blurred when scaled
    },
    width: 1080,
    height: 600,
    scene: [GameScene, GameOverScene],
    fps: { forceSetTimeOut: true, target: 30 }
}

const game = new Phaser.Game(config);