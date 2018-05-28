'use strict'

class BootState extends Phaser.State {

    preload() {
        this.game.load.image('sky', 'assets/sky.png')
        this.game.load.image('plane1', 'assets/airplane1.png')
        this.game.load.image('shot', 'assets/shot.png')
        this.game.load.image('wall', 'assets/wall.png')
        this.game.load.image('fog', 'assets/fog.png')
        this.game.load.image('saw', 'assets/saw.png')
        this.game.load.image('smoke', 'assets/smoke.png')
        this.game.load.image('title', 'assets/title.png')
        this.game.load.image('fullscreen-button', 'assets/fullscreen-button.png')
        
        this.game.load.text('map1', 'assets/map1.txt');  // arquivo txt do mapa

        this.game.load.spritesheet('explosion', 'assets/explosion.png', 56, 56)

        // map
        this.game.load.tilemap('level1', 'assets/level1.json', null, Phaser.Tilemap.TILED_JSON);
        this.game.load.image('tiles1','assets/tileset-42x42.png');

        // virtual joystick
        this.load.image('vstick_base', 'assets/button_thumbstick_background.png');
        this.load.image('vstick_thumb', 'assets/button_thumbstick.png');
        this.load.image('vstick_button', 'assets/button_action.png');
    }

    create() {
        // codigo Cocoon
        this.game.scale.scaleMode = config.SCALE_MODE;
		this.game.scale.pageAlignHorizontally = true;
        this.game.scale.pageAlignVertically = true;
        this.game.renderer.renderSession.roundPixels = config.ROUND_PIXELS

        // inicia gamepad
        this.game.input.gamepad.start()
        console.log('gamepad.supported:      ' + this.game.input.gamepad.supported)
        console.log('gamepad.active:         ' + this.game.input.gamepad.active)
        console.log('gamepad.pad1.connected: ' + this.game.input.gamepad.pad1.connected)

        console.log("BootState created")

        // this.state.start('Title')
        this.state.start('Game')
    }
}