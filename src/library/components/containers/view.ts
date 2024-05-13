import type Container from "./container";

/**
 * View Class
 *
 * The `View` class represents a display object that can be rendered on a canvas.
 */
export default class View {
  /**
   * The rendering function of the view.
   * @param ctx The rendering context of the canvas.
   * @param parents The parent containers for calculating position.
   */
  public render: (ctx: CanvasRenderingContext2D, parents: Container[]) => void;

  /**
   * Indicates whether the view is interactive.
   */
  public interactive?: boolean;

  /**
   * Function to check if the mouse is over the view.
   * @param mouseX The x-coordinate of the mouse position.
   * @param mouseY The y-coordinate of the mouse position.
   * @param ctx The rendering context of the canvas.
   * @param parents The parent containers for calculating position.
   * @returns True if the mouse is over the view, otherwise false.
   */
  public isMouseOver?: (
    mouseX: number,
    mouseY: number,
    ctx: CanvasRenderingContext2D,
    parents: Container[],
  ) => boolean;
}
