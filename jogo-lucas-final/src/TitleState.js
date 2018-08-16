'use strict'

class TitleState extends BaseState {

    create() {
        this.music = this.game.add.audio('music-title');
        this.music.play();    
        this.sfxStart = this.game.add.audio('start-game');

        let skyWidth = this.game.cache.getImage('sky').width
        let skyHeight = this.game.cache.getImage('sky').height
        this.sky = this.game.add.tileSprite(
            0, 0, skyWidth, skyHeight, 'sky')
        this.sky.scale.x = this.game.width / this.sky.width
        this.sky.scale.x += 0.5
        this.sky.scale.y = this.game.height / this.sky.height
        this.sky.tint = 0xBBBBBB

        this.title = this.game.add.sprite(this.game.width/2, 150, 'title')
        this.title.anchor.setTo(0.5, 0.5)
        this.title.scale.setTo(0.8, 0.8)
        this.title.smoothed = false

        this.pressStart = this.createText(this.game.width/2, this.game.height*2/3, 'Pressione um botão', 24)
        this.info = this.createText(this.game.width/2, this.game.height-50, 'Ultra Games / 2018', 18)

        let startButton = this.input.keyboard.addKey(Phaser.Keyboard.ENTER);
        startButton.onDown.add(this.startGame, this)    

        this.pad = this.game.input.gamepad.pad1
        this.pad.onDownCallback = this.startGame
        // this.pad.onDownCallback = this.showButton
        this.pad.callbackContext = this        

        this.game.camera.flash(0x000000)

        this.initFullScreenButtons()    
    }

    showButton() {
        if (this.pad.justPressed(Phaser.Gamepad.XBOX360_X))     console.log('X')
        if (this.pad.justPressed(Phaser.Gamepad.XBOX360_A))     console.log('A')
        if (this.pad.justPressed(Phaser.Gamepad.XBOX360_B))     console.log('B')
        if (this.pad.justPressed(Phaser.Gamepad.XBOX360_Y))     console.log('Y')
        if (this.pad.justPressed(Phaser.Gamepad.XBOX360_START))     console.log('START')
        if (this.pad.justPressed(Phaser.Gamepad.XBOX360_LEFT_BUMPER))     console.log('LB')
        if (this.pad.justPressed(Phaser.Gamepad.XBOX360_RIGHT_BUMPER))     console.log('RB')
        if (this.pad.justPressed(Phaser.Gamepad.XBOX360_LEFT_TRIGGER))     console.log('LT')
        if (this.pad.justPressed(Phaser.Gamepad.XBOX360_RIGHT_TRIGGER))     console.log('RT')
        if (this.pad.justPressed(Phaser.Gamepad.XBOX360_STICK_LEFT_BUTTON))     console.log('LS Button')
        if (this.pad.justPressed(Phaser.Gamepad.XBOX360_STICK_RIGHT_BUTTON))     console.log('RS Button')
    }

    startGame() {
        this.music.stop();
        this.sfxStart.play();
        this.camera.fade('#000000');
        this.camera.onFadeComplete.add(this.fadeComplete,this);
        
        // this.state.start('Game')
    }

    fadeComplete() {
        this.state.start('Select');
        console.log("SELECT")
    }

    update() {
        this.sky.tilePosition.x += 0.5
    }

    render() {
        //obstacles.forEach(function(obj) { game.debug.body(obj) })
        //game.debug.body(player1)
        //game.debug.body(player2)
    }
}