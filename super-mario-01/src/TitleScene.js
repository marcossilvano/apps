class TitleScene extends Phaser.Scene {
    constructor(test) {
      super({
        key: 'TitleScene'
      });
    }
    preload()
    {
        this.load.atlas('mario-sprites', 'assets/mario-sprites.png', 'assets/mario-sprites.json');
    }
    create()
    {
        let config = {
            key: 'title',
            frames: [{ frame: 'title', key: 'mario-sprites' }],
        };
        this.anims.create(config);
    
        this.title = this.add.sprite(this.sys.game.config.width/2-176/2, 48);
        this.title.play("title");
        this.attractMode = this.scene.launch('MarioBrosScene');
        console.log(this.attractMode.stop);

        this.scene.bringToTop();

        this.registry.set('restartScene', false);
        this.registry.set('attractMode', true);

        let sh = window.screen.availHeight;
        let sw = window.screen.availWidth;
        let ch = 0;
        let cw = 0;
        if(sh/sw > 0.6) {
            // Portrait
            cw = sw;
            ch = sw*0.6;

        }
        else {
            // Landscape
            console.log("landscape")
            cw = sh/0.6;
            ch = sh;
        }
        let el = document.getElementsByTagName('canvas')[0];
        console.log(el);
        el.style.width = cw*0.8+"px";
        el.style.height = ch*0.8+"px";
        console.log(cw,ch);

        this.pressX = this.add.bitmapText(0, 8*16, 'font', "PRESS X OR TOUCH TITLE TO START", 8);
        this.pressX.x = (this.sys.game.config.width - this.pressX.width)/2
        this.blink = 1000;

        this.startKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.X);

        this.touchStart = false

        this.title.setInteractive();
        this.title.on('pointerdown', (pointer) => {
          this.touchStart = true;
        });
    
    }
    update(time, delta)
    {
        if(this.registry.get('restartScene')){
            this.restartScene();

        }
        this.blink-=delta;
        if(this.blink<0){
            this.pressX.alpha = this.pressX.alpha === 1 ? 0 : 1;
            this.blink = 500;
        }

        if(!this.registry.get('attractMode')){
        }

        if((this.startKey.isDown) || (this.touchStart)){
            this.scene.stop('MarioBrosScene');
            this.registry.set('attractMode', false);
            this.scene.start('MarioBrosScene');

        }

    }
    restartScene(){
        //        this.attractMode.stop();
        this.scene.stop('MarioBrosScene');
        this.scene.launch('MarioBrosScene');
        this.scene.bringToTop();

        this.registry.set('restartScene', false);

    }
}

//export default TitleScene;
