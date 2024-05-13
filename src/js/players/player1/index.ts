import Player from "..";
import Ship from "../../characters/Ship";

const Player1 = () =>
  new Player(
    new Ship({
      controle: { north: "z", east: "d", south: "s", west: "q" },
      size: { width: 70, height: 70 },
    }),
    true,
  );

export default Player1;
