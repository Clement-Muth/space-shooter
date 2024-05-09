import { Container, Sprite } from "../../../library";
import Ticker from "../../../library/components/functions/ticker";
import getPenguinAssets from "./assets";

export default class Penguin {
  public view: Container;
  public sprite: Sprite;
  public keyPresses: {
    z?: boolean;
    Z?: boolean;
    s?: boolean;
    S?: boolean;
    q?: boolean;
    Q?: boolean;
    d?: boolean;
    D?: boolean;
  } = {};

  private _ticker: Ticker;

  constructor() {
    this.view = new Container();

    const assets = getPenguinAssets();

    this.sprite = new Sprite(assets.idle);

    const down = (event: KeyboardEvent) => {
      if (!event.repeat) {
        switch (event.key) {
          case "s":
            this.sprite.udpateFrames(assets.south);
            break;
          case "z":
            this.sprite.udpateFrames(assets.north);
            break;
          case "q":
            this.sprite.udpateFrames(assets.west);
            break;
          case "d":
            this.sprite.udpateFrames(assets.east);
            break;
        }
      }
      this.keyPresses[event.key] = true;
    };

    window.addEventListener("keydown", down);
    window.addEventListener(
      "keyup",
      (event: KeyboardEvent) => {
        this.keyPresses[event.key] = false;
        if (!event.repeat) this.sprite.udpateFrames(assets.idle);
      },
      false,
    );

    this._ticker = new Ticker();

    this._ticker.add(() => {
      if (this.keyPresses.z || this.keyPresses.Z) this.sprite.y -= 1;
      else if (this.keyPresses.s || this.keyPresses.S) {
        this.sprite.y += 1;
      }
      if (this.keyPresses.q || this.keyPresses.Q) this.sprite.x -= 1;
      else if (this.keyPresses.d || this.keyPresses.D) this.sprite.x += 1;
    });

    this.view.addChild(this.sprite);
  }
}
