
/* TAREFAS
- checkpoint
- plataforma vertical?
- chao quebradiço (que volta?)
- inimigo canhão: vertical, horizontal, diagonal, livre?
  - bala reta
  - bala com gravidade
*/
// classe com atributos estaticos
class Config {}
Config.WIDTH = 800
Config.HEIGHT= 480
Config.DEBUG = false
Config.ANTIALIAS = false
Config.ASSETS = 'assets/'



// Jogo
class Game extends Phaser.Game {
    constructor () {        
        // Game(width, height, renderer, parent, state, transparent, antialias, physicsConfig)
        super(Config.WIDTH, Config.HEIGHT, Phaser.CANVAS, 'game-container', null, false, Config.ANTIALIAS)

        // adiciona estados ao jogo
        this.state.add('Play', PlayState, false)
//      this.state.add('Splash', SplashState, false)
//      this.state.add('GameOver', GameOverState, false)
        this.state.start('Play')

        $('#button-fullscreen').click(fullScreen)
    }
}

// Fase 1
class PlayState extends Phaser.State {
    
    preload() {
        this.game.renderer.renderSession.roundPixels = true;
        let dir = Config.ASSETS
        
        // map
        this.game.load.tilemap('level1', `${dir}level2.json`, null, Phaser.Tilemap.TILED_JSON);
        this.game.load.image('tiles-1',`${dir}tileset-21x21.png`);
        //this.game.load.tilemap('level1', `${dir}level_test.json`, null, Phaser.Tilemap.TILED_JSON);
        //this.game.load.image('tiles-1',`${dir}tileset-21x21-1border-2space.png`);

        this.game.load.spritesheet('dude',`${dir}dude.png`, 32, 48);

        this.game.load.spritesheet('droid',`${dir}droid.png`, 32, 32);
        this.game.load.spritesheet('spawner',`${dir}spawner.png`, 32, 20);

        this.game.load.image('starSmall',`${dir}star.png`);
        this.game.load.image('starBig',`${dir}star2.png`);

        // backgrounds
        this.game.load.image('background-sky',`${dir}background4.png`);
        //this.game.load.image('background-rocks',`${dir}rocks1.jpg`);

        this.game.load.spritesheet('coin', `${dir}coin.png`, 32, 32);

		// virtual joystick
		this.game.load.image('arrow-left', `${dir}button_left.png`);
		this.game.load.image('arrow-right', `${dir}button_right.png`);
		this.game.load.image('arrow-up', `${dir}button_up.png`);
    }

    resetLevel() {
        this.player.position.setTo(50, 200)
    }

    createPlayer() {
        this.player = new Player(this.game, this.keys, 32, 32, 'dude');
        this.game.add.existing(this.player)    
        
        //this.game.camera.follow(player);
         this.game.camera.follow(this.player, Phaser.Camera.FOLLOW_LOCKON, 0.1, 0.1); // smooth
    }

    createMap() {
        this.map = this.game.add.tilemap('level1'); 
        // nome usado para: hash do arquivo de tileset e nome do tileset no Tiled Editor
        this.map.addTilesetImage('tiles-1');

        this.mapLayer = this.map.createLayer('Tile Layer 1');
        this.map.setCollisionBetween(1, 11, true, 'Tile Layer 1')
//        map.setCollisionByExclusion([4,8,10,2]);
    
        this.trapsLayer = this.map.createLayer('Traps Layer 1');
        this.map.setCollision([29], true, 'Traps Layer 1')
                
        this.mapLayer.resizeWorld(); // redefine tamanho do mapa para adequar ao mapa
    }

    createCoins() {
        this.coins = this.game.add.group();
        //  And now we convert all of the Tiled objects with an ID of 34 into sprites within the coins group
        this.map.createFromObjects('Object Layer 1', 45, 'coin', 0, true, false, this.coins, Coin);
    }

    createEnemies() {
        this.droids = this.game.add.group();
        //  And now we convert all of the Tiled objects with an ID of 34 into sprites within the coins group
        this.map.createFromObjects('Object Layer 1', 51, 'droid', 0, true, false, this.droids, Droid);
        this.droids.forEach((droid) => droid.start())        

        this.pongs = this.game.add.group(); // grupo para os futuros pongs
        this.spawners = this.game.add.group(); // grupo dos spawners
        //  And now we convert all of the Tiled objects with an ID of 34 into sprites within the coins group
        this.map.createFromObjects('Object Layer 1', 52, 'spawner', 0, true, false, this.spawners, Spawner);
        this.spawners.forEach((spw) => spw.start(this.pongs))        
    }

