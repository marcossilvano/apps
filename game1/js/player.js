
class Player extends Phaser.Sprite {
    constructor(x, y, asset) {
        super(GAME, x, y, asset)
        
        this.game.physics.enable(this, Phaser.Physics.ARCADE);
        //this.game.physics.arcade.enable(this);
        this.body.collideWorldBounds = true;
        this.body.setSize(20, 32, 5, 16);
        this.anchor.setTo(0.5, 0.5)
        //this.scale.setTo(2,2)
        //this.body.bounce.y = 0;
        this.animations.add('walk', [2, 1, 2, 3], 10, true);    
        this.animations.add('jump', [3], 10, false);
        this.animations.add('idle', [2], 10, false);    

        let jumpButton = this.game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
        jumpButton.onDown.add(this.jump, this)

        jumpButton = this.game.input.keyboard.addKey(Phaser.Keyboard.UP);
        jumpButton.onDown.add(this.jump, this)
   }

    update() {
        this.game.physics.arcade.collide(this, Global.mapLayer);
        this.body.velocity.x = 0;

        if (Global.cursors.left.isDown)
            this.body.velocity.x = -150;
        else 
        if (Global.cursors.right.isDown)
            this.body.velocity.x = 150;

        this.animate()
    }

    animate() {
        // anima movendo/parado
        if (this.body.velocity.x != 0)
            this.animations.play('walk')
        else
            this.animations.play('idle')
            
        // no ar
        if (this.body.velocity.y != 0)
            this.animations.play('jump')

        // define lado
        if (this.body.velocity.x > 0)
            this.scale.x = 1    
        else 
        if (this.body.velocity.x < 0)
            this.scale.x = -1
    }

    jump() {
        if (this.body.onFloor()) {
            this.body.velocity.y = -350;//-250;
        }    
    }    
}

