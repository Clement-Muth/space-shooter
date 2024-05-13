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
      size: { width: 70, height: 70 },
    }),
  );

export default Player2;
