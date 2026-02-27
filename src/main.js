import Phaser from 'phaser';
import GameScene from './scenes/GameScene.js';
import './styles/main.css';

const css = getComputedStyle(document.documentElement);
const gameBgColor = css.getPropertyValue('--game-bg-color').trim();

const config = {
  type: Phaser.AUTO,
  backgroundColor: gameBgColor,
  scale: {
    mode: Phaser.Scale.RESIZE,
    width: '100%',
    height: '100%',
  },
  physics: {
    default: 'arcade',
    arcade: { debug: false },
  },
  scene: [GameScene],
};

export default new Phaser.Game(config);
