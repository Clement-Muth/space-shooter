import { Collision } from "../../../library";
import type View from "../../../library/components/containers/view";
import type Ship from "../Ship";
import Boid from "./boid";

interface FlockOptions {
  cohesionRadius: number;
  alignmentRadius: number;
  attractionRadius: number;
  separationRadius: number;
}

/**
 * Represents a flock of boids.
 */
export default class Flock implements View {
  /** The array of boids in the flock. */
  public boids: Boid[];

  /**
   * Creates a new flock.
   * @param width The width of the area.
   * @param height The height of the area.
   * @param options The options for the flock.
   */
  constructor(
    public readonly width: number,
    public readonly height: number,
    public readonly totalBoids: number,
    private options: FlockOptions = {
      cohesionRadius: 100,
      alignmentRadius: 50,
      attractionRadius: 50,
      separationRadius: 30,
    },
  ) {
    this.boids = [];
    this._initializeBoids();
  }

  private _initializeBoids(): void {
    for (let i = 0; i < this.totalBoids; i++) {
      const x = Math.random() * this.width;
      const y = Math.random() * this.height;
      const dx = Math.random() - 0.5;
      const dy = Math.random() - 0.5;
      const speed = 2;
      this.boids.push(new Boid(x, y, dx, dy, speed));
    }
  }

  /**
   * Removes a specific boid from the flock.
   * @param boidToRemove The boid to remove from the flock.
   */
  public removeBoid(boidToRemove: Boid): void {
    const index = this.boids.indexOf(boidToRemove);

    if (index !== -1) this.boids.splice(index, 1);
  }

  /**
   * Checks for collisions between boids and ships.
   * @param ships The list of ships to check for collisions.
   * @returns An array of collisions detected between boids and ships.
   */
  public checkCollisionsWithShips(ships: Ship[]): { boid: Boid; ship: Ship }[] {
    const collisions: { boid: Boid; ship: Ship }[] = [];

    for (const boid of this.boids)
      for (const ship of ships)
        if (Collision.isColliding(boid.sprite, ship.sprite))
          collisions.push({ boid, ship });

    return collisions;
  }

  /**
   * The _cohesion function calculates the average position of nearby boids within
   * a specified cohesion radius to help maintain group cohesion.
   * @param {Boid} boid - The `boid` parameter represents an individual boid object
   * for which we are calculating cohesion with other boids in the simulation. The
   * `cohesionRadius` is a property from the `options` object that specifies the
   * maximum distance within which boids will be considered for cohesion.
   * @returns Returns an object with the properties `x`
   * and `y`, which represent the average position of nearby boids within the
   * cohesion radius of the input `boid`. If there are no nearby boids within the
   * cohesion radius, it returns the position of the input `boid` itself.
   */
  private _cohesion(boid: Boid): { x: number; y: number } {
    const { cohesionRadius } = this.options;

    let sumX = 0;
    let sumY = 0;
    let count = 0;

    for (const other of this.boids) {
      const distance = Math.sqrt(
        (boid.x - other.x) ** 2 + (boid.y - other.y) ** 2,
      );

      if (distance > 0 && distance < cohesionRadius) {
        sumX += other.x;
        sumY += other.y;
        count++;
      }
    }

    if (count > 0) {
      return { x: sumX / count, y: sumY / count };
    }

    return { x: boid.x, y: boid.y };
  }

  /**
   * The _alignment function calculates the average alignment vector of nearby boids
   * based on a specified alignment radius.
   * @param {Boid} boid - The `boid` parameter represents an individual boid in a
   * simulation. It likely contains properties such as `x` and `y` coordinates, as
   * well as `dx` and `dy` which represent the velocity components in the x and y
   * directions respectively. The function `_alignment` calculates the
   * @returns Returns an object with properties x and y
   * representing the average alignment direction of nearby boids within the
   * alignment radius specified in the options.
   */
  private _alignment(boid: Boid): { x: number; y: number } {
    const { alignmentRadius } = this.options;

    let avgDx = 0;
    let avgDy = 0;
    let count = 0;

    for (const other of this.boids) {
      const distance = Math.sqrt(
        (boid.x - other.x) ** 2 + (boid.y - other.y) ** 2,
      );

      if (distance > 0 && distance < alignmentRadius) {
        avgDx += other.dx;
        avgDy += other.dy;
        count++;
      }
    }

    if (count > 0) {
      avgDx /= count;
      avgDy /= count;
    }

    return { x: avgDx, y: avgDy };
  }

