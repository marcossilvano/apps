'use strict'

class SelectState extends BaseState {

    create() {
        this.music = this.game.add.audio('music-select');
        this.music.play();    
        this.sfxSelect = this.game.add.audio('select-player');

        let skyWidth = this.game.cache.getImage('sky').width
        let skyHeight = this.game.cache.getImage('sky').height
        this.sky = this.game.add.tileSprite(
            0, 0, skyWidth, skyHeight, 'sky')
        this.sky.scale.x = this.game.width / this.sky.width
        this.sky.scale.x += 0.5
        this.sky.scale.y = this.game.height / this.sky.height
        this.sky.tint = 0x555555

        this.selectText = this.createText(this.game.width/2, 50, 'SELECIONE O JOGADOR', 50, '#00DDDD', true)

        this.playerTypes = ['lucas', 'leonardo', 'eduardo', 'joao']
        this.selectorStart  = 137
        this.selectorOffset = 175
        this.selection = 0

        this.selector = this.game.add.sprite(this.selectorStart, 304, 'selector')
        this.selector.anchor.setTo(0.5, 0.5)
        this.game.add.tween(this.selector)
            .to( { tint: 0xff0000 }, 200)
            .to( { tint: 0xffffff }, 200)
            .loop(-1)
            .start(); 
    
        this.selectBack = this.game.add.sprite(this.game.width/2, this.game.height-50, 'select-place')
        this.selectBack.anchor.setTo(0.5, 1)
        // this.title.scale.setTo(0.8, 0.8)
        // this.title.smoothed = false

        this.pressStart = this.createText(this.game.width/2, 125, 'Pressione START para selecionar', 16)

        let startButton = this.input.keyboard.addKey(Phaser.Keyboard.ENTER);
        startButton.onDown.add(this.startGame, this)    

        let keySelectLeft = this.input.keyboard.addKey(Phaser.Keyboard.LEFT);
        keySelectLeft.onDown.add(this.selectLeft, this)    
        let keySelectRight = this.input.keyboard.addKey(Phaser.Keyboard.RIGHT);
        keySelectRight.onDown.add(this.selectRight, this)    

        this.pad = this.game.input.gamepad.pad1
        this.pad.onDownCallback = this.gamepadPressButton
        this.pad.onAxisCallback = this.axisSelection    
        this.pad.callbackContext = this    

        this.game.camera.flash(0x000000)

        this.initFullScreenButtons()    
    }

    gamepadPressButton() {
        if (this.pad.justPressed(Phaser.Gamepad.XBOX360_START)) {
            this.startGame()
        }      
        /*
        if (this.pad.justPressed(Phaser.Gamepad.XBOX360_X)) {
            this.fire()
        }    
        */    
    }

    startGame() {
        config.PLAYER_TYPE = this.playerTypes[this.selection]
        this.sfxSelect.play();
        this.music.stop();
        this.camera.fade('#000000');
        this.camera.onFadeComplete.add(this.fadeComplete,this);
        
        // this.state.start('Game')
    }

    fadeComplete() {
        this.state.start('Game'); 
    }

    selectLeft() {
        this.selection--;
        if (this.selection < 0) {
            this.selection = 0
        }
    }

    selectRight() {
        this.selection++;
        if (this.selection > 3) {
            this.selection = 3
        }
    }

    axisSelection() {
        if (this.pad.axis(Phaser.Gamepad.XBOX360_STICK_LEFT_X) <= -1) {
            this.selectLeft()
        } else
        if (this.pad.axis(Phaser.Gamepad.XBOX360_STICK_LEFT_X) >= 1) {
            this.selectRight()
        }
    }

    update() {
        this.sky.tilePosition.x += 0.5

        this.selector.x = this.selectorStart + this.selectorOffset*this.selection
    }

    render() {
        //obstacles.forEach(function(obj) { game.debug.body(obj) })
        //game.debug.body(player1)
        //game.debug.body(player2)
    }
}