    createBackground() {
        this.bg = new Background(this.game, 0, 0, Config.width, Config.height, 'background-sky');
        this.game.add.existing(this.bg)
    }

    createVirtualJoystick(keys) {
        // modifica estado de keys diretamente
        let ypos = this.game.height - 80
		this.addVirtualButton(14, ypos, 'arrow-left', 
                              () => this.keys.left.isDown = true, 
                              () => this.keys.left.isDown = false)
		this.addVirtualButton(91, ypos, 'arrow-right',
                              () => this.keys.right.isDown = true, 
                              () => this.keys.right.isDown = false)
		this.addVirtualButton(this.game.width-80,ypos, 'arrow-up', 
                              () => this.keys.down.isDown = true, 
                              () => this.keys.down.isDown = false)
    }
    
    addVirtualButton(x, y, resource, pressHandler, releaseHandler) {
		let button = this.game.add.button(x, y, resource, null, this, 0,1,0,1);
		button.scale.setTo(1.5,1.5);
//		button.inputEnabled = true;
		button.fixedToCamera = true;

        button.events.onInputOver.add(pressHandler);
        button.events.onInputDown.add(pressHandler);
        button.events.onInputOut.add(releaseHandler);
        button.events.onInputUp.add(releaseHandler);

		return button;
    }

    create() {
        this.game.physics.startSystem(Phaser.Physics.ARCADE);
        this.game.stage.backgroundColor = '#000000';
        this.game.renderer.renderSession.roundPixels = true;

        // keys and input
        this.keys = this.game.input.keyboard.createCursorKeys();

        // game objects (ordem define z)
        this.createBackground()
        this.createMap()
        this.createCoins()
        this.createEnemies()
        this.createPlayer()
        this.createVirtualJoystick(this.keys)

        this.game.physics.arcade.gravity.y = 550;

        let fullScreenButton = this.game.input.keyboard.addKey(Phaser.Keyboard.ONE);
        fullScreenButton.onDown.add(this.toogleFullScreen, this)

        // hud
        this.textUI = this.game.add.text(16, 16, '', { fontSize: "12px", fill: '#ffffff' });
        this.textUI.text = "Platformer Demo\n[1] fullscreen\n[cima] pulo duplo fixo\n[baixo] pulo variavel";
        this.textUI.fixedToCamera = true;

        this.game.time.advancedTiming = true; // ativa game.time.fps
        
        if (Config.DEBUG) {
            this.mapLayer.debug = true;
        }

        //Global.playState = this
        this.resetLevel()
    }
    
    update() {        
        // paredes do mapa
        this.game.physics.arcade.collide(this.player, this.mapLayer);
        this.game.physics.arcade.collide(this.pongs, this.mapLayer, this.pongCollidesMap);

        // player leva danos se encosta na camada de armadilhas
        this.game.physics.arcade.collide(this.player, this.trapsLayer, this.playerDied, null, this);
        
        // overlap com objetos do mapa
        //                             sprite/group, sprite/group, callback, process, context
        this.game.physics.arcade.overlap(this.player, this.droids, this.playerDied, null, this);
        this.game.physics.arcade.overlap(this.player, this.pongs, this.playerDied, null, this);
        this.game.physics.arcade.overlap(this.player, this.coins, this.collectCoin);
    }

    collectCoin(player, coin) {
        if (coin.tag == 'coin') {
            //coin.kill() // desabilita
            coin.destroy()
        }
    }

    playerDied(player, other) {
        //player.kill()
        console.log('player died')
        //this.game.state.start('Play')
        //other.kill()
        this.game.camera.shake(0.02, 200)
        this.resetLevel()
    }

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
            this.game.debug.cameraInfo(this.game.camera, 32, 32);
            this.game.debug.body(this.player);
            this.coins.forEach((c) => this.game.debug.body(c))     
            this.droids.forEach((c) => this.game.debug.body(c))     
            this.pongs.forEach((c) => this.game.debug.body(c))     
        }
    }
}// class PlayState


//window.onload = function() {
    // funciona como singleton
    const GAME = new Game()
//}


function fullScreen() {
    GAME.scale.fullScreenScaleMode = Phaser.ScaleManager.EXACT_FIT;
    if (GAME.scale.isFullScreen) {
        GAME.scale.stopFullScreen();
    } else {
        GAME.scale.startFullScreen(false);
    }
}