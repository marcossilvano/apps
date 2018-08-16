
class GameState extends BaseState {

    create() {
        this.music = this.game.add.audio('music-level');
        this.musicLose = this.game.add.audio('music-lose');
        this.musicWin = this.game.add.audio('music-win');

        this.music.play();    
        this.sfxCoin = this.game.add.audio('coin');
        this.sfxHitPlayer = this.game.add.audio('hit-player');
        this.sfxAttack = this.game.add.audio('attack');

        // enable physics
        this.game.physics.startSystem(Phaser.Physics.ARCADE)
        this.game.physics.arcade.gravity.y = config.GRAVITY;
        
        this.createBackgrounds()
        this.createTileMap()
        this.createCoins()
        this.createDroids()
        this.createExplosionsPool()
        
        this.player = new Player(this.game, 4*42, 11*42, config.PLAYER_TYPE)
        this.game.add.existing(this.player)
        this.game.camera.follow(this.player, Phaser.Camera.FOLLOW_LOCKON, 0.05, 0.05); // smooth        
        
        this.createHud()
        this.updateHud()
        this.game.camera.flash(0x000000)

        this.initFullScreenButtons()        
    }

    createHud() {
        this.hud = {
            gameover: this.createText(this.game.width/2, 200, 'GAME OVER', 60, '#ff0000', true),
            gamewin:  this.createText(this.game.width/2, 200, 'LEVEL CLEAR', 60, '#00dd00', true),
            lifeIcon: this.game.add.sprite(20, 25, 'life-icon'),
            lifeText: this.createText(60, 43, 'x 0', 20),
            coinIcon: this.game.add.sprite(23, 60, 'coin'),
            coinText: this.createText(60, 80, 'x 0', 20)
        }
        this.hud.gameover.alpha = 0
        this.hud.gameover.scale.setTo(1.5, 1.5)
        this.hud.gamewin.scale.setTo(1.5, 0)
        this.hud.lifeIcon.scale.setTo(0.8, 0.8)
        this.hud.lifeIcon.fixedToCamera = true
        this.hud.coinIcon.fixedToCamera = true
        this.hud.lifeText.anchor.setTo(0,0.5)
        this.hud.coinText.anchor.setTo(0,0.5)
    }

    createBackgroundLayer(img) {
        let bg = this.game.add.tileSprite(
            -10, 0, this.game.width+20, this.game.height, img)
        bg.fixedToCamera = true       
        bg.tileScale.setTo(2, 3)
        return bg
    }

    createBackgrounds() {
        this.bgSky = this.createBackgroundLayer('background-sky')
        this.bgMountain = this.createBackgroundLayer('background-mountain')
    }

    createTileMap() {
        this.map = this.game.add.tilemap('level1'); 
        this.map.addTilesetImage('tiles1');

        this.mapLayer = this.map.createLayer('Tile Layer 1');
        //this.map.setCollisionBetween(1, 11, true, 'Tile Layer 1')
        this.map.setCollision([14,15,16,20,21,22,23,24,25,27,28,29,39,40,41], true, 'Tile Layer 1')
        this.map.setTileIndexCallback(39, this.hitPlayer, this)
        
        this.mapLayer.resizeWorld(); // redefine tamanho do mapa para adequar ao mapa
    }

    createDroids() {
        this.droids = this.game.add.group()
        this.map.createFromObjects('Object Layer 1', 62, 'droid', 0, true, true, this.droids, Droid);

        // init tiled added properties
        this.droids.forEach(function(droid) {
            droid.initProperties()
        })
    }

    // createDroids() {
    //     this.droids = this.game.add.group()
    //     this.map.createFromObjects('Object Layer 1', 62, 'droid', 0, true, true, this.droids, Droid);
    // }

    createCoins() {
        this.coinCount = 0
        this.coins = this.game.add.group()
        this.map.createFromObjects('Object Layer 1', 56, 'coin', 0, true, true, this.coins, Coin);
    }

    createExplosionsPool() {
        // cria pool de explosoes
        this.explosions = this.game.add.group()
        this.explosions.createMultiple(10, 'attack')
        this.explosions.forEach(function (exp) {
            let anim = exp.animations.add('full', null, 60, false) // null -> array of frames
            exp.scale.setTo(1.2, 1.2)
            exp.anchor.setTo(0.5, 0.5)
            anim.onComplete.add(() => exp.kill())
        })
    }

    createExplosion(x, y) {
        let exp = this.explosions.getFirstExists(false)
        exp.reset(x, y)
        exp.animations.play('full')
    }

    update() {
        this.bgSky.tilePosition.x -= 0.2
        this.bgMountain.tilePosition.x = -this.camera.x/5
        // check collision between player and tilemap
        this.game.physics.arcade.collide(this.player, this.mapLayer);
        // check collision between player and coins group
        this.game.physics.arcade.overlap(this.player, this.coins, this.collectCoin, null, this)
        // check collision between player and droids group
        this.game.physics.arcade.overlap(this.player, this.droids, this.hitDroid, null, this)
    }

    collectCoin(player, coin) {
        this.sfxCoin.play()
        coin.kill()
        this.coinCount++;
        this.updateHud()
        if (this.coins.countLiving() == 0) {
            this.gameWin()
        }            
    }

    hitPlayer() {
        // return to start position
        this.sfxHitPlayer.play()
        this.game.camera.shake(0.010, 200);
        this.player.damage(1)
        this.player.x = this.player.startX
        this.player.y = this.player.startY

        this.updateHud()
        if (!this.player.alive) {
            this.gameOver()
        }
    }

    hitDroid(player, droid) {
        if (!player.alive)
            return;        

        // player can jump on droids
        // if player is falling and above droid -> bump
        if (player.hitAttack(droid)) {
            this.sfxAttack.play()
            droid.kill()
            this.createExplosion(droid.x, droid.y)
            // this.sfx.stomp.play();
        } else {
            this.hitPlayer()
        }
    }

    restartGame() {
        this.camera.fade(0x000000)
        this.camera.onFadeComplete.addOnce(() => this.state.start('Title'), this)
    }

    gameWin() {  
        this.music.stop()
        this.musicWin.play()
        this.player.body.enable = false
        this.game.camera.follow(null)

        // show 'LEVEL CLEAR' with a scale tweening
        let tweenA = this.game.add.tween(this.hud.gamewin.scale)
            .to( { y: 1.5 }, 150)
            .to( { y: 0 }, 150, 'Linear', false, 3000)
            .start()
            .onComplete.add(this.restartGame, this);
    }    

    gameOver() {  
        this.music.stop()
        this.musicLose.play()
        this.game.camera.follow(null)

        // show 'GAME OVER' with a 'fade in' tweening
        let tweenA = this.game.add.tween(this.hud.gameover)
            .to( { alpha: 1 }, 150)
            .to( { alpha: 0 }, 150, 'Linear', false, 3000)
            .start()
            .onComplete.add(this.restartGame, this);
    }

    updateHud() {
        this.hud.lifeText.text = `x ${this.player.health}`
        this.hud.coinText.text = `x ${this.coinCount}/${this.coins.count()}`
    }

    render() {
        // this.droids.forEach(function(obj) { this.game.debug.body(obj) }, this)
        // this.game.debug.body(this.player)
    }
}