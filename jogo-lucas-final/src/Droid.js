
// inimigo vai de um lado ao outro (tween)
class Droid extends Phaser.Sprite {
    constructor(game, x, y, asset) {
        super(game, x, y, asset)
        this.game.physics.arcade.enable(this)
        this.body.allowGravity = false
        this.body.immovable = true
        this.body.setSize(50, 28, 6, 30);        
        this.anchor.setTo(0.5, 0.5)
        this.animations.add('move', [0, 1, 2, 3], 10, true)        
        this.animations.play('move')
        this.smoothed = false
        this.x += this.width/2
        this.y += this.height/2
        // correcao do problema de ancora do TILED
        // // droid moves from one point to another in a loop
        // this.game.add.tween(this)
        //     .to( { x: this.x - 200 }, 3000, "Quart.easeInOut")
        //     .to( { x: this.x }, 3000, "Quart.easeInOut")
        //     .loop(-1)
        //     .start();    
    }

    initProperties() {
        // console.log(`Droid.initProperties target:${this.targetX}, ${this.targetY}`)

        if (this.targetX == undefined || this.targetX == 0) {
            this.targetX = this.x
        } else {
            this.targetX += this.width/2
        }

        if (this.targetY == undefined || this.targetY == 0) {
            this.targetY = this.y
        } else {
            this.targetY -= this.height/2
        }
        // correcao do problema de ancora do TILED
        //this.targetY -= this.height

        let tweenA = this.game.add.tween(this)
            .to( { x: this.targetX, y: this.targetY }, 3000, "Quart.easeInOut" )
            .to( { x: this.x, y: this.y }, 3000, "Quart.easeInOut" )
            .loop(-1)
            .start()    
    }
}