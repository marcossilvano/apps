// objetos do jogo
var player;
var background;
var balls;
var square;
var textGameOver;

// controle de estados
var isGameOver = false;

// entradas
var cursors;
var fireButton;

// config do jogo
var gameWidth  = 1024;
var gameHeight = 600;
var backgroundRotationSpeed = 0.33;
var playerSpeed = 200;
var ballSpeed = 100;
var ballLaunchDelay = 2;

// score e UI
var score = 0;
var highScore = localStorage.getItem("highScore");
var textScore;
var textHighScore;
var textTime;

// Create a Phaser game instance
var game = new Phaser.Game(
	gameWidth,
	gameHeight,
	Phaser.AUTO,
	'container',
	{ preload: preload, create: create, update: update, render: render }
);

// Preload assets
function preload() {
	game.load.image('player', 'assets/player.png');
	game.load.image('background', 'assets/background.png')
	game.load.image('ball', 'assets/circle.png')
	game.load.image('square', 'assets/square.png')
	game.load.image('gameover', 'assets/texto_fim_de_jogo.png')
}

// Assets are available in create
function create() {
	// TECLAS
	cursors = game.input.keyboard.createCursorKeys();
	fireButton = game.input.keyboard.addKey(Phaser.KeyCode.SPACEBAR);
	
	// FUNDO
	background = game.add.sprite(game.world.centerX, game.world.centerY, 'background');
	background.anchor.setTo(0.5, 0.5);
	background.scale.setTo(1.75, 2);
    
	// PLAYER
	player = game.add.sprite(game.world.centerX, game.world.centerY+200, 'player');
	player.anchor.setTo(0.5, 0.5);
	player.scale.setTo(0.75, 0.75);
    game.physics.arcade.enable(player);
	player.body.setSize(30, 30, 0, 0); // diminui caixa de colisao
    
	// BALLS GROUP
    balls = game.add.group();
    balls.enableBody = true; // habilita fisica para as bolas colocadas no grupo

	// SQUARE
	square = game.add.sprite(game.world.centerX, game.world.centerY, 'square');
	square.anchor.setTo(0.5, 0.5);
	
	// GAME OVER
	//var text = "PERDEU!!\n- pressione espaco para reiniciar- ";
    //var style = { font: "65px Verdana", fill: "#ff0044", align: "center" };
    //textGameOver = game.add.text(game.world.centerX, game.world.centerY, text, style);
	//textGameOver.anchor.setTo(0.5, 0.5);
	textGameOver = game.add.sprite(game.world.centerX, game.world.centerY, 'gameover');
	textGameOver.anchor.setTo(0.5, 0.5);
	textGameOver.scale.setTo(0.75, 0.75);
	textGameOver.tint = 0xff0000;
	textGameOver.visible = false;
	
	var style = {font: "bold 16px Arial", fill: "red", textAlign: "center"};
	textScore = game.add.text(gameWidth/2-40, gameHeight/2+100, 'TEMPO: 00', style);
	textScore.setShadow(3, 3, 'rgba(0,0,0,0.5)', 2);
	textScore.visible = false;

	textHighScore = game.add.text(gameWidth/2-75, gameHeight/2+125, 'MELHOR TEMPO: 00', style);
	textHighScore.setShadow(3, 3, 'rgba(0,0,0,0.5)', 2);
	textHighScore.visible = false;
	
	textTime = game.add.text(gameWidth - 150, 30, 'TEMPO: 0', {font: "bold 16px Arial", fill: "white"});
	textTime.setShadow(0, 0, 'rgba(0,0,0,1)', 4);

	let fullScreenButton = game.input.keyboard.addKey(Phaser.Keyboard.ONE);
	fullScreenButton.onDown.add(toogleFullScreen, this)	
	
	// agenda primeira bola para X segundos
	game.time.events.add(Phaser.Timer.SECOND * ballLaunchDelay, launchBall, this);
	
	// agenda primeiro ponto para 1 segundo
	game.time.events.add(Phaser.Timer.SECOND * 1, addScore, this);
}

