import Container from "./components/containers/container";
import type View from "./components/containers/view";
import Ticker from "./components/functions/ticker";

/**
 * Application Class
 *
 * The `Application` class provides a framework for creating interactive canvas applications.
 * It initializes a canvas, manages its rendering context, and handles mouse events.
 */
export default class Application {
  /**
   * The HTML canvas element for the application.
   */
  public readonly canvas: HTMLCanvasElement;
  /**
   * The rendering context of the canvas.
   */
  public ctx: CanvasRenderingContext2D;
  /**
   * The root container of the display objects.
   */
  public stage: Container;
  /**
   * The dimensions of the application screen.
   */
  public screen: { width: number; height: number };
  /**
   * The ticker for updating the application.
   */
  public ticker: Ticker;

  private mouseX: number;
  private mouseY: number;

  constructor() {
    const canvas = document.createElement("canvas");

    this.canvas = canvas;
    this.ctx = canvas.getContext("2d")!;
    this.stage = new Container(this.ctx, { isStage: true });
    this.screen = { width: window.innerWidth, height: window.innerHeight };
    this.mouseX = 0;
    this.mouseY = 0;
    this.ticker = new Ticker();

    canvas.addEventListener("mousemove", (e) =>
      this.onMouseMove(e, this.stage.children, []),
    );
    canvas.addEventListener("click", (e) =>
      this.onClick(e, this.stage.children, []),
    );
    canvas.id = "canvas";
    document.body.appendChild(canvas);

    this.loop();
  }

  /**
   * Initializes the application.
   * @param background The background color of the canvas.
   * @param resizeTo The element to resize the canvas to match its dimensions.
   */
  public init = async ({
    background,
    resizeTo,
  }: { background: string; resizeTo: Window }) => {
    window.addEventListener("resize", this.onResize);
    this.ctx.fillStyle = background;
    this.canvas.width = resizeTo.innerWidth;
    this.canvas.height = resizeTo.innerHeight;
  };

  private onResize = () => {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
  };

  private loop = () => {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    for (const child of this.stage.children)
      child.render(this.ctx, [this.stage]);

    requestAnimationFrame(this.loop.bind(this));
  };

  private onMouseMove = (
    event: MouseEvent,
    children: View[],
    parents = [] as Container[],
  ): void => {
    this.mouseX = event.clientX - this.canvas.getBoundingClientRect().left;
    this.mouseY = event.clientY - this.canvas.getBoundingClientRect().top;

    for (const child of children) {
      if (child instanceof Container) {
        this.onMouseMove(event, child.children, parents.concat(child));
        return;
      }
      if (
        child.interactive &&
        child.isMouseOver(this.mouseX, this.mouseY, this.ctx, parents)
      ) {
        this.canvas.style.cursor = "pointer";
        return;
      }
    }
    this.canvas.style.cursor = "default";
  };

  private onClick = (
    event: MouseEvent,
    children: any[],
    parents = [] as Container[],
  ): void => {
    for (const child of children) {
      if (child instanceof Container) {
        this.onClick(event, child.children, parents.concat(child));
        return;
      }
      if (child.interactive === true && typeof child._onClick === "function") {
        child._onClick(this.mouseX, this.mouseY, this.ctx, parents);
      }
    }
  };
}
