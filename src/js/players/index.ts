import { Application, type Container, type Scene, Text } from "../../library";
import type Ship from "../characters/Ship";

export default class Player implements Scene {
  public view: Container;
  public ship: Ship;
  public score: Text;
  public status: "win" | "loose" | undefined;
  public id: 1 | 2;

  private _app: Application = Application.getInstance();

  constructor(
    ship: Ship,
    private readonly _isFirstPlayer?: boolean,
  ) {
    this.ship = ship;
    this.status = undefined;
    this.id = _isFirstPlayer ? 1 : 2;

    this.score = new Text({
      text: "00000",
      style: { fontFamily: "Orbitron" },
    });

    this.score.x = this._isFirstPlayer ? 50 : this._app.screen.width - 150;
    this.score.y = 50;
  }

  public initPlayer = () => {
    this.ship.sprite.x =
      this._app.canvas.width / 2 + (this._isFirstPlayer ? -200 : 100);
    this.ship.sprite.y = this._app.canvas.height - 100;
  };

  public updateScore = (newScore: number) => {
    this.score.text = String(Number(this.score.text) + newScore).padStart(
      5,
      "0",
    );
  };

  public start: () => Container;

  public stop = () => {
    this.ship.detroy();
  };

  public onLoose = () => {
    this.status = "loose";
  };
}
