'use strict'

class BaseState extends Phaser.State {
  
    initFullScreenButtons() {
        //this.scale.scaleMode = Phaser.ScaleManager.RESIZE;

        // tecla de fullscreen (PC)
        let fullScreenKey = this.input.keyboard.addKey(Phaser.Keyboard.ONE);
        fullScreenKey.onDown.add(this.toggleFullScreen, this)    

        // botao de fullscreen (PC e Xbox)
        this.game.input.gamepad.onUpCallback = this.buttonFullScreen
        this.game.input.gamepad.callbackContext = this
/*
        let fullScreenButton = this.game.add.button(
            this.game.width-100, this.game.height-100, 'fullscreen-button', this.toggleFullScreen, this, 2, 1, 0);
        fullScreenButton.fixedToCamera = true
        fullScreenButton.anchor.setTo(1, 1)
        fullScreenButton.scale.setTo(0.4, 0.4)
    */
    } 

    createText(x, y, string, size=16) {
        let style = { font: `bold ${size}px Arial`, fill: 'white' }
        let text = this.game.add.text(x, y, string, style)
        //text.setShadow(3, 3, 'rgba(0,0,0,0.5)', 2)
        text.stroke = '#000000';
        text.strokeThickness = 2;
        text.anchor.setTo(0.5, 0.5)
        text.fixedToCamera = true
        return text
    }

    buttonFullScreen(context) {
        if (this.game.input.gamepad.pad1.connected && 
            this.game.input.gamepad.pad1.justPressed(Phaser.Gamepad.XBOX360_Y)) {
            this.toggleFullScreen()
        }        
    }

    toggleFullScreen() {
        this.scale.fullScreenScaleMode = Phaser.ScaleManager.EXACT_FIT;
        if (this.scale.isFullScreen) {
            this.scale.stopFullScreen();
        } else {
            this.scale.startFullScreen(false);
        }
    }
}

// wrapper para acesso pelo button html
function fullScreen() {
    GAME.state.states[GAME.state.current].toggleFullScreen()
}
