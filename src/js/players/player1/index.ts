import Player from "..";
import Ship from "../../characters/Ship";

const Player1 = () =>
  new Player(
    new Ship({
      controle: { north: "z", east: "d", south: "s", west: "q" },
      size: { width: 90, height: 90 },
      color: "red",
    }),
    true,
  );

export default Player1;
