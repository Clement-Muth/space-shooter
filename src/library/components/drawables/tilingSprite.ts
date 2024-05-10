import type Container from "../containers/container";

/**
 * Represents the properties of a TilingSprite.
 */
interface TilingSpriteProps {
  /**
   * The texture of the TilingSprite.
   */
  texture: string;

  /**
   * The width of the TilingSprite.
   */
  width: number;

  /**
   * The height of the TilingSprite.
   */
  height: number;
}

/**
 * TilingSprite Class
 *
 * The `TilingSprite` class represents a sprite that repeats its texture to fill the given width and height.
 */
export default class TilingSprite {
  /**
   * The texture of the TilingSprite.
   */
  public texture: string;

  /**
   * The width of the TilingSprite.
   */
  public width: number;

  /**
   * The height of the TilingSprite.
   */
  public height: number;

  public x: number;
  public y: number;

  /**
   * The image element used for the TilingSprite.
   */
  private image: HTMLImageElement;

  /**
   * Constructs a new TilingSprite instance.
   * @param texture The texture of the TilingSprite.
   * @param width The width of the TilingSprite.
   * @param height The height of the TilingSprite.
   */
  constructor({ texture, width, height }: TilingSpriteProps) {
    const image = new Image();
    image.src = texture;

    this.texture = texture;
    this.width = width;
    this.height = height;
    this.image = image;
    this.x = 0;
    this.y = 0;
  }

  /**
   * Updates the texture of the TilingSprite.
   * @param texture The new texture of the TilingSprite.
   */
  public update = (texture: string) => {
    this.image.src = texture;
  };

  /**
   * Renders the TilingSprite on the canvas.
   * @param ctx The rendering context of the canvas.
   */
  public render = (ctx: CanvasRenderingContext2D, parents: Container[]) => {
    const absoluteX = parents.reduce((acc, parent) => acc + parent.x, 0);
    const absoluteY = parents.reduce((acc, parent) => acc + parent.y, 0);

    ctx.drawImage(
      this.image,
      absoluteX + this.x,
      absoluteY + this.y,
      this.width,
      this.height,
    );
  };
}
