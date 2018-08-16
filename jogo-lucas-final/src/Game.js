'use strict'

/**
 * Classe principal do Jogo
 * Código inicia por ela
 */

const config = {}
config.WIDTH = 800  // width in pixels of the game view
config.HEIGHT= 480  // height in pixels of the game view
config.RENDERER = Phaser.CANVAS // the browser's canvas API has better compatibility than WebGL
config.ROUND_PIXELS = true // improves pixel fidelity
config.ANTIALIAS = true // filter's the whole image; prevents pixalated graphics
config.SCALE_MODE = Phaser.ScaleManager.SHOW_ALL // game view will scale maintaining proportions

config.GRAVITY = 1500   // gravity value for physics engine
// config for player properties
config.PLAYER_VELOCITY = 200 
config.PLAYER_FALL_VELOCITY = 400
config.PLAYER_JUMP_VELOCITY = 600
config.PLAYER_DOUBLE_JUMP_VELOCITY = 600
config.PLAYER_LIVES = 3
config.PLAYER_TYPE = 'eduardo'

class Game extends Phaser.Game {
    constructor() {
        super(config.WIDTH, config.HEIGHT, config.RENDERER,
            null, null, false, config.ANTIALIAS)
        // adding scenes (Phaser.State) to the game
        this.state.add('Boot', BootState)
        this.state.add('Title', TitleState)
        this.state.add('Select', SelectState)
        this.state.add('Game', GameState)
        this.state.start('Boot')
    }
}
const GAME = new Game() // create the game