import { Container, Sprite, Texture, TilingSprite } from "../../../library";
import Controller from "../../../library/components/functions/controller";
import type Asteroid from "../asteroid";
import getShipAssets from "./assets";

export default class Ship {
  public view: Container;
  public sprite: Sprite;
  public size: { width: number; height: number };
  public color: "red" | "blue";
  public missiles: Missile[];

  private fireRate: number;
  private lastFireTime: number;

  constructor({ controle, size, color }) {
    this.view = new Container();
    this.size = size;
    this.fireRate = 10;
    this.lastFireTime = 0;
    this.missiles = [];
    this.color = color;

    const shipAssets = getShipAssets(this.size);

    this.sprite = new Sprite("idle", shipAssets, {
      height: this.size.height,
      width: this.size.width,
    });

    new Controller(this.sprite, 4, controle);

    this.view.addChild(this.sprite);
  }

  update(delta: number) {
    this.handleFiring(delta);
    this.updateMissiles(delta);
  }

  handleFiring(delta: number) {
    this.lastFireTime += delta;

    if (this.lastFireTime > 1000 / this.fireRate) {
      this.fireMissile();
      this.lastFireTime = 0;
    }
  }

  fireMissile() {
    const missile = new Missile({
      x: this.sprite.x + this.size.width / 2,
      y: this.sprite.y,
      color: this.color,
    });

    this.missiles.push(missile);
    this.view.addChild(missile.view);
  }

  updateMissiles(delta: number) {
    for (let i = this.missiles.length - 1; i >= 0; i--) {
      const missile = this.missiles[i];
      missile.update(delta);
      if (missile.isOutOfScreen()) {
        this.missiles.splice(i, 1);
        missile.destroy();
      }
    }
  }
}

class Missile {
  public view: Container;
  public sprite: TilingSprite;
  public speed: number;

  constructor({ x, y, color }) {
    this.view = new Container();

    this.sprite = new TilingSprite({
      texture: Texture.from(color === "red" ? "missile-red" : "missile-blue"),
      height: 20,
      width: 11,
    });

    this.sprite.x = x;
    this.sprite.y = y;

    this.speed = 1000;

    this.view.addChild(this.sprite);
  }

  isOutOfScreen() {
    return this.sprite.y + this.sprite.height < 0;
  }

  update(delta: number) {
    this.sprite.y -= this.speed * (delta / 1000);
    if (this.sprite.y + this.sprite.height < 0) {
      this.destroy();
    }
  }

  destroy() {
    this.view.removeChild(this.view);
  }

  /**
   * Checks collision with an asteroid.
   * @param asteroid The asteroid to check collision with.
   * @returns True if collision detected, otherwise false.
   */
  public checkCollisionWithasteroid(asteroid: Asteroid): boolean {
    return (
      this.sprite.x < asteroid.asteroid.x + asteroid.asteroid.width &&
      this.sprite.x + this.sprite.width > asteroid.asteroid.x &&
      this.sprite.y < asteroid.asteroid.y + asteroid.asteroid.height &&
      this.sprite.y + this.sprite.height > asteroid.asteroid.y
    );
  }
}
