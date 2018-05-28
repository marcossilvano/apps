// console.clear();

var game = new Phaser.Game(800, 600, Phaser.CANVAS, 'phaser-example', {
    preload: preload,
    create: create,
    render: render,
    update: update
  });
  
  function preload() {
    game.load.image('sky', 'assets/sky.png');
    game.load.image('button', 'assets/button_thumbstick.png');
  }
  
  var sprite;
  var cursors;
  
  function create() {
    var activePointer = game.input.activePointer;
    
    game.world.setBounds(0, 0, 2000, 578);
    let sky = game.add.tileSprite(0, 0, 2000, 578, 'sky')
    
    // Capture does not prevent right-click -> contextmenu
    game.input.mouse.capture = true;
    
    game.canvas.oncontextmenu = function (e){ e.preventDefault(); };
    
    sprite = game.add.sprite(300, 300, 'button');
    sprite.inputEnabled = true;
    sprite.input.enableDrag(true);
    sprite.input.draggable = true;
    sprite.fixedToCamera = true;
    
    //sprite.cameraOffset.x = 300;
    //sprite.cameraOffset.y = 300;

    cursors = game.input.keyboard.createCursorKeys();    
  }
  
  function update() {
    if (cursors.up.isDown)
    {
        game.camera.y -= 8;
    }
    else if (cursors.down.isDown)
    {
        game.camera.y += 8;
    }

    if (cursors.left.isDown)
    {
        game.camera.x -= 8;
    }
    else if (cursors.right.isDown)
    {
        game.camera.x += 8;
    }
  }

  function render() {
    var activePointer = game.input.activePointer;
    
    game.debug.pointer(activePointer);
    game.debug.text('leftButton.isDown:  '  + activePointer.leftButton .isDown, 20, 20);
    game.debug.text('rightButton.isDown: ' + activePointer.rightButton.isDown, 20, 40);
    game.debug.text('input.draggable: '  + sprite.input.draggable, 20, 60);
  }