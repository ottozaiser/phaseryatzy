import Dice from './Dice.js';

const DICE_COUNT = 5;

export default class DiceTray extends Phaser.GameObjects.Container {
  /**
   * @param {Phaser.Scene} scene
   * @param {number} x - Left edge X
   * @param {number} y - Top edge Y
   * @param {number} width - Tray width
   * @param {number} height - Tray height
   * @param {string} textureKey - Phaser texture key for the tray background
   */
  constructor(scene, x, y, width, height, textureKey) {
    super(scene, x, y);

    this._trayWidth = width;
    this._trayHeight = height;

    // Tray background
    this._bg = scene.add.image(0, 0, textureKey);
    this._bg.setOrigin(0, 0);
    this._bg.setDisplaySize(width, height);
    this.add(this._bg);

    // Dice group
    this._diceContainer = scene.add.container(0, 0);
    this.add(this._diceContainer);

    this._dice = [];
    this._spawnDice();

    scene.add.existing(this);
  }

  /** Roll non-held dice with new random faces */
  roll() {
    const cy = this._trayHeight / 2 - 4;
    const bounceHeight = 60;

    this._dice.forEach((die, i) => {
      if (die.held) return;

      die.reroll();
      die.setVisible(true).setAlpha(1).setScale(1);

      this.scene.tweens.add({
        targets: die,
        y: cy - bounceHeight,
        duration: 180,
        ease: 'Sine.Out',
        delay: i * 60,
        onComplete: () => {
          this.scene.tweens.add({
            targets: die,
            y: cy,
            duration: 550,
            ease: 'Bounce.Out',
          });
        },
      });
    });
  }

  /** Returns an array of the current face values */
  get values() {
    return this._dice.map((d) => d.face);
  }

  /**
   * Animate all dice flying toward a world-space coordinate, then call onComplete.
   * Releases all holds after animation.
   */
  flyTo(worldX, worldY, onComplete) {
    const localX = worldX - this.x - this._diceContainer.x;
    const localY = worldY - this.y - this._diceContainer.y;
    let completed = 0;
    const total = this._dice.length;

    this._dice.forEach((die, i) => {
      this.scene.tweens.add({
        targets: die,
        x: localX,
        y: localY,
        scaleX: 0.15,
        scaleY: 0.15,
        alpha: 0,
        duration: 380,
        ease: 'Cubic.In',
        delay: i * 35,
        onComplete: () => {
          completed++;
          if (completed === total) {
            // Hide all dice until next roll
            this._dice.forEach((d) => {
              d.setAlpha(0).setScale(1).setVisible(false).release();
            });
            this._resetPositions();
            if (onComplete) onComplete();
          }
        },
      });
    });
  }

  _spawnDice() {
    const diceSize = Math.min(this._trayHeight * 0.7, 60);
    const spacing = this._trayWidth / (DICE_COUNT + 1);
    const cy = this._trayHeight / 2 - 4;

    for (let i = 0; i < DICE_COUNT; i++) {
      const cx = spacing * (i + 1);
      const die = new Dice(this.scene, cx, cy, diceSize);
      this._diceContainer.add(die);
      this._dice.push(die);
    }
  }

  _resetPositions() {
    const spacing = this._trayWidth / (DICE_COUNT + 1);
    const cy = this._trayHeight / 2 - 4;
    this._dice.forEach((die, i) => {
      die.x = spacing * (i + 1);
      die.y = cy;
    });
  }
}
