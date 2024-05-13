import Player from "..";
import Ship from "../../characters/Ship";

const Player2 = () =>
  new Player(
    new Ship({
      controle: {
        north: "ArrowUp",
        east: "ArrowRight",
        south: "ArrowDown",
        west: "ArrowLeft",
      },
      size: { width: 90, height: 90 },
      color: "blue",
    }),
  );

export default Player2;
