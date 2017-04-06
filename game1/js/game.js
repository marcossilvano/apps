
// classe com atributos estaticos
class Config {}
Config.WIDTH = 800
Config.HEIGHT= 480
Config.DEBUG = false
Config.ANTIALIAS = true
Config.ASSETS = 'assets/'

// globais (solucao ruim?)
class Global {}
Global.cursors;
Global.mapLayer;
Global.playState;

// Jogo
class Game extends Phaser.Game {
    constructor () {        
        // Game(width, height, renderer, parent, state, transparent, antialias, physicsConfig)
        super(Config.WIDTH, Config.HEIGHT, Phaser.CANVAS, 'game-container', null, false, Config.ANTIALIAS)

        // adiciona estados ao jogo
        this.state.add('Play', PlayState, false)
//      this.state.add('Splash', SplashState, false)
//      this.state.add('Game', GameOverState, false)
        this.state.start('Play')
    }
}

// Fase 1
class PlayState extends Phaser.State {
    
    preload() {
        //this.game.load.tilemap('level1', Config.ASSETS + '/level1.json', null, Phaser.Tilemap.TILED_JSON);
        this.game.load.tilemap('level1', Config.ASSETS + '/level2.json', null, Phaser.Tilemap.TILED_JSON);
        //this.game.load.image('tiles-1', Config.ASSETS + '/tiles-1.png');
        this.game.load.image('tiles-1', Config.ASSETS + '/tileset-21x21.png');
        this.game.load.spritesheet('dude', Config.ASSETS + '/dude.png', 32, 48);
        this.game.load.spritesheet('droid', Config.ASSETS + '/droid.png', 32, 32);
        this.game.load.image('starSmall', Config.ASSETS + '/star.png');
        this.game.load.image('starBig', Config.ASSETS + '/star2.png');
        this.game.load.image('background', Config.ASSETS + '/background3.png');
    }

    create() {
        this.game.physics.startSystem(Phaser.Physics.ARCADE);
        this.game.stage.backgroundColor = '#000000';

        let bg = this.game.add.tileSprite(0, 0, Config.width, Config.height, 'background');
        bg.fixedToCamera = true;
        bg.height = this.game.height;
        bg.width = this.game.width;

        let map = this.game.add.tilemap('level1');
        map.addTilesetImage('tiles-1');

        let passableTiles = []
        for (let i = 12; i <= 44; i++)
            passableTiles.push(i)
        map.setCollisionByExclusion(passableTiles);        

        Global.mapLayer = map.createLayer('Tile Layer 1');
        Global.mapLayer.resizeWorld(); // redefine tamanho do mapa para adequar ao mapa

        this.game.physics.arcade.gravity.y = 550;

        let player = new Player(32, 32, 'dude');
        player.y = 200
        this.game.add.existing(player)    
        this.game.camera.follow(player);

        Global.cursors = this.game.input.keyboard.createCursorKeys();

        let fullScreenButton = this.game.input.keyboard.addKey(Phaser.Keyboard.ONE);
        fullScreenButton.onDown.add(this.toogleFullScreen, this)

        // hud
        let text = this.game.add.text(16, 16, '', { fontSize: "12px", fill: '#ffffff' });
        text.text = "Platformer Demo";
        text.fixedToCamera = true;

        this.game.time.advancedTiming = true; // ativa game.time.fps
        
        if (Config.DEBUG) {
            layer.debug = true;
        }

        Global.playState = this
    }
    
    //update() {}

    toogleFullScreen() {
        this.game.scale.fullScreenScaleMode = Phaser.ScaleManager.EXACT_FIT;
        if (this.game.scale.isFullScreen) {
            this.game.scale.stopFullScreen();
        } else {
            this.game.scale.startFullScreen(false);
        }
    }

    render () {
        if (Config.DEBUG) {
            //game.debug.text('frame time: ' + game.time.physicsElapsed, 16, 140);
            this.game.debug.text('fps: ' + this.game.time.fps, 16, 160);
            this.game.debug.body(player);
            this.game.debug.bodyInfo(player, 16, 24);
        }
    }
}// class PlayState

// funciona como singleton
const GAME = new Game()

