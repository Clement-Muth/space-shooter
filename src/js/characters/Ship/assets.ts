import { Texture, TilingSprite } from "../../../library";

const getShipAssets = ({ width = 176, height = 135 }) => {
  const idle = [...Array(22)].map((_, i) => ({
    image: new TilingSprite({
      texture: Texture.from(`ship-${i}`),
      width: width,
      height: height,
    }),
    duration: 100,
  }));
  const layDown = [...Array(22)].map((_, i) => ({
    image: new TilingSprite({
      texture: Texture.from(`ship-${i}`),
      width: width,
      height: height,
    }),
    duration: 100,
  }));
  const moveEast = [...Array(22)].map((_, i) => ({
    image: new TilingSprite({
      texture: Texture.from(`ship-${i}`),
      width: width,
      height: height,
    }),
    duration: 100,
  }));
  const moveNorth = [...Array(22)].map((_, i) => ({
    image: new TilingSprite({
      texture: Texture.from(`ship-${i}`),
      width: width,
      height: height,
    }),
    duration: 100,
  }));
  const moveSouth = [...Array(22)].map((_, i) => ({
    image: new TilingSprite({
      texture: Texture.from(`ship-${i}`),
      width: width,
      height: height,
    }),
    duration: 100,
  }));
  const moveWest = [...Array(22)].map((_, i) => ({
    image: new TilingSprite({
      texture: Texture.from(`ship-${i}`),
      width: width,
      height: height,
    }),
    duration: 100,
  }));

  return { idle, moveSouth, moveNorth, moveEast, moveWest, layDown };
};

export const shipAssets = [
  ...[...Array(22)].map((_, i) => ({
    alias: `ship-${i}`,
    src: `/public/static/assets/sprites/ships/ship1/ship-${i + 1}.png`,
  })),
];

export default getShipAssets;
