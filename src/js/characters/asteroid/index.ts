import { type Container, Texture, TilingSprite } from "../../../library";
import type Ship from "../../characters/Ship";

interface AsteroidProps {
  /**
   * The texture of the asteroid.
   */
  texture: string;

  /**
   * The width of the asteroid.
   */
  width: number;

  /**
   * The height of the asteroid.
   */
  height: number;

  /**
   * The speed of the asteroid.
   */
  speed: number;
}

export default class Asteroid {
  public asteroid: TilingSprite;
  public x: number;
  public y: number;
  public speed: number;

  constructor({ texture, width, height, speed }: AsteroidProps) {
    this.asteroid = new TilingSprite({
      texture: Texture.from(texture),
      width,
      height,
    });
    this.x = Math.random() * (window.innerWidth - width);
    this.y = -height; // Starting from the top of the canvas
    this.speed = speed;
  }

  public update = (force?: boolean) => {
    this.y += this.speed; // Move the asteroid downwards

    // Reset position if it goes off the bottom of the canvas
    if (this.y > window.innerHeight || force) {
      this.x = Math.random() * (window.innerWidth - this.asteroid.width);
      this.y = -this.asteroid.height;
    }
  };

  public render = (ctx: CanvasRenderingContext2D, parents: Container[]) => {
    this.asteroid.x = this.x;
    this.asteroid.y = this.y;
    this.asteroid.render(ctx, parents);

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
      this.x + this.asteroid.width > ship.sprite.x &&
      this.y < ship.sprite.y + ship.sprite.height &&
      this.y + this.asteroid.height > ship.sprite.y
    );
  }
}
