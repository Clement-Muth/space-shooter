import { Container, Sprite, Texture, TilingSprite } from "../../library";

export default class Penguin {
  public view: Container;

  constructor() {
    this.view = new Container();

    const penguin = new Sprite(
      [...Array(12)].map((_, i) => ({
        image: new TilingSprite({
          texture: Texture.from(`penguin-${i}`),
          width: 176,
          height: 135,
        }),
        duration: 60,
      })),
    );

    penguin.x = 100;
    penguin.y = 100;

    this.view.addChild(penguin);
  }
}
