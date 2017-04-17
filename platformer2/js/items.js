
class Coin extends Phaser.Sprite {
    constructor(game, x, y, asset) {
        super(game, x, y, asset)
        this.game.physics.arcade.enable(this);
        this.body.allowGravity = false
        this.autoCull = true
        this.checkWorld
        this.tag = 'coin'
        
        this.animations.add('spin', [0, 1, 2, 3, 4, 5], 10, true)        
        this.animations.play('spin')
    }
}

class Background extends Phaser.TileSprite {
    // TileSprite(game, x, y, width, height, key, frame)
    constructor(game, x, y, width, height, key) {
        super(game, x, y, width, height, key)
        this.fixedToCamera = true;
        this.height = this.game.height;
        this.width = this.game.width;
        
    }

    update() {
        this.tilePosition.x = -this.game.camera.x/3
        this.tilePosition.y = -this.game.camera.y/2        
        // impede que o topo da imagem apareca no fundo da caverna
        if (this.tilePosition.y < -320)
            this.tilePosition.y = -320
    }
}