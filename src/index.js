import './style.scss';

import 'phaser';

import logoImage from './assets/sprites/phaser3-logo.png';


class PlayGame extends Phaser.Scene {
    constructor() {
        super("PlayGame");
    }
    preload() {
        this.load.image('logo', logoImage);
    }
    create() {
        this.image = this.add.image(400, 300, 'logo');
    }
    update() {
        this.image.rotation += 0.01;
    }
}

let config = {
    width: 800,
    height: 600,
    parent: 'thegame',
    scene: PlayGame
};

new Phaser.Game(config);
