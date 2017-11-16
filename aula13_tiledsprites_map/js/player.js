
class Player extends Phaser.Sprite {
    constructor(game, x, y, asset, tint) {
        super(game, x, y, asset)   
        this.anchor.setTo(0.5, 0.5)
        this.tint = tint
        this.inputEnabled = true
        this.input.enableDrag(false, true)     
        this.game.physics.arcade.enable(this)
        }

    update() {
        // logica do player
    }
}
