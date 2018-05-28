//import { Point } from "phaser-ce";

class VirtualJoystick extends Phaser.Sprite {
	constructor(game, x, y, thumbImg, baseImg, maxDistance) {
		super(game, x, y, baseImg);
        this.anchor.setTo(0.5, 0.5);
        this.alpha = 0.3
        this.fixedToCamera = true
        this.maxDistance = maxDistance

		// visual stick sprite
		this.thumb = game.add.sprite(0, 0, thumbImg);
        this.thumb.anchor.setTo(0.5, 0.5);
        this.thumb.scale.setTo(0.8, 0.8)
        this.thumb.alpha = 2
		this.addChild(this.thumb);
        
        // invisible sprite to player drag
        this.stick = game.add.sprite(x, y, null);
        this.stick.tint = '0xBBBBBB'
		this.stick.anchor.setTo(0.5, 0.5);
        this.stick.fixedToCamera = true
        this.stick.width = this.thumb.width*1.2
        this.stick.height= this.thumb.height*1.2
		this.stick.inputEnabled = true;
        this.stick.input.enableDrag();
        this.stick.events.onDragStart.add(this.onDragStart, this);
        this.stick.events.onDragStop.add(this.onDragStop, this);
        
        this.isBeingDragged = false;
        this.direction = new Phaser.Point(0, 0) // public property
    }
    
    addVirtualButton(x, y, buttonImg, pressCallback, releaseCallback) {
		let button = this.game.add.button(x, y, buttonImg, null, this, 0,1,0,1);
		button.fixedToCamera = true;
        button.anchor.setTo(0.5, 0.5)
        button.scale.setTo(0.8, 0.8)
        button.alpha = 0.6
        button.events.onInputOver.add(function() {button.alpha = 0.9; pressCallback()});
        button.events.onInputDown.add(function() {button.alpha = 0.9; pressCallback()});
        button.events.onInputOut.add (function() {button.alpha = 0.6; releaseCallback()});
        button.events.onInputUp.add  (function() {button.alpha = 0.6; releaseCallback()});

		return button;
    }

    onDragStart(){
        this.isBeingDragged = true;
        this.thumb.alpha = 3
    }

    onDragStop(){
        this.isBeingDragged = false;
        // reset stick position (hidden)
        this.stick.cameraOffset.setTo(this.x - this.game.camera.x, this.y - this.game.camera.y);
        this.thumb.alpha = 2
    }

    update(){
        if (this.isBeingDragged) {
            // convert from world to local position
            this.direction = this.stick.position.clone()
            this.direction.subtract(this.x, this.y) 
    
            this.thumb.position.copyFrom(this.direction)
            let distance  = this.direction.getMagnitude()
            // restrain pin movement to max distance
            if (distance > this.maxDistance) {
                this.thumb.position.setMagnitude(this.maxDistance)
            }
            this.direction.normalize() // normalize to use on game objects
            //console.log(this.direction)
        } else {
            // return thumb to origin (smoothly)
            this.thumb.x = Phaser.Math.linear(this.thumb.x, 0, 0.3)
            this.thumb.y = Phaser.Math.linear(this.thumb.y, 0, 0.3)
            this.direction.setTo(0, 0)
        }
    }
}