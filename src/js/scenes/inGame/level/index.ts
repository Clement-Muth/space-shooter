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

  constructor({ level, size, players }) {
    this._app = Application.getInstance();
    this.view = new Container();
    this.size = size;
    this._level = level;
    this._players = players;
    this._ships = this._players.map((player) => player.ship);

    this._title = new Text({
      text: `Level ${this._level}`,
      style: { fontFamily: "Orbitron" },
    });
    this._title.x = this._app.canvas.width / 2 - 50;
    this._title.y = this._app.canvas.height / 2 - 20;

    this._ticker = new Ticker();

    this._flock = new Flock(this.size.width, this.size.height, random(100), {
      cohesionRadius: random(200),
      alignmentRadius: random(200),
      attractionRadius: random(200),
      separationRadius: random(200),
    });

    const bgLevel = random(3);

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

    return this.view;
  };

  public stop = (view: Container) => {
    this._flock.boids = [];
    view?.removeChild(this.view);
  };
}
