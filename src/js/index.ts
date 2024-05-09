import { Application, Text } from "../library";

(async () => {
  const application = new Application();

  await application.init({ background: "white", resizeTo: window });

  const title = new Text({ text: "Hello World!", style: { fill: "black" } });

  application.stage.addChild(title);
})();
