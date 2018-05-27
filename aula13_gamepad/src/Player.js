
class Player extends Phaser.Sprite {
    constructor(game, x, y, img, tint, bullets, keys) {
        super(game, x, y, img)
        this.tint = tint
        this.health = config.PLAYER_HEALTH
        this.anchor.setTo(0.5, 0.5)
        game.physics.arcade.enable(this)
        this.body.drag.set(config.PLAYER_DRAG)
        this.body.maxVelocity.set(config.PLAYER_MAX_VELOCITY)
        this.body.mass = 0.1
        this.body.friction.setTo(0,0)
        //this.body.bounce.setTo(1,1)
        this.body.setSize(32, 32, 16, 16)
        this.body.isCircle = true
        this.nextFire = 0
        this.body.collideWorldBounds = true
        this.body.allowRotation = false

        // campos auxiliares para controles
        this.targetRotation = this.rotation
        this.move = {x: 0, y: 0}

        this.cursors = {
            left: game.input.keyboard.addKey(keys.left),
            right: game.input.keyboard.addKey(keys.right),
            up: game.input.keyboard.addKey(keys.up),
            down: game.input.keyboard.addKey(keys.down),        
            fire: game.input.keyboard.addKey(keys.fire)
        }
    
        this.bullets = bullets

        // particulas de fumaça
        this.emitter = game.add.emitter(0, 0, 40);
        this.emitter.makeParticles( [ 'smoke' ] );
        this.emitter.setXSpeed(0, 0)
        this.emitter.setYSpeed(0, 0)
        this.emitter.setAlpha(1, 0, 1000);
        this.emitter.setScale(0.7, 0, 0.7, 0, 1000);
        this.emitter.start(false, 1000, 50);
    }        

    angleByAtan() {
        if ((this.body.velocity.x != 0) || (this.body.velocity.y != 0)) {
            this.angle = 
                Math.atan2(this.body.velocity.y, this.body.velocity.x) * 180/Math.PI
        }
    }    

    moveToPointer() {
        //  mouse ou touch
        if (this.game.input.mousePointer.isDown || this.game.input.pointer1.isDown) {
            let x = this.game.input.mousePointer.x + this.game.input.pointer1.x
            let y = this.game.input.mousePointer.y + this.game.input.pointer1.y

            if (!Phaser.Rectangle.contains(this.body, this.game.input.x, this.game.input.y)) {
                //this.game.physics.arcade.moveToPointer(this, config.PLAYER_MAX_VELOCITY);
                this.targetRotation = this.game.physics.arcade.moveToPointer(this, 60, 
                    this.game.input.activePointer, config.PLAYER_MAX_VELOCITY);
            }

            return true
        }
        return false
    }   
    
    moveByKeys() {
        let pad1 = this.game.input.pad1
        this.move.x = 0
        this.move.y = 0

        if (this.cursors.left.isDown) {
            this.move.x = -1
        } else
        if (this.cursors.right.isDown) {
            this.move.x = 1
        }

        if (this.cursors.up.isDown) {
            this.move.y = -1
        } else
        if (this.cursors.down.isDown) {
            this.move.y = 1
        } 

        if (this.game.input.gamepad.pad1.connected) {
            this.move.x += this.game.input.gamepad.pad1.axis(Phaser.Gamepad.XBOX360_STICK_LEFT_X)
            this.move.y += this.game.input.gamepad.pad1.axis(Phaser.Gamepad.XBOX360_STICK_LEFT_Y)
        }

        // se pressionou, define nova rotação alvo e acelera
        if (this.move.x != 0 || this.move.y != 0) {
            this.targetRotation = Phaser.Math.angleBetween(0, 0, this.move.x, this.move.y)
            // console.log(Phaser.Math.radToDeg(this.targetRotation))

            this.game.physics.arcade.accelerationFromRotation(
                this.rotation, config.PLAYER_ACCELERATION, this.body.acceleration)
        } else {
            this.body.acceleration.set(0)            
        }
    }

    fireBullet() {
        if (!this.alive)
            return;
    
        if (this.cursors.fire.isDown || (
              this.game.input.gamepad.pad1.connected && 
              this.game.input.gamepad.pad1.justPressed(Phaser.Gamepad.XBOX360_A)
            ) || this.game.input.pointer2.isDown) {

            if (this.game.time.time > this.nextFire) {
                var bullet = this.bullets.getFirstExists(false)
                if (bullet) {
                    bullet.reset(this.x, this.y)
                    bullet.lifespan = config.BULLET_LIFE_SPAN
                    bullet.rotation = this.rotation
                    bullet.body.bounce.setTo(1,1)
                    bullet.body.friction.setTo(0,0)
                    this.game.physics.arcade.velocityFromRotation(
                        bullet.rotation + this.game.rnd.realInRange(-config.BULLET_ANGLE_ERROR, config.BULLET_ANGLE_ERROR), 
                        config.BULLET_VELOCITY, bullet.body.velocity
                    )
                    // fire rate
                    this.nextFire = this.game.time.time + config.BULLET_FIRE_RATE
                }
            }
        }    
    } 
    
    update() {
        // se moveu por touch, não move por teclas
        if (!this.moveToPointer()) {
            this.moveByKeys()
        }
        if (this.rotation != this.targetRotation) {
            this.rotation = Phaser.Math.rotateToAngle(this.rotation, this.targetRotation, 0.15)
        }

        this.fireBullet()
        //this.emitter.emitParticle()

        this.emitter.emitX = this.x;
        this.emitter.emitY = this.y;    
    }
}