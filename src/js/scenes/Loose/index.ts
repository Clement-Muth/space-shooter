import {
  Application,
  Container,
  type Scene,
  Sprite,
  Text,
  Texture,
  TilingSprite,
} from "../../../library";
import type Player from "../../players";

export default class Loose implements Scene {
  public view: Container;
  public onPause: () => void;
  public onStart: () => void;

  private _app: Application;
  private _title: Text;
  private _score: Text;
  private _level: Text;
  private _background: Sprite;

  constructor({
    onStart,
    onPause,
    player,
    level,
  }: {
    onStart: () => void;
    onPause: () => void;
    player: Player;
    level: number;
  }) {
    this._app = Application.getInstance();
    this.view = new Container();
    this.onPause = onPause;
    this.onStart = onStart;

    this._title = new Text({
      text: `Player ${player.id} loose.`,
      style: { fontFamily: "Orbitron" },
    });

    this._score = new Text({
      text: `Your score is ${player.score.text}`,
      style: { fontFamily: "Orbitron" },
    });

    this._level = new Text({
      text: `You've reached the level ${level}`,
      style: { fontFamily: "Orbitron" },
    });

    this._title.x = this._app.canvas.width / 2 - this._title.width / 2;
    this._title.y = this._app.canvas.height / 2 - 20;

    this._score.x = this._app.canvas.width / 2 - this._score.width / 2;
    this._score.y = this._app.canvas.height / 2 + 15;

    this._level.x = this._app.canvas.width / 2 - this._level.width / 2;
    this._level.y = this._app.canvas.height / 2 + 50;

    this._background = new Sprite(
      "idle",
      {
        idle: [...Array(200)].map((_, i) => ({
          image: new TilingSprite({
            texture: Texture.from(`bg-level3-${i}`),
            width: this._app.canvas.width,
            height: this._app.canvas.height,
          }),
          duration: 30,
        })),
      },
      { height: this._app.canvas.height, width: this._app.canvas.width },
    );
  }

  public start = () => {
    this.view.addChild(this._background, this._title, this._score, this._level);
    this._title.onClick(this.onStart);
    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") this.onPause();
    });

    return this.view;
  };

  public stop = () => {
    this._app.stage.removeChild(this.view);
  };
}
