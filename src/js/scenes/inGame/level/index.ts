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
import Upgrade from "../../../characters/upgrade";
import type Player from "../../../players";

export default class Level implements Scene {
  public view: Container;
  public size: { width: number; height: number };

  private _app: Application;
  private _flock: Flock;
  private _title: Text;
  private _nextLevel: Text;
  private _background: Sprite;
  private _ships: Ship[];
  private _ticker: Ticker;
  private _players: Player[];
  private _level: number;
  private _asteroids: Asteroid[];
  private _upgrades: Upgrade[];
  private _onChangeLevel: () => void;

  constructor({ level, size, players, onChangeLevel }) {
    this._app = Application.getInstance();
    this.view = new Container();
    this._onChangeLevel = onChangeLevel;
    this.size = size;
    this._level = level;
    this._players = players;
    this._ships = this._players.map((player) => player.ship);
    this._asteroids = [];
    this._upgrades = [];

    this._title = new Text({
      text: `Level ${this._level}`,
      style: { fontFamily: "Orbitron" },
    });
    this._title.x = this._app.canvas.width / 2 - this._title.width / 2;
    this._title.y = this._app.canvas.height / 2 - 20;

    this._nextLevel = new Text({
      text: "You can go to the next Level!",
      style: { fontFamily: "Orbitron" },
    });
    this._nextLevel.x = this._app.canvas.width / 2 - this._nextLevel.width / 2;
    this._nextLevel.y = this._app.canvas.height / 2 - 20;

    this._ticker = new Ticker();

    this._flock = new Flock(
      this._app.canvas.width - 40,
      this._app.canvas.height - 40,
      random(15, 100),
      {
        cohesionRadius: 100,
        alignmentRadius: 50,
        attractionRadius: 50,
        separationRadius: 30,
      },
    );

    const bgLevel = random(1, 5);

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

    this.generateUpgrade();
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

      if (this._flock.boids.length === 0) {
        this.view.addChild(this._nextLevel);

        setTimeout(() => {
          this.view.removeChild(this._nextLevel);
        }, 2000);
      }

      for (const ship of this._ships) ship.update(6);

      for (const collision of boidShipCollisions) {
        const boid = collision.boid;
        const ship = collision.ship;

        this._flock.removeBoid(boid);
        for (const player of this._players)
          if (player.ship === ship) player.updateScore(100);
      }
      this._isOutsideBondary();
    });

    this._ticker.add(() => {
      this.updateAsteroids();
      this.updateUpgrade();
    });

    return this.view;
  };

  private _isOutsideBondary = () => {
    if (this._flock.boids.length !== 0) {
      for (const ship of this._ships) {
        if (ship.sprite.x < 0) ship.sprite.x = 0;
        if (ship.sprite.x + ship.sprite.width > this._app.canvas.width)
          ship.sprite.x = this._app.canvas.width - ship.sprite.width;
        if (ship.sprite.y < 0) ship.sprite.y = 0;
        if (ship.sprite.y + ship.sprite.height > this._app.canvas.height)
          ship.sprite.y = this._app.canvas.height - ship.sprite.height;
      }
    } else {
      for (const ship of this._players.map((player) => player.ship)) {
        if (
          ship.sprite.x < 0 ||
          ship.sprite.x > this._app.canvas.width ||
          ship.sprite.y < 0 ||
          ship.sprite.y > this._app.canvas.height
        ) {
          this.stop();
          this._onChangeLevel();
        }
      }
    }
  };

  public stop = () => {
    this._ticker.destroy();
    this._flock.boids = [];
    this._asteroids = [];
    this._upgrades = [];
    this._players.map((player) => player.ship.detroy());
  };

  private updateAsteroids = () => {
    for (const asteroid of this._asteroids) {
      asteroid.render(this._app.ctx, []);
      asteroid.update();
      const ship = this.checkCollisionWithShip(asteroid);
      const missile = this.checkCollisionWithAsteroid(asteroid);

      if (missile)
        this._asteroids[this._asteroids.indexOf(asteroid)].update(true);

      if (ship)
        for (const player of this._players)
          if (player.ship === ship) player.onLoose();
    }
  };

  private updateUpgrade = () => {
    for (const upgrade of this._upgrades) {
      upgrade.render(this._app.ctx, []);
      upgrade.update();
      const ship = this.checkCollisionWithShip(upgrade);

      if (ship) {
        ship.upgrade();
        this._upgrades = [];
      }
    }
  };

  private checkCollisionWithShip = (
    object: Asteroid | Upgrade,
  ): Ship | false => {
    for (const ship of this._ships)
      if (object.checkCollisionWithShip(ship)) return ship;

    return false;
  };

  private checkCollisionWithAsteroid = (asteroid: Asteroid): any | false => {
    for (const ship of this._ships) {
      for (const missile of ship.missiles)
        if (missile.checkCollisionWithasteroid(asteroid)) return missile;
    }
    return false;
  };

  public generateAsteroids = () => {
    const numberOfAsteroids = random(
      this._level,
      this._level < 15 ? this._level * 2 : random(this._level, 30),
    );

    for (let i = 0; i < numberOfAsteroids; i++) {
      const textureNumber = random(1, 10);
      const size = random(50, this._level < 5 ? 100 : 150, true);
      const speed = random(this._level < 5 ? 0.25 : 1, 2, true);
      const asteroid = new Asteroid({
        texture: `asteroid-${textureNumber}`,
        width: size,
        height: size,
        speed,
      });
      this._asteroids.push(asteroid);
      this.view.addChild(asteroid.asteroid);
    }
  };

  public generateUpgrade = () => {
    const speed = random(this._level < 5 ? 0.25 : 1, 2, true);
    const upgrade = new Upgrade({
      texture: "upgrade",
      width: 30,
      height: 30,
      speed,
    });
    this._upgrades.push(upgrade);
    this.view.addChild(upgrade.upgrade);
  };
}
