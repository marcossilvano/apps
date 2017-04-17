
// inimigo vai de um lado ao outro (tween)
class Droid extends Phaser.Sprite {
    constructor(game, x, y, asset) {
        super(game, x, y, asset)
        this.game.physics.arcade.enable(this)
        this.body.allowGravity = false
        this.body.setSize(25, 14, 3, 15); // ajusta caixa de colisao
        this.body.immovable = true // kinematic
        
        this.scale.setTo(1.3, 1.3)
        this.autoCull = true

        //this.anchor.setTo(0.5, 0.5)
        this.animations.add('move', [0, 1, 2, 3], 10, true)        
        this.animations.play('move')

        // valor padrao
        this.targetX = this.x
        this.targetY = this.y
    }

    start() {
        // correcao do problema de ancora do TILED
        this.targetY -= this.height

        let tweenA = this.game.add.tween(this)
            .to( { x: this.targetX, y: this.targetY }, 3000, "Quart.easeInOut")
            .to( { x: this.x, y: this.y }, 3000, "Quart.easeInOut")
            .loop(-1)
            .start();    
    }
}

// spawner de pongs (bate e volta)
class Spawner extends Phaser.Sprite {
    constructor(game, x, y, asset) {
        super(game, x, y, asset)
        this.scale.setTo(2, 2)
        this.autoCull = true
        //this.anchor.setTo(0.5, 0.5)

        this.animations.add('idle', [0, 1], 10, true).play()

        // TILED PARAMETER
        this.delay = 2500
        // this.tint = 0xff00ff
    }

    start(targetGroup) {
        this.group = targetGroup

        let tweenA = this.game.add.tween(this)
            .to( { tint: 0xff0000 }, 500)
            .to( { tint: 0xffffff }, 500)//, 'Linear', true, 250) // delay de 250ms antes
            .delay(this.delay)
            .loop(-1)
            .start()
        tweenA.onLoop.add(this.launch, this)     
        //tweenA.onStart.add(() => console.log('start'))     
    }

    // dah pra fazer generico: chama callback:
    //   cria e adiciona em algum grupo externo
    //   launch(centerX, centerY, spawner)
    launch(target, tween) {
        let offsetX = (this.width - 32)/2
        let pong = new PingPong(this.game, this.x+offsetX, this.y, 'droid');
        this.group.add(pong)            
    }
}

// inimigo bate e volta
class PingPong extends Phaser.Sprite {
    constructor(game, x, y, asset) {
        super(game, x, y, asset)
        this.game.physics.arcade.enable(this);
        this.body.setSize(25, 14, 3, 15); // ajusta caixa de colisao
        this.body.immovable = true // kinematic
        this.tint = 0xff00ff;
        this.autoCull = true

        //this.anchor.setTo(0.5, 0.5)
        this.animations.add('move', [0, 1, 2, 3], 10, true)        
        this.animations.play('move')

        this.started = false
        
        // TILED PARAMETER
        this.direction = -100
        this.lifeTime = 10 // segs
        
        this.game.time.events.add(Phaser.Timer.SECOND * this.lifeTime, this.destroyPong, this)
        this.events.onOutOfBounds.add(this.destroy, this);
    }

    update() {
        // quando tocar no chao, comeca a mover
        if (!this.started && this.body.onFloor()) {
            this.body.velocity.x = this.direction // vai para esquerda
            this.started = true
        }

        // verifica quando bate em alguma coisa e inverte movimento
        if (this.body.blocked.left) {
            this.body.velocity.x = 100 // vai para direita
        } 
        else
        if (this.body.blocked.right) {
            this.body.velocity.x = -100 // vai para esquerda
        }
    }

    destroyPong() {
        this.body.velocity.setTo(0,0)
        let tweenA = this.game.add.tween(this.scale)
            .to( { x: 0, y: 0 }, 500)
            .start()
        tweenA.onComplete.add(() => this.destroy)     
    }

/*
    update() {
        if (this.body.onWall()) {
            this.body.velocity.x *= -1
        }
    }
*/
}