
class Player extends Phaser.Sprite {
    constructor(game, x, y, img) {
        // 1. setup general properties
        super(game, x, y, img)
        this.sfxJump = this.game.add.audio('jump');
        this.sfxDoubleJump = this.game.add.audio('double-jump');

        this.health = config.PLAYER_LIVES
        this.anchor.setTo(0.5, 0.5)
        
        // 2. setup animations        
        this.animations.add('idle', [0], 5, true);
        this.animations.add('run', [1,0,2,0], 7, true);
        this.animations.add('jump', [3], 5, true);
        
        this.animations.add('fall', [3], 5, true);
        this.animations.add('attack', [3], 20, true);
        
        // 3. setup character physics
        game.physics.arcade.enable(this)
        this.body.collideWorldBounds = true
        //this.body.setSize(this.width-44, this.height-17, 23, 6)
        this.body.setSize(50, 120, 24, 15)

        // 4. create and setup fields for player logic        
        this.jumpType = 0
        // 0-on ground, 1-normal, 2-double, 3-attack
        this.startX = this.x
        this.startY = this.y

        // arma para os que atiram
        this.weapon = this.game.add.weapon(30, 'shot')
        this.weapon.bulletGravity.y = -config.GRAVITY
        this.weapon.bulletKillType = Phaser.Weapon.KILL_CAMERA_BOUNDS
        this.weapon.bulletSpeed = 600;
        
        //this.weapon.enableBody = true
        this.weapon.fireRate = 100;
        this.weapon.trackSprite(this, 0, -25, true);        
        
        // 5. setup keyboard keys
        this.keys = this.game.input.keyboard.addKeys({
            left: Phaser.KeyCode.LEFT,
            right: Phaser.KeyCode.RIGHT,
            jump: Phaser.KeyCode.CONTROL,
            fire: Phaser.KeyCode.Z
        })
        // one time press event for jump
        this.keys.jump.onDown.add(function () {
            this.jump()
        }, this);
        /*
        this.keys.fire.onDown.add(function () {
            this.fire()
        }, this);
        */
        // 6. setup xbox 360 controller buttons
        this.pad = this.game.input.gamepad.pad1
        this.pad.onDownCallback = this.gamepadPressButton
        this.pad.callbackContext = this        
    }

    movePlayer() {
        // check keys and define player velocity
        if (this.keys.left.isDown || this.pad.axis(Phaser.Gamepad.XBOX360_STICK_LEFT_X) < -0.1) {
            this.body.velocity.x = -config.PLAYER_VELOCITY
        } else
        if (this.keys.right.isDown || this.pad.axis(Phaser.Gamepad.XBOX360_STICK_LEFT_X) > 0.1) {
            this.body.velocity.x = config.PLAYER_VELOCITY
        } else {
            this.body.velocity.x = 0
        }
        // limit the jump and fall velocity
        this.body.velocity.y = Phaser.Math.clamp(this.body.velocity.y, 
            -config.PLAYER_DOUBLE_JUMP_VELOCITY, config.PLAYER_FALL_VELOCITY)

        if (this.body.onFloor()) {
            this.jumpType = 0 // no jump, on ground
        }

        // turn and animate the player sprite
        this.animate()
    }

    gamepadPressButton() {
        if (this.pad.justPressed(Phaser.Gamepad.XBOX360_X)) {
            this.jump()            
        }        
        /*
        if (this.pad.justPressed(Phaser.Gamepad.XBOX360_X)) {
            this.fire()
        }    
        */    
    }

    fire() {
        this.weapon.fire()
    }

    attackJump() {
        this.jumpType = 3
        this.jump(true)
    }

    jump(isAttack = false) {
        // check if there is any solid tile below the sprite
        let onFloor = this.body.onFloor()

        if (onFloor || isAttack || (this.jumpType != 2)) {
            // not on floor: can be a double jump or an attack jump
            if (!onFloor) {
                this.body.velocity.y = -config.PLAYER_DOUBLE_JUMP_VELOCITY
                // if is not a attack jump, then is a double jump
                if (!isAttack) {
                    this.jumpType = 2 // double jump
                    this.sfxDoubleJump.play()
                } else {
                    this.jumpType = 3 // attack jump
                }
            }
            // normal jump
            else {
                this.body.velocity.y = -config.PLAYER_JUMP_VELOCITY
                this.jumpType = 1
                this.sfxJump.play()
            }
        }
    }

    animate() {
        // if has no movement and it's on floor: idle
        let anim = 'idle'

        if (this.jumpType != 2) {
            this.angle = 0
        }
        else { // double jump
            this.angle += this.scale.x * 20
        }

        // on floor and moving
        if (this.jumpType == 2) {
            anim = 'attack'
        } else if (this.body.velocity.x != 0 && this.body.onFloor())
            anim = 'run'
        // on air and moving up: jumping
        else if (this.body.velocity.y <= 0 && !this.body.onFloor())
            anim = 'jump'
        // on air and falling
        else if (this.body.velocity.y > 0 && !this.body.onFloor())
            anim = 'fall'
        // play animation on the sprite
        this.animations.play(anim)

        // use negative scale to flip the sprite
        if (this.body.velocity.x > 0)
            this.scale.x = 1    
        else 
        if (this.body.velocity.x < 0)
            this.scale.x = -1
    }    

    update() {
        if (!this.body.enable) { // do nothing if body is disabled
            this.frame = 0
            return
        }

        this.movePlayer()
    }

    hitAttack(enemy) {
        // if (this.body.velocity.y != 0 && this.jumpType == 2) {
        if (this.body.velocity.y > 0 && this.body.y < enemy.y) {
            this.attackJump()
            // this.jumpType = 1
            // this.jump();
            return true;            
        } 
    }
}