function toogleFullScreen() {
	game.scale.fullScreenScaleMode = Phaser.ScaleManager.EXACT_FIT;
	if (game.scale.isFullScreen) {
		game.scale.stopFullScreen();
	} else {
		game.scale.startFullScreen(false);
	}
}


// Update
function update() {
	updatePlayer();
	
	// rotaciona fundo
	background.angle += backgroundRotationSpeed;	
	square.angle -= 0.5;
	
	// reiniciar
	if (fireButton.isDown) {
		location.reload();
	}
}

function updatePlayer() {
    //  Checks to see if the player overlaps with any of the items, if he does call gameover function
    game.physics.arcade.overlap(player, balls, gameOver, null, this);
	
	// move esquerda-direita
    if (cursors.left.isDown) {
        player.body.velocity.x = -playerSpeed;
        player.body.velocity.y = 0;
		player.angle = 180;
    }
    else if (cursors.right.isDown) {
        player.body.velocity.x = playerSpeed;
        player.body.velocity.y = 0;
		player.angle = 0;
    }
	// move cima-baixo
    else if (cursors.up.isDown) {
        player.body.velocity.x = 0;
        player.body.velocity.y = -playerSpeed;
		player.angle = 270;
    }
    else if (cursors.down.isDown) {
        player.body.velocity.x = 0;
        player.body.velocity.y = playerSpeed;
		player.angle = 90;
    }
	
	// transporta player entre bordas da tela
	game.world.wrap(player, 0, true);
}

function gameOver() {
	player.kill();
	isGameOver = true;
	textGameOver.visible = true;
	game.time.events.stop();
	
	if (score > highScore) {
		highScore = score;
	}
	
	textScore.visible = true;
	textScore.text = "TEMPO: " + score;
	textHighScore.visible = true;
	textHighScore.text = "MELHOR TEMPO: " + highScore;
	
	localStorage.setItem("highScore", highScore);
}

function addScore() {
	score += 1;
	textTime.text = "TEMPO: " + score;
	
	// lanca nova bola em 1 segundo
	game.time.events.add(Phaser.Timer.SECOND * 1, addScore, this);
}

function launchBall() {
	var ball = balls.create(game.world.centerX, game.world.centerY, 'ball');
	//game.physics.arcade.enable(ball);	
	ball.body.collideWorldBounds = true;
	ball.body.bounce.setTo(1, 1); // 100% de elasticidade
	ball.anchor.setTo(0.5, 0.5);
	ball.scale.setTo(0.75, 0.75);
	ball.body.setSize(30, 30, 0, 0); // diminui caixa de colisao
	
	// velocidade X e Y aleatorias entre -100 e 100
	ball.body.velocity.x = game.rnd.integerInRange(-ballSpeed, ballSpeed);
	ball.body.velocity.y = game.rnd.integerInRange(-ballSpeed, ballSpeed);
	// velocidade minima da bola: 10 em cada eixo
	if (Math.abs(ball.body.velocity.x) < 10) ball.body.velocity.x *= 10; 
	if (Math.abs(ball.body.velocity.y) < 10) ball.body.velocity.y *= 10; 
	
	// lanca nova bola em 1 segundo
	game.time.events.add(Phaser.Timer.SECOND * ballLaunchDelay, launchBall, this);
}

// Render some debug text on screen
function render() {
	game.debug.text('FUJA PHAZER DEMO', 10, 30);
	game.debug.text(' [SETAS] movimentos', 10, 55);
	game.debug.text(' [1] fullscreen', 10, 80);
	game.debug.text(' [ESPAÇO] reiniciar', 10, 105);
	
	//game.debug.bodyInfo(player, 32, 32);
    /*
	game.debug.body(player);
	for (var i = 0; i < balls.length; i++) {
		game.debug.body(balls.children[i]);
	}
	*/
}