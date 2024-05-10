import type Sprite from "../../drawables/sprite";
import Ticker from "../ticker";

export default class Controller {
  private _keyPresses: {
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
  private _sprite: Sprite;
  private _speed: number;

  constructor(sprite: Sprite, speed: number) {
    this._ticker = new Ticker();
    this._sprite = sprite;
    this._speed = speed;

    this._ticker.add(() => {
      if (this._keyPresses.z || this._keyPresses.Z)
        this._sprite.y -= this._speed;
      else if (this._keyPresses.s || this._keyPresses.S)
        this._sprite.y += this._speed;

      if (this._keyPresses.q || this._keyPresses.Q)
        this._sprite.x -= this._speed;
      else if (this._keyPresses.d || this._keyPresses.D)
        this._sprite.x += this._speed;
    });

    this._onStop((event) => {
      if (!event.repeat) this._updateSpriteFramesOnKeyChange(event.key);
      this._keyPresses[event.key] = true;
    });
    this._onMove((event) => {
      this._keyPresses[event.key] = false;
      if (Object.values(this._keyPresses).some((v) => v))
        this._updateSpriteFramesOnKeyChange(
          Object.keys(this._keyPresses).filter((k) => this._keyPresses[k])[0],
        );
      else this._sprite.udpateFrames(this._sprite.animationFrames.idle);
    });
  }

  private _updateSpriteFramesOnKeyChange = (expr: unknown) => {
    switch (expr) {
      case "s":
        this._sprite.udpateFrames(this._sprite.animationFrames.moveSouth);
        break;
      case "z":
        this._sprite.udpateFrames(this._sprite.animationFrames.moveNorth);
        break;
      case "q":
        this._sprite.udpateFrames(this._sprite.animationFrames.moveWest);
        break;
      case "d":
        this._sprite.udpateFrames(this._sprite.animationFrames.moveEast);
        break;
      default:
        this._sprite.udpateFrames(this._sprite.animationFrames.idle);
    }
  };

  private _onStop = (cb: (event: KeyboardEvent) => void) =>
    window.addEventListener("keydown", cb);

  private _onMove = (cb: (event: KeyboardEvent) => void) => {
    window.addEventListener("keyup", cb, false);
  };
}
