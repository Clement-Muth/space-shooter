import { Container, Sprite } from "../../../library";
import Controller from "../../../library/components/functions/controller";
import getShipAssets from "./assets";

export default class Ship {
  public view: Container;
  public sprite: Sprite;
  public size: { width: number; height: number };

  constructor({ controle, size }) {
    this.view = new Container();
    this.size = size;

    const shipAssets = getShipAssets(this.size);

    this.sprite = new Sprite("idle", shipAssets, {
      height: this.size.height,
      width: this.size.width,
    });

    new Controller(this.sprite, 3, controle);

    this.view.addChild(this.sprite);
  }
}
