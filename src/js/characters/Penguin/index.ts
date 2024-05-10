import { Container, Sprite } from "../../../library";
import Controller from "../../../library/components/functions/controller";
import getPenguinAssets from "./assets";

export default class Penguin {
  public view: Container;
  public sprite: Sprite;

  constructor() {
    this.view = new Container();

    const penguinAssets = getPenguinAssets();

    this.sprite = new Sprite("idle", penguinAssets);

    new Controller(this.sprite, 1);

    this.view.addChild(this.sprite);
  }
}
