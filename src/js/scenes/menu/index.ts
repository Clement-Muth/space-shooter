import {
  Application,
  Container,
  type Scene,
  Sprite,
  Text,
  Texture,
  TilingSprite,
} from "../../../library";

export default class Menu implements Scene {
  public view: Container;
  public onPause: () => void;
  public onStart: () => void;

  private _app: Application;
  private _title: Text;
  private _background: Sprite;

  constructor({
    onStart,
    onPause,
  }: { onStart: () => void; onPause: () => void }) {
    this._app = Application.getInstance();
    this.view = new Container();
    this.onPause = onPause;
    this.onStart = onStart;

    this._title = new Text({
      text: "Play Game",
      style: { fontFamily: "Orbitron" },
    });

    this._title.x = this._app.canvas.width / 2 - this._title.width;
    this._title.y = this._app.canvas.height / 2 - 20;
    this._title.interactive = true;

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
    this.view.addChild(this._background, this._title);
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
