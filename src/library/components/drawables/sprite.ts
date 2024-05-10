import type Container from "../containers/container";
import type View from "../containers/view";
import type TilingSprite from "./tilingSprite";

/**
 * Represents a frame of animation within a sprite.
 */
interface SpriteFrame {
  image: TilingSprite;
  duration: number;
}

interface AnimationSpriteFrame {
  idle: SpriteFrame[];
  moveSouth: SpriteFrame[];
  moveNorth: SpriteFrame[];
  moveEast: SpriteFrame[];
  moveWest: SpriteFrame[];
  layDown: SpriteFrame[];
}

/**
 * Sprite Class
 *
 * The `Sprite` class represents a display object for an animated sprite on a canvas.
 */
export default class Sprite implements View {
  /**
   * The x and y coordinates of the sprite.
   */
  public x: number;
  public y: number;

  /**
   * Indicates if the sprite is interactive.
   */
  public interactive: boolean;

  /**
   * The list of all possible animation frames of the sprite.
   */
  public animationFrames: AnimationSpriteFrame;

  /**
   * The list of animation frames of the sprite.
   */
  private frames: SpriteFrame[];

  /**
   * The index of the current frame.
   */
  private currentFrameIndex: number;

  /**
   * The time when the current frame started to be displayed.
   */
  private currentFrameStartTime: number;

  /**
   * Constructs a new instance of Sprite.
   * @param frames The list of animation frames of the sprite.
   */
  constructor(
    defaultFrames: keyof AnimationSpriteFrame,
    animationFrames: AnimationSpriteFrame,
  ) {
    this.x = 0;
    this.y = 0;
    this.interactive = false;
    this.animationFrames = animationFrames;
    this.frames = this.animationFrames[defaultFrames];
    this.currentFrameIndex = 0;
    this.currentFrameStartTime = 0;
  }

  public udpateFrames = (frames: SpriteFrame[]) => {
    this.frames = frames;
    this.currentFrameIndex = 0;
  };

  /**
   * Renders the sprite on the canvas.
   * @param ctx The rendering context of the canvas.
   * @param parents The parent containers for calculating position.
   */
  public render = (ctx: CanvasRenderingContext2D, parents: Container[]) => {
    const currentFrame = this.frames[this.currentFrameIndex];
    currentFrame.image.x = this.x;
    currentFrame.image.y = this.y;
    currentFrame.image.render(ctx, parents);

    const now = Date.now();
    if (now - this.currentFrameStartTime >= currentFrame.duration) {
      this.currentFrameIndex =
        (this.currentFrameIndex + 1) % this.frames.length;
      this.currentFrameStartTime = now;
    }
  };

  /**
   * Checks if the mouse is over the sprite.
   * @param x The x-coordinate of the mouse position.
   * @param y The y-coordinate of the mouse position.
   * @param ctx The rendering context of the canvas.
   * @param parents The parent containers for calculating position.
   * @returns True if the mouse is over the sprite, otherwise False.
   */
  public isMouseOver = (
    _x: number,
    _y: number,
    _ctx: CanvasRenderingContext2D,
    _parents: Container[],
  ) => false;
}