  /**
   * The _attraction function calculates the attraction force between a boid and other boids
   * within a specified radius.
   * @param {Boid} boid - The `boid` parameter represents an individual boid object
   * in a simulation. It likely has properties like `x` and `y` coordinates that
   * define its position in a two-dimensional space. The function `_attraction`
   * calculates the attraction force acting on the given `boid` based on its
   * @returns Returns an object with two properties: x and
   * y, which represent the calculated attraction forces in the x and y directions
   * for a given boid.
   */
  private _attraction(boid: Boid): { x: number; y: number } {
    const { attractionRadius } = this.options;

    let attractionForceX = 0;
    let attractionForceY = 0;

    for (const other of this.boids) {
      if (other !== boid) {
        const distance = Math.sqrt(
          (boid.x - other.x) ** 2 + (boid.y - other.y) ** 2,
        );

        if (distance < attractionRadius) {
          const groupAttraction = Math.min(this.boids.length / 1000, 1);
          attractionForceX += (other.x - boid.x) * 0.005 * groupAttraction;
          attractionForceY += (other.y - boid.y) * 0.005 * groupAttraction;
        }
      }
    }

    return { x: attractionForceX, y: attractionForceY };
  }

  /**
   * The _separation function calculates the separation force between a boid and other nearby
   * boids based on a separation radius.
   * @param {Boid} boid - The `boid` parameter represents an individual boid object
   * for which we are calculating the separation force from other boids in the
   * simulation.
   * @returns Returns an object with `x` and `y`
   * properties representing the separation forces calculated for a given boid.
   */
  private _separation(boid: Boid): { x: number; y: number } {
    const { separationRadius } = this.options;

    let separationForceX = 0;
    let separationForceY = 0;

    for (const other of this.boids) {
      if (other !== boid) {
        const distance = Math.sqrt(
          (boid.x - other.x) ** 2 + (boid.y - other.y) ** 2,
        );

        if (distance < separationRadius) {
          const forceFactor = separationRadius / (distance + 0.1);
          separationForceX += (boid.x - other.x) * forceFactor;
          separationForceY += (boid.y - other.y) * forceFactor;
        }
      }
    }

    return { x: separationForceX, y: separationForceY };
  }

  /**
   * The _update function calculates forces for each boid based on cohesion,
   * alignment, attraction, and separation, updating their positions and velocities
   * accordingly.
   */
  private _update(): void {
    const maxSpeed = 2;

    for (const boid of this.boids) {
      const cohesion = this._cohesion(boid);
      const alignment = this._alignment(boid);
      const attraction = this._attraction(boid);
      const separation = this._separation(boid);

      boid.dx +=
        (cohesion.x - boid.x) * 0.01 +
        separation.x * 0.05 +
        alignment.x * 0.05 +
        attraction.x;
      boid.dy +=
        (cohesion.y - boid.y) * 0.01 +
        separation.y * 0.05 +
        alignment.y * 0.05 +
        attraction.y;

      const speed = Math.sqrt(boid.dx ** 2 + boid.dy ** 2);
      if (speed > maxSpeed) {
        boid.dx = (boid.dx / speed) * maxSpeed;
        boid.dy = (boid.dy / speed) * maxSpeed;
      }

      const inertia = 0.05;
      boid.dx = boid.dx * (1 - inertia) + boid.lastDx * inertia;
      boid.dy = boid.dy * (1 - inertia) + boid.lastDy * inertia;
      boid.lastDx = boid.dx;
      boid.lastDy = boid.dy;

      boid.update(this.width, this.height);
    }
  }

  public render(ctx: CanvasRenderingContext2D): void {
    for (const boid of this.boids) {
      boid.render(ctx);
    }
    this._update();
  }
}
