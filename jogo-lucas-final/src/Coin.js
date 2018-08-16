class Coin extends Phaser.Sprite {
    constructor(game, x, y, img) {
        super(game, x, y, img)
        this.game.physics.arcade.enable(this);
        this.body.allowGravity = false
        
        this.animations.add('spin', [0, 1, 2, 3, 4, 5], 10, true)        
        this.animations.play('spin')
    }
}