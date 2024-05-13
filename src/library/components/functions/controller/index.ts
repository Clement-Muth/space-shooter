import type Sprite from "../../drawables/sprite";
import Ticker from "../ticker";

export type Controle = {
  north: string;
  south: string;
  east: string;
  west: string;
};

const getKeyByValue = (obj: object, value: string) =>
  Object.keys(obj).find((key) => (obj[key] === value ? key : undefined));

export default class Controller {
  private _keyPresses: Record<keyof Controle, boolean> = {
    east: false,
    north: false,
    south: false,
    west: false,
  };
  private _ticker: Ticker;
  private _sprite: Sprite;
  private _speed: number;

  constructor(
    sprite: Sprite,
    speed: number,
    private readonly controle: Controle,
  ) {
    this._ticker = new Ticker();
    this._sprite = sprite;
    this._speed = speed;

    this._ticker.add(() => {
      if (this._keyPresses.north) this._sprite.y -= this._speed;
      else if (this._keyPresses.south) this._sprite.y += this._speed;

      if (this._keyPresses.west) this._sprite.x -= this._speed;
      else if (this._keyPresses.east) this._sprite.x += this._speed;
    });

    this._onStop((event): void => {
      this._keyPresses[getKeyByValue(this.controle, event.key)!] = false;
      this._updateSpriteFramesOnKeyChange(
        Object.keys(this._keyPresses).find((key) =>
          this._keyPresses[key] === true ? key : undefined,
        ),
      );
    });
    this._onMove((event): void => {
      if (event.repeat) return;
      this._keyPresses[getKeyByValue(this.controle, event.key)!] = true;
      if (!getKeyByValue(this.controle, event.key)) return;
      this._updateSpriteFramesOnKeyChange(
        getKeyByValue(this.controle, event.key),
      );
    });
  }

  private _updateSpriteFramesOnKeyChange = (direction: string | undefined) => {
    switch (direction) {
      case "south":
        this._sprite.udpateFrames(this._sprite.animationFrames.moveSouth!);
        break;
      case "north":
        this._sprite.udpateFrames(this._sprite.animationFrames.moveNorth!);
        break;
      case "west":
        this._sprite.udpateFrames(this._sprite.animationFrames.moveWest!);
        break;
      case "east":
        this._sprite.udpateFrames(this._sprite.animationFrames.moveEast!);
        break;
      default:
        this._sprite.udpateFrames(this._sprite.animationFrames.idle);
    }
  };

  private _onStop = (cb: (event: KeyboardEvent) => void) =>
    window.addEventListener("keyup", cb);

  private _onMove = (cb: (event: KeyboardEvent) => void) => {
    window.addEventListener("keydown", cb);
  };
}
