
class PlayState extends GameState {

    preload() {
        this.game.load.image('wall', 'assets/wall.png')
        this.game.load.image('player', 'assets/airplane1.png')
        this.game.load.image('background', 'assets/sky.png')
        this.game.load.image('shot', 'assets/shot.png')
        this.game.load.image('saw', 'assets/saw.png')
        this.game.load.spritesheet('explosion', 'assets/explosion.png', 56, 56)
        this.game.load.image('fullscreen-button', 'assets/fullscreen-button.png')
        
        this.game.load.tilemap('level1', 'assets/mapa.json', null, Phaser.Tilemap.TILED_JSON)
    }

    create() {
        this.game.renderer.roundPixels = true
        //game.renderer.clearBeforeRender = false
        this.game.physics.startSystem(Phaser.Physics.ARCADE)
        
        this.game.camera.speedX = 10

        // fundo
        let background = this.game.add.tileSprite(0, 0, this.game.width, this.game.height, 'background')
        background.autoScroll(-30, 0)
        background.fixedToCamera = true

        // mapa com paredes
        this.createMap()        

        // players
        this.player1 = new Player(this.game, this.game.width*1/5, this.game.height/2, 'player', 0xff0000)
        this.player1.fixedToCamera = true
        this.player1.collided = false
        this.player2 = new Player(this.game, this.game.width*4/5, this.game.height/2, 'player', 0x00ff00)
        this.player2.fixedToCamera = true
        this.player2.angle = 180
        this.game.add.existing(this.player1)
        this.game.add.existing(this.player2)

        // exemplo de NPC simples com tweening
        this.saw = new Saw(this.game, 100, 100, 'saw')
        this.saw.fixedToCamera = true
        this.game.add.existing(this.saw)

        // HUD
        this.text1 = this.createHealthText(this.game.width*1/9, 50, 'PLAYER A: 5')
        this.text1.fixedToCamera = true
        this.text2 = this.createHealthText(this.game.width*8/9, 50, 'PLAYER B: 5')
        this.text2.fixedToCamera = true

        this.fps = new FramesPerSecond(this.game, this.game.width/2, 50)
        this.game.add.existing(this.fps)

        // adicionar controles de full screen a tela
        super.initFullScreenButtons()
    }
    
    createExplosion(x, y) {
        let explosion = game.add.sprite(x, y, 'explosion')
        let anim = explosion.animations.add('full', [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15] , 60, false)
        explosion.scale.setTo(0.5, 0.5)
        explosion.anchor.setTo(0.5, 0.5)   
        explosion.animations.add('four', [4] , 20, true)    
        explosion.animations.play('full')
        anim.onComplete.add( () => explosion.kill() )
    }

    createHealthText(x, y, string) {
        let style = {font: 'bold 16px Arial', fill: 'white'}
        let text = this.game.add.text(x, y, string, style)
        text.setShadow(3, 3, 'rgba(0, 0, 0, 0.5)', 2)
        text.anchor.setTo(0.5, 0.5)
        return text
    }

    createMap() {
        let mapTmx = this.game.add.tilemap('level1');
        this.game.world.setBounds(0, 0, mapTmx.widthInPixels, mapTmx.heightInPixels);

        this.map = this.game.add.group()   
        mapTmx.createFromObjects('Object Layer 1', 1, 'wall', 0, true, false, this.map, Block);
    }

    createMap_old() {
        let mapData = [ "  X                     X                     X                     X                     X                     X               ",
                        "                                                                                                                                ",
                        "                                                                                                                                ",
                        "                                                                                                                                ",
                        "             X                     X                     X                     X                     X                     X    ",
                        "                                                                                                                                ",
                        "                                                                                                                                ",
                        "                                                                                                                                ",
                        "  X                     X                     X                     X                     X                     X               ",
                        "                                                                                                                                ",
                        "                                                                                                                                ",
                        "                                                                                                                                ",
                        "             X                     X                     X                     X                     X                     X    ",
                        "                                                                                                                                ",
                        "                                                                                                                                ",
                        "                                                                                                                                ",
                        "  X                     X                     X                     X                     X                     X               ",
                        "                                                                                                                                ",
                        "                                                                                                                                "]
                        
        this.map = this.game.add.group()
        for (let row = 0; row < mapData.length; row++) {
            for (let col = 0; col < mapData[0].length; col++) {
                if (mapData[row][col] == 'X') {
                    let block = this.game.add.tileSprite(col*32, row*32, 32, 32, 'wall')
                    block.width = 128
                    block.height= 128
                    this.map.add(block)
                    this.game.physics.arcade.enable(block)
                    block.body.syncBounds = true
                    block.body.immovable = true
                    block.tag = 'wall'
                    block.autoCull = true
                    block.scale.setTo(1.3, 1.3)
                    block.inputEnabled = true
                    block.input.enableDrag(false, true)        
                }
            }
        }
    }

    update() { 
        // colisoes
        // this.game.physics.arcade.collide(player1, bullets2, hitPlayer)
        this.player1.collided = false
        this.game.physics.arcade.overlap(this.player1, this.map, this.hitPlayer)

        // move camera pelo mouse (clique nas metades da tela)
        if (this.game.input.mousePointer.isDown || this.game.input.pointer1.isDown) {
            let x = this.game.input.mousePointer.x + this.game.input.pointer1.x
            if (x < this.game.width/2)
                this.game.camera.x -= this.game.camera.speedX
            else
            if (x >= this.game.width/2)
                this.game.camera.x += this.game.camera.speedX
        }
    
    }

    hitPlayer(player, block) {
        player.collided = true
    }

    updateHud() {
        this.text1.text = 'PLAYER A: ' + this.player1.health
        this.text2.text = 'PLAYER B: ' + this.player2.health
    }

    render() {
        if (this.player1.collided)
            this.game.debug.body(this.player1, 'rgba(255,0,0,0.4')
        else
            this.game.debug.body(this.player1)
        //this.map.forEach(function(item) {
        //    this.game.debug.body(item)
        //}, this);       
        
        this.game.debug.pointer(this.game.input.mousePointer);
        this.game.debug.pointer(this.game.input.pointer1);        
    //    game.debug.body(player1)
    //    game.debug.body(player2)
    }
}

window.onload = function() {
    // funciona como singleton
    const GAME = new Game()
}