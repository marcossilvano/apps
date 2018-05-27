'use strict'

/**
 * Exemplo versão 02
 * - ECMAScript 6
 * - touch controls
 * - botão de fullscreen para mobile
 * - tileMap
 */

const config = {}
config.RES_X = 800 // resolucao HD
config.RES_Y = 480
config.RENDERER = Phaser.CANVAS // funciona no Cocoon JS
config.ROUND_PIXELS = true // renderiza sprite com posicoes inteiras (remove blur)
config.ANTIALIAS = true // remove filtro de suavização de pixels da tela
config.SCALE_MODE = Phaser.ScaleManager.EXACT_FIT // escala para preencher a tela; não mantém proporção
config.MOBILE_MODE = true // ajuda a definir particularidades para modo mobile

config.PLAYER_ACCELERATION = 600
config.PLAYER_TURN_VELOCITY = 350
//config.PLAYER_VELOCITY = 250
config.PLAYER_MAX_VELOCITY = 400//250
config.PLAYER_HEALTH = 30
config.PLAYER_DRAG = 600

config.BULLET_FIRE_RATE = 20
config.BULLET_ANGLE_ERROR = 0.1
config.BULLET_LIFE_SPAN = 750
config.BULLET_VELOCITY = 600

config.SAW_VELOCITY = 150

class Game extends Phaser.Game {
    constructor() {
        super(config.RES_X, config.RES_Y, config.RENDERER,
            'game-container', null, false, config.ANTIALIAS)

        // registrando as telas (Phaser.State) do jogo
        this.state.add('Boot', BootState, false)
        this.state.add('Title', TitleState, false)
        this.state.add('Game', GameState, false)
        this.state.start('Boot')
    }
}

// cria jogo
let GAME = new Game()
/*
window.onload = function() {
    // funciona como singleton
    GAME = new Game()
}
*/