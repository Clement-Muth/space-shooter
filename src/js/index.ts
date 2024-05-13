import { Application, Assets } from "../library";
import Loose from "./scenes/Loose";
import InGame from "./scenes/inGame";
import Menu from "./scenes/menu";

(async () => {
  const application = Application.getInstance();

  await application.init({ background: "#0d1117", resizeTo: window });

  await Assets.load([
    { alias: "bonus", src: "/public/static/assets/collectable/bonus.png" },
    ...[...Array(24)].map((_, i) => ({
      alias: `ship2-${i}`,
      src: `/public/static/assets/sprites/ships/ship2/ship-${i}.png`,
    })),
    ...[...Array(200)].map((_, i) => ({
      alias: `bg-level3-${i}`,
      src: `/public/static/assets/bg/bg3/ezgif-frame-${(i + 1)
        .toString()
        .padStart(3, "0")}.jpg`,
    })),
    ...[...Array(200)].map((_, i) => ({
      alias: `bg-level4-${i}`,
      src: `/public/static/assets/bg/bg4/ezgif-frame-${(i + 1)
        .toString()
        .padStart(3, "0")}.jpg`,
    })),
    ...[...Array(200)].map((_, i) => ({
      alias: `bg-level5-${i}`,
      src: `/public/static/assets/bg/bg5/ezgif-frame-${(i + 1)
        .toString()
        .padStart(3, "0")}.jpg`,
    })),
    ...[...Array(200)].map((_, i) => ({
      alias: `bg-level1-${i}`,
      src: `/public/static/assets/bg/bg1/ezgif-frame-${(i + 1)
        .toString()
        .padStart(3, "0")}.jpg`,
    })),
    ...[...Array(125)].map((_, i) => ({
      alias: `bg-level2-${i}`,
      src: `/public/static/assets/bg/bg2/ezgif-frame-${(i + 1)
        .toString()
        .padStart(3, "0")}.jpg`,
    })),
    {
      alias: "asteroid-1",
      src: "/public/static/assets/asteroids/asteroid-1.png",
    },
    {
      alias: "asteroid-2",
      src: "/public/static/assets/asteroids/asteroid-2.png",
    },
    {
      alias: "asteroid-3",
      src: "/public/static/assets/asteroids/asteroid-3.png",
    },
    {
      alias: "asteroid-4",
      src: "/public/static/assets/asteroids/asteroid-4.png",
    },
    {
      alias: "asteroid-5",
      src: "/public/static/assets/asteroids/asteroid-5.png",
    },
    {
      alias: "asteroid-6",
      src: "/public/static/assets/asteroids/asteroid-6.png",
    },
    {
      alias: "asteroid-7",
      src: "/public/static/assets/asteroids/asteroid-7.png",
    },
    {
      alias: "asteroid-8",
      src: "/public/static/assets/asteroids/asteroid-8.png",
    },
    {
      alias: "asteroid-9",
      src: "/public/static/assets/asteroids/asteroid-9.png",
    },
    {
      alias: "asteroid-10",
      src: "/public/static/assets/asteroids/asteroid-10.png",
    },
    {
      alias: "upgrade",
      src: "/public/static/assets/upgrade.png",
    },
    { alias: "missile-red", src: "/public/static/assets/missile-red.png" },
    { alias: "missile-blue", src: "/public/static/assets/missile-blue.png" },
  ]);

  const game = new InGame({
    size: application.screen,
    onLoose: (player, level) => {
      game.stop();
      application.stage.removeChild(game.view);
      console.log("stage", application.stage);
      application.stage.addChild(
        new Loose({
          onPause: () => {},
          onStart: () => {},
          player: player,
          level,
        }).start(),
      );
    },
  });
  const menu = new Menu({
    onStart: () => {
      menu.stop();
      application.stage.addChild(game.start());
    },
    onPause: () => {
      application.stage.removeChild(game.view).addChild(menu.view);
    },
  });

  menu.start();

  application.stage.addChild(menu.view);
})();
