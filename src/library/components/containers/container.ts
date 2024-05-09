/**
 * Container Class
 *
 * The `Container` class represents a display container that holds other display objects.
 */
export default class Container {
  /**
   * The rendering context of the container.
   */
  public ctx: CanvasRenderingContext2D;

  /**
   * The x-coordinate of the container's position.
   */
  public x: number;

  /**
   * The y-coordinate of the container's position.
   */
  public y: number;

  /**
   * The children display objects of the container.
   */
  public children: any[];

  /**
   * Indicates whether the container is a stage.
   */
  public isStage: boolean;

  constructor(ctx?: any, options?: any) {
    this.ctx = ctx;
    this.x = 0;
    this.y = 0;
    this.children = [];
    this.isStage = options?.isStage;
  }

  /**
   * Adds one or more children to the container.
   * @param children The children to add to the container.
   * @returns The first child added to the container.
   */
  public addChild<U extends any[]>(...children: U): U[0] {
    for (const child of children) {
      this.children.push(child);

      if (this.isStage) this.render(this.ctx, []);
    }

    return this;
  }

  /**
   * Removes a child from the container.
   * @param childToRemove The child to remove from the container.
   * @returns The container instance.
   */
  public removeChild(childToRemove: any) {
    const index = this.children.indexOf(childToRemove);
    if (index !== -1) this.children.splice(index, 1);

    return this;
  }

  /**
   * Renders the container and its children.
   * @param ctx The rendering context to use.
   * @param parents The parent containers for calculating position.
   */
  public render(ctx: any, parents = [] as Container[]) {
    const context = this.ctx ?? ctx;
    const allParents = parents.concat(this);

    for (const child of this.children) child.render(context, allParents);
  }
}
