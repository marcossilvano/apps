
class BootState extends Phaser.State {
    preload() {
        this.game.load.image('background-sky', 'assets/bg01.png')
        this.game.load.image('background-mountain', 'assets/bg02.png')
        this.game.load.image('life-icon', 'assets/life-icon.png')
        this.game.load.image('title', 'assets/title.png')
        this.game.load.image('sky', 'assets/sky.png')
        this.game.load.image('smoke', 'assets/smoke.png')
        this.game.load.image('shot', 'assets/shot.png')
        this.game.load.image('select-place', 'assets/select-place.png')
        this.game.load.image('selector', 'assets/selector.png')
        
        // load characters and effects sprite sheets
        //this.game.load.spritesheet('player', 'assets/player.png', 49, 72)
        this.game.load.spritesheet('lucas', 'assets/lucas.png', 100, 145)
        this.game.load.spritesheet('eduardo', 'assets/eduardo.png', 100, 145)
        this.game.load.spritesheet('leonardo', 'assets/leonardo.png', 120, 145)
        this.game.load.spritesheet('joao', 'assets/joao.png', 120, 145)

        this.game.load.spritesheet('droid', 'assets/droid.png', 64, 64)
        this.game.load.spritesheet('coin', 'assets/coin.png', 32, 32)
        this.game.load.spritesheet('attack', 'assets/attack.png', 56, 56)

        // load tile map data and image
        this.game.load.tilemap('level1', 'assets/level1.json', null, Phaser.Tilemap.TILED_JSON);
        this.game.load.image('tiles1','assets/super-mario-tiles_42x42.png');

        // audio
        this.game.load.audio('music-title', ['assets/audio/2-01-title-theme.ogg']);
        this.game.load.audio('music-select', ['assets/audio/2-02-character-select.ogg']);
        this.game.load.audio('music-level', ['assets/audio/2-03-overworld.ogg']);
        this.game.load.audio('music-win', ['assets/audio/2-09-fanfare.ogg']);
        this.game.load.audio('music-lose', ['assets/audio/2-13-game-over.ogg']);

        this.game.load.audio('start-game', ['assets/audio/smb2_1up.wav']);
        this.game.load.audio('select-player', ['assets/audio/smb2_shrink.wav']);

        this.game.load.audio('double-jump', ['assets/audio/smb2_boss_spit.wav']);
        this.game.load.audio('jump', ['assets/audio/smb2_jump.wav']);
        this.game.load.audio('coin', ['assets/audio/smb2_coin.wav']);
        this.game.load.audio('attack', ['assets/audio/smb2_pickup.wav']);
        this.game.load.audio('select-player', ['assets/audio/smb2_shrink.wav']);
        this.game.load.audio('hit-player', ['assets/audio/smb2_hawkmouth.wav']);
    }
    
    create() {
        this.game.scale.scaleMode = config.SCALE_MODE;
        this.game.renderer.renderSession.roundPixels = config.ROUND_PIXELS
        this.game.stage.smoothed = false // "retro" style (still antialiased)
        this.game.input.gamepad.start()  // init the game pad support (Xbox 360)
        // this.state.start('Select')         // start the game scene (Phaser.State)
        this.state.start('Title')         // start the game scene (Phaser.State)
        // this.state.start('Game')         // start the game scene (Phaser.State)
    }
}