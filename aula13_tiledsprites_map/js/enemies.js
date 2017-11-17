
class Saw extends Phaser.Sprite {
    constructor(game, x, y, asset) {
        super(game, x, y, asset)   
        this.anchor.setTo(0.5, 0.5)
        this.inputEnabled = true
        this.input.enableDrag(false, true)        

        this.game.add.tween(this)
            .to ( { alpha: 0.5 }, 500 )
            .to ( { alpha: 1.2 }, 500 )
            .loop(-1)
            .start()

        this.game.add.tween(this)
            .to ( { angle: -359 }, 2000 )
            .loop(-1)
            .start()
        
    }

    update() {
        // logica do npc
    }
}


class Block extends Phaser.TileSprite {
    constructor(game, x, y, asset) {
        super(game, x, y, 32, 32, asset)
        this.game.physics.arcade.enable(this)
        this.body.syncBounds = true
        this.body.immovable = true
        this.tag = 'wall'
        this.autoCull = true
    }
}