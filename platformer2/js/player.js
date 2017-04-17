
class Player extends Phaser.Sprite {
    constructor(game, cursors, x, y, asset) {
        super(game, x, y, asset)   
        this.keys = cursors

        this.game.physics.arcade.enable(this);
        this.body.collideWorldBounds = true;
        this.body.setSize(20, 32, 5, 16); // ajusta caixa de colisao
        this.anchor.setTo(0.5, 0.5)
        
        this.animations.add('walk', [2, 1, 2, 3], 10, true);    
        this.animations.add('jump', [3], 10, false);
        this.animations.add('doublejump', [1], 10, false);
        this.animations.add('idle', [2], 10, false);    

        let jumpButton = this.game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
        jumpButton.onDown.add(this.jump, this)

        jumpButton = this.game.input.keyboard.addKey(Phaser.Keyboard.UP);
        jumpButton.onDown.add(this.jump, this)

        this.doubleJump = false
        this.autoCull = true
   }

    update() {
        this.body.velocity.x = 0;

        if (this.keys.left.isDown)
            this.body.velocity.x = -150;
        else 
        if (this.keys.right.isDown)
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
        if (this.body.velocity.y != 0) {
            if (this.doubleJump)
                this.animations.play('doublejump')
            else
                this.animations.play('jump')
        }

        // define lado
        if (this.body.velocity.x > 0)
            this.scale.x = 1    
        else 
        if (this.body.velocity.x < 0)
            this.scale.x = -1
    }

    jump() {
        //if (this.body.onFloor()) {
        //if (this.body.touching.down) { // soh ocorre se deixar entrar no objeto
        if (this.body.blocked.down || !this.doubleJump) {
            this.body.velocity.y = -250;//-250;
            
            if (!this.body.blocked.down)
                this.doubleJump = true
            else
                this.doubleJump = false
        }    
    }    
}

