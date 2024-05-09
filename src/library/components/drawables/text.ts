import type Container from "../containers/container";
import type View from "../containers/view";

/**
 * Represents the style of text.
 */
export class TextStyle {
  /**
   * The alignment of the text.
   */
  public align?: "left" | "right" | "center";

  /**
   * The fill color of the text.
   */
  public fill?: string;

  /**
   * The font family of the text.
   */
  public fontFamily?: string;

  /**
   * The font size of the text.
   */
  public fontSize?: number;

  /**
   * The font weight of the text.
   */
  public fontWeight?: "normal" | "bold" | "semibold";

  /**
   * The parent coordinates for positioning the text.
   */
  public parent?: { x: number; y: number };

  constructor() {
    this.align = "left";
    this.fill = "white";
    this.fontFamily = "Arial";
    this.fontSize = 24;
    this.fontWeight = "normal";
    this.parent = { x: 0, y: 0 };
  }
}

/**
 * Text Class
 *
 * The `Text` class represents a display object for rendering text on a canvas.
 */
export default class Text implements View {
  /**
   * The x-coordinate of the text position.
   */
  public x: number;

  /**
   * The y-coordinate of the text position.
   */
  public y: number;

  /**
   * The text content.
   */
  public text: string;

  /**
   * Indicates whether the text is interactive.
   */
  public interactive: boolean;

  /**
   * The style of the text.
   */
  private style: TextStyle;

  private onClickCb: () => void;

  /**
   * Constructs a new Text instance.
   * @param text The text content.
   * @param style Optional style for the text.
   */
  constructor({ text, style }: { text: string; style?: TextStyle }) {
    this.x = 0;
    this.y = 0;
    this.text = text;
    this.interactive = false;
    this.style = { ...new TextStyle(), ...style };
  }

  /**
   * Renders the text on the canvas.
   * @param ctx The rendering context of the canvas.
   * @param parents The parent containers for calculating position.
   */
  public render = (ctx: CanvasRenderingContext2D, parents: Container[]) => {
    const absoluteX = parents.reduce((acc, parent) => acc + parent.x, 0);
    const absoluteY = parents.reduce((acc, parent) => acc + parent.y, 0);

    ctx.font = `${this.style.fontWeight} ${this.style.fontSize}px ${this.style.fontFamily}`;
    ctx.fillStyle = this.style.fill!;
    ctx.textAlign = this.style.align!;
    ctx.fillText(this.text, absoluteX + this.x, absoluteY + this.y);
  };

  /**
   * Checks if the mouse is over the text.
   * @param x The x-coordinate of the mouse position.
   * @param y The y-coordinate of the mouse position.
   * @param ctx The rendering context of the canvas.
   * @param parents The parent containers for calculating position.
   * @returns True if the mouse is over the text, otherwise false.
   */
  public isMouseOver = (
    x: number,
    y: number,
    ctx: CanvasRenderingContext2D,
    parents: Container[],
  ) => {
    const absoluteX = parents.reduce((acc, parent) => acc + parent.x, 0);
    const absoluteY = parents.reduce((acc, parent) => acc + parent.y, 0);
    const width = ctx.measureText(this.text).width;

    return (
      x >= absoluteX + this.x &&
      x <= absoluteX + this.x + width &&
      y >= absoluteY + this.y - this.style.fontSize! &&
      y <= absoluteY + this.y
    );
  };

  public onClick = (cb) => {
    this.onClickCb = cb;
  };

  /**
   * Executes the click action if the text is clicked.
   * @param x The x-coordinate of the click.
   * @param y The y-coordinate of the click.
   * @param ctx The rendering context of the canvas.
   * @param parents The parent containers for calculating position.
   */
  public _onClick = (
    x: number,
    y: number,
    ctx: CanvasRenderingContext2D,
    parents: Container[],
  ) => {
    if (this.isMouseOver(x, y, ctx, parents)) {
      if (typeof this.onClick === "function") {
        this.onClickCb();
      }
    }
  };
}
