import { type Container, Texture, TilingSprite } from "../../../library";
import type Ship from "../Ship";

interface UpgradeProps {
  /**
   * The texture of the upgrade.
   */
  texture: string;

  /**
   * The width of the upgrade.
   */
  width: number;

  /**
   * The height of the upgrade.
   */
  height: number;

  /**
   * The speed of the upgrade.
   */
  speed: number;
}

export default class Upgrade {
  public upgrade: TilingSprite;
  public x: number;
  public y: number;
  public speed: number;

  constructor({ texture, width, height, speed }: UpgradeProps) {
    this.upgrade = new TilingSprite({
      texture: Texture.from(texture),
      width,
      height,
    });
    this.x = Math.random() * (window.innerWidth - width);
    this.y = -height; // Starting from the top of the canvas
    this.speed = speed;
  }

  public update = (force?: boolean) => {
    this.y += this.speed; // Move the upgrade downwards

    // Reset position if it goes off the bottom of the canvas
    if (this.y > window.innerHeight || force) {
      this.x = Math.random() * (window.innerWidth - this.upgrade.width);
      this.y = -this.upgrade.height;
    }
  };

  public render = (ctx: CanvasRenderingContext2D, parents: Container[]) => {
    this.upgrade.x = this.x;
    this.upgrade.y = this.y;
    this.upgrade.render(ctx, parents);

    this.update();
  };

  /**
   * Checks collision with a ship.
   * @param ship The ship to check collision with.
   * @returns True if collision detected, otherwise false.
   */
  public checkCollisionWithShip(ship: Ship): boolean {
    return (
      this.x < ship.sprite.x + ship.sprite.width &&
      this.x + this.upgrade.width > ship.sprite.x &&
      this.y < ship.sprite.y + ship.sprite.height &&
      this.y + this.upgrade.height > ship.sprite.y
    );
  }
}
