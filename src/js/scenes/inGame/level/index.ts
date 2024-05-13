import {
  Application,
  Container,
  type Scene,
  Sprite,
  Text,
  Texture,
  TilingSprite,
} from "../../../../library";
import Ticker from "../../../../library/components/functions/ticker";
import random from "../../../../library/utils/random";
import Flock from "../../../characters/Boids/flock";
import type Ship from "../../../characters/Ship";
import Asteroid from "../../../characters/asteroid";
import type Player from "../../../players";

export default class Level implements Scene {
  public view: Container;
  public size: { width: number; height: number };

  private _app: Application;
  private _flock: Flock;
  private _title: Text;
  private _background: Sprite;
  private _ships: Ship[];
  private _ticker: Ticker;
  private _players: Player[];
  private _level: number;
  private _asteroids: Asteroid[];

  constructor({ level, size, players }) {
    this._app = Application.getInstance();
    this.view = new Container();
    this.size = size;
    this._level = level;
    this._players = players;
    this._ships = this._players.map((player) => player.ship);
    this._asteroids = [];

    this._title = new Text({
      text: `Level ${this._level}`,
      style: { fontFamily: "Orbitron" },
    });
    this._title.x = this._app.canvas.width / 2 - 50;
    this._title.y = this._app.canvas.height / 2 - 20;

    this._ticker = new Ticker();

    this._flock = new Flock(
      this.size.width,
      this.size.height,
      random(15, 100),
      {
        cohesionRadius: random(15, 200),
        alignmentRadius: random(15, 200),
        attractionRadius: random(15, 200),
        separationRadius: random(15, 200),
      },
    );

    const bgLevel = random(1, 3);

    this._background = new Sprite(
      "idle",
      {
        idle: [...Array(bgLevel === 2 ? 125 : 200)].map((_, i) => ({
          image: new TilingSprite({
            texture: Texture.from(`bg-level${bgLevel}-${i}`),
            width: this._app.canvas.width,
            height: this._app.canvas.height,
          }),
          duration: 30,
        })),
      },
      { height: this._app.canvas.height, width: this._app.canvas.width },
    );

    this.generateAsteroids();
  }

  public start = (): Container => {
    this.view.addChild(this._background, this._flock, this._title);

    this._players.map((player) => player.initPlayer());
    setTimeout(() => {
      this.view.removeChild(this._title);
    }, 2000);

    this._ticker.add(() => {
      const boidShipCollisions = this._flock.checkCollisionsWithShips(
        this._ships,
      );

      for (const collision of boidShipCollisions) {
        const boid = collision.boid;
        const ship = collision.ship;

        this._flock.removeBoid(boid);
        for (const player of this._players)
          if (player.ship === ship) player.updateScore(100);
      }
    });

    this._ticker.add(this.updateAsteroids);

    return this.view;
  };

  public stop = (view: Container) => {
    this._ticker.remove(this.updateAsteroids);
    this._flock.boids = [];
    view?.removeChild(this.view);
  };

  private updateAsteroids = () => {
    for (const asteroid of this._asteroids) {
      asteroid.render(this._app.ctx, []);
      asteroid.update();
      const ship = this.checkCollisionWithShip(asteroid);

      if (ship) {
        for (const player of this._players) {
          if (player.ship === ship) {
            // handle player loose
          }
        }
      }
    }
  };

  private checkCollisionWithShip = (asteroid: Asteroid): Ship | false => {
    for (const ship of this._ships) {
      if (asteroid.checkCollisionWithShip(ship)) {
        return ship;
      }
    }
    return false;
  };

  public generateAsteroids = () => {
    const numberOfAsteroids = random(
      this._level,
      this._level < 15 ? this._level * 2 : random(this._level, 30),
    );

    for (let i = 0; i < numberOfAsteroids; i++) {
      const size = random(50, this._level < 5 ? 100 : 150, true);
      const speed = random(this._level < 5 ? 0.25 : 1, 2, true);
      const asteroid = new Asteroid({
        texture: "asteroid",
        width: size,
        height: size,
        speed,
      });
      this._asteroids.push(asteroid);
      this.view.addChild(asteroid.asteroid);
    }
  };
}
