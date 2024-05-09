import { Application, Assets, Text } from "../library";
import Penguin from "./characters/Penguin";

(async () => {
  const application = new Application();

  await application.init({ background: "white", resizeTo: window });

  const title = new Text({ text: "Hello World!", style: { fill: "black" } });

  application.stage.y = 20;

  await Assets.load(
    [...Array(12)].map((_, i) => ({
      alias: `penguin-${i}`,
      src: `/public/static/assets/sprites/penguin/idle/${i}.png`,
    })),
  );

  application.stage.addChild(title, new Penguin().view);
})();
