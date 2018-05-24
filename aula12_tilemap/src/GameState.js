'use strict'

class GameState extends BaseState {

    create() {
        this.game.physics.startSystem(Phaser.Physics.ARCADE)

        let skyWidth = this.game.cache.getImage('sky').width
        let skyHeight = this.game.cache.getImage('sky').height
        this.sky = this.game.add.tileSprite(
            0, 0, skyWidth, skyHeight, 'sky')
        this.sky.scale.x = this.game.width / this.sky.width
        this.sky.scale.y = this.game.height / this.sky.height
        this.sky.fixedToCamera = true

        this.fog = this.game.add.tileSprite(
            0, 0, this.game.width, this.game.height, 'fog')
        this.fog.tileScale.setTo(7, 7)
        this.fog.alpha = 0.4
        this.fog.fixedToCamera = true

        this.obstacles = this.game.add.group()
        //this.createMap()
        this.createTileMap()
        this.createExplosions()

        this.player1 = new Player(this.game, this.game.width * 2 / 9, this.game.height / 2,
            'plane1', 0xff0000, this.createBullets(), {
                left: Phaser.Keyboard.LEFT,
                right: Phaser.Keyboard.RIGHT,
                up: Phaser.Keyboard.UP,
                down: Phaser.Keyboard.DOWN,
                fire: Phaser.Keyboard.UP//L
            })
        this.game.add.existing(this.player1)
        this.game.camera.follow(this.player1, Phaser.Camera.FOLLOW_LOCKON, 0.1, 0.1); // smooth        

        this.hud = {
            text1: this.createText(this.game.width * 1 / 9, 50, 'PLAYER 1: 20'),
            text2: this.createText(this.game.width * 8 / 9, 50, 'PLAYER 2: 20')
            //fps: createHealthText(game.width*6/9, 50, 'FPS'),
        }
        this.updateHud()

        let fps = new FramesPerSecond(this.game, this.game.width / 2, 50)
        this.game.add.existing(fps)

        let fullScreenButton = this.game.input.keyboard.addKey(Phaser.Keyboard.ONE)
        fullScreenButton.onDown.add(this.toggleFullScreen, this)

        //game.time.advancedTiming = true;
        this.initFullScreenButtons()
    }

    loadFile() {
        let text = this.game.cache.getText('map1');
        return text.split('\n');
    }

    createTileMap() {
        this.map = this.game.add.tilemap('level1'); 
        // nome hash do tileset.png e tileset no Tiled Editor
        this.map.addTilesetImage('tiles1');

        this.mapLayer = this.map.createLayer('Tile Layer 1');
//        this.map.setCollisionBetween(1, 11, true, 'Tile Layer 1')
//        map.setCollisionByExclusion([4,8,10,2]);
    
//        this.trapsLayer = this.map.createLayer('Traps Layer 1');
//        this.map.setCollision([29], true, 'Traps Layer 1')
                
        this.mapLayer.resizeWorld(); // redefine tamanho do mapa para adequar ao mapa
    }

    createMap() {
        // carrega mapa de arquivo texto
        let mapData = this.loadFile()

        this.map = this.game.add.group()
        for (let row = 0; row < mapData.length; row++) {
            for (let col = 0; col < mapData[row].length; col++) {
                // tipo
                let tag = mapData[row][col]
                // parametro
                let param = ''
                if (col + 1 < mapData[row].length)
                    param = mapData[row][col + 1]

                if (tag == 'X') {
                    let wall = this.map.create(col * 32, row * 32, 'wall')
                    this.game.physics.arcade.enable(wall)
                    wall.body.immovable = true
                    wall.tag = 'wall'
                } else
                    if (tag == 'S') {
                        this.createSaw(col * 32, row * 32, param)
                    }
            }
        }
    }

    spawnSaw(x, y, type) {
        let saw = new Saw(this.game, x, y, 'saw', type)
        this.obstacles.add(saw)
    }

    createSaw(x, y, type) {
        this.game.time.events.repeat(Phaser.Timer.SECOND * 0.5, 7, this.spawnSaw, this, x, y, type);
    }

    createBullets() {
        let bullets = this.game.add.group()
        bullets.enableBody = true
        bullets.physicsBodyType = Phaser.Physics.ARCADE
        bullets.createMultiple(10, 'shot')
        bullets.setAll('anchor.x', 0.5)
        bullets.setAll('anchor.y', 0.5)
        return bullets
    }

    createExplosions() {
        // cria pool de explosoes
        this.explosions = this.game.add.group()
        this.explosions.createMultiple(30, 'explosion')
        this.explosions.forEach(function (exp) {
            let anim = exp.animations.add('full', null, 60, false) // null -> array of frames
            exp.scale.setTo(0.5, 0.5)
            exp.anchor.setTo(0.5, 0.5)
            anim.onComplete.add(() => exp.kill())
        })
    }

    createExplosion(x, y) {
        let exp = this.explosions.getFirstExists(false)
        exp.reset(x, y)
        exp.animations.play('full')
    }

    toggleFullScreen() {
        this.game.scale.fullScreenScaleMode = Phaser.ScaleManager.SHOW_ALL
        if (this.game.scale.isFullScreen) {
            this.game.scale.stopFullScreen()
        } else {
            this.game.scale.startFullScreen(false)
        }
    }

    updateBullets(bullets) {
        bullets.forEach(function (bullet) {
            this.game.world.wrap(bullet, 0, true)
        }, this)
    }

    update() {
        //    hud.fps.text = `FPS ${game.time.fps}`
        this.sky.tilePosition.x += 0.5
        this.fog.tilePosition.x += 0.3

        //moveAndStop(player1)
        this.updateBullets(this.player1.bullets)

        // colisoes com mapa
/*        this.game.physics.arcade.collide(this.player1, this.map)
        this.game.physics.arcade.collide(this.player2, this.map)
        this.game.physics.arcade.collide(this.player1.bullets, this.map, this.killBullet, null, this)
        this.game.physics.arcade.collide(this.player2.bullets, this.map, this.killBullet, null, this)
*/
        // colisao com serras
        this.game.physics.arcade.collide(this.player1, this.obstacles, this.hitObstacle, null, this)
    }

    killBullet(bullet, wall) {
        //wall.kill()
        bullet.kill()
        this.createExplosion(bullet.x, bullet.y)
    }

    hitObstacle(player, obstacle) {
        if (player.alive) {
            player.damage(1)
            this.updateHud()
            this.game.camera.shake(0.01, 200);

            // empurra jogador na direcao oposta a da colisao
            let forceDirection = this.game.physics.arcade.angleBetween(obstacle, player)
            this.game.physics.arcade.velocityFromRotation(forceDirection, 600, player.body.velocity)
        }
    }

    hitPlayer(player, bullet) {
        if (player.alive) {
            player.damage(1)
            bullet.kill()
            this.createExplosion(bullet.x, bullet.y)
            this.updateHud()
            this.game.camera.shake(0.01, 200);
        }
    }

    updateHud() {
        this.hud.text1.text = `PLAYER 1: ${this.player1.health}`
    }

    render() {
        //obstacles.forEach(function(obj) { game.debug.body(obj) })
        //game.debug.body(player1)
        //game.debug.body(player2)
    }
}