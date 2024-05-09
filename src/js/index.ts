import { Application, Assets, Text } from "../library";
import Penguin from "./characters/Penguin";
import { penguinAssets } from "./characters/Penguin/assets";

(async () => {
  const application = new Application();

  await application.init({ background: "#0d1117", resizeTo: window });

  const title = new Text({ text: "Hello Penguin!", style: { fill: "white" } });

  title.x = application.screen.width / 2 - 85;
  title.y = application.screen.height / 2 - 20;

  application.stage.y = 20;

  await Assets.load(penguinAssets);

  const penguin = new Penguin();

  application.stage.addChild(title, penguin.view);
})();
