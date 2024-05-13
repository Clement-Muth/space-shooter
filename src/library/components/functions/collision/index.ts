import type Sprite from "../../drawables/sprite";

/**
 * Represents a collision between two sprites.
 */
interface CollisionProps {
  sprite1: Sprite;
  sprite2: Sprite;
}

/**
 * CollisionManager Class
 *
 * The `CollisionManager` class manages collisions between sprites.
 */
export default class Collision {
  private sprites: Sprite[];

  /**
   * Constructs a new instance of CollisionManager.
   * @param sprites The list of sprites to manage collisions for.
   */
  constructor(sprites: Sprite[]) {
    this.sprites = sprites;
  }

  /**
   * Checks for collisions between sprites.
   * @returns An array of collisions detected between sprites.
   */
  public checkCollisions(): CollisionProps[] {
    const collisions: CollisionProps[] = [];

    for (let i = 0; i < this.sprites.length; i++) {
      for (let j = i + 1; j < this.sprites.length; j++) {
        const sprite1 = this.sprites[i];
        const sprite2 = this.sprites[j];

        if (Collision.isColliding(sprite1, sprite2)) {
          collisions.push({ sprite1, sprite2 });
        }
      }
    }

    return collisions;
  }

  /**
   * Checks if two sprites are colliding.
   * @param sprite1 The first sprite.
   * @param sprite2 The second sprite.
   * @returns True if the sprites are colliding, otherwise False.
   */
  public static isColliding(sprite1: Sprite, sprite2: Sprite): boolean {
    return (
      sprite1.x < sprite2.x + sprite2.width &&
      sprite1.x + sprite1.width > sprite2.x &&
      sprite1.y < sprite2.y + sprite2.height &&
      sprite1.y + sprite1.height > sprite2.y
    );
  }
}
