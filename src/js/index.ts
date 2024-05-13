import { Application, Assets } from "../library";
import { shipAssets } from "./characters/Ship/assets";
import InGame from "./scenes/inGame";
import Menu from "./scenes/menu";

(async () => {
  const application = Application.getInstance();

  await application.init({ background: "#0d1117", resizeTo: window });

  await Assets.load([
    ...shipAssets,
    { alias: "bonus", src: "/public/static/assets/collectable/bonus.png" },
    ...[...Array(200)].map((_, i) => ({
      alias: `bg-level3-${i}`,
      src: `/public/static/assets/bg/bg3/ezgif-frame-${(i + 1)
        .toString()
        .padStart(3, "0")}.jpg`,
    })),
    ...[...Array(200)].map((_, i) => ({
      alias: `bg-level1-${i}`,
      src: `/public/static/assets/bg/bg4/ezgif-frame-${(i + 1)
        .toString()
        .padStart(3, "0")}.jpg`,
    })),
    ...[...Array(125)].map((_, i) => ({
      alias: `bg-level2-${i}`,
      src: `/public/static/assets/bg/bg2/ezgif-frame-${(i + 1)
        .toString()
        .padStart(3, "0")}.jpg`,
    })),
    { alias: "asteroid", src: "/public/static/assets/asteroid.png" },
  ]);

  const level1 = new InGame({ size: application.screen });
  const menu = new Menu({
    onStart: () => {
      menu.stop();
      application.stage.addChild(level1.start());
    },
    onPause: () => {
      application.stage.removeChild(level1.view).addChild(menu.view);
    },
  });

  menu.start();

  application.stage.addChild(menu.view);
})();
