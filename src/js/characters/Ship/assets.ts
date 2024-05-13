import { Texture, TilingSprite } from "../../../library";

const getShipAssets = ({ width = 176, height = 135 }) => {
  const idle = [...Array(24)].map((_, i) => ({
    image: new TilingSprite({
      texture: Texture.from(`ship2-${i}`),
      width: width,
      height: height,
    }),
    duration: 100,
  }));
  const layDown = [...Array(24)].map((_, i) => ({
    image: new TilingSprite({
      texture: Texture.from(`ship2-${i}`),
      width: width,
      height: height,
    }),
    duration: 100,
  }));
  const moveEast = [...Array(24)].map((_, i) => ({
    image: new TilingSprite({
      texture: Texture.from(`ship2-${i}`),
      width: width,
      height: height,
    }),
    duration: 100,
  }));
  const moveNorth = [...Array(24)].map((_, i) => ({
    image: new TilingSprite({
      texture: Texture.from(`ship2-${i}`),
      width: width,
      height: height,
    }),
    duration: 100,
  }));
  const moveSouth = [...Array(24)].map((_, i) => ({
    image: new TilingSprite({
      texture: Texture.from(`ship2-${i}`),
      width: width,
      height: height,
    }),
    duration: 100,
  }));
  const moveWest = [...Array(24)].map((_, i) => ({
    image: new TilingSprite({
      texture: Texture.from(`ship2-${i}`),
      width: width,
      height: height,
    }),
    duration: 100,
  }));

  return { idle, moveSouth, moveNorth, moveEast, moveWest, layDown };
};

export const shipAssets = [
  ...[...Array(24)].map((_, i) => ({
    alias: `ship2-${i}`,
    src: `/public/static2/assets/sprites/ships/ship2/ship-${i + 1}.png`,
  })),
];

export default getShipAssets;
