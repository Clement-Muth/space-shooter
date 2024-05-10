import { Texture, TilingSprite } from "../../../library";

const getPenguinAssets = () => {
  const idle = [...Array(12)].map((_, i) => ({
    image: new TilingSprite({
      texture: Texture.from(`penguin-idle-${i}`),
      width: 176,
      height: 135,
    }),
    duration: 120,
  }));
  const moveSouth = [...Array(4)].map((_, i) => ({
    image: new TilingSprite({
      texture: Texture.from(`penguin-move-south-${i}`),
      width: 176,
      height: 135,
    }),
    duration: 120,
  }));
  const moveNorth = [...Array(4)].map((_, i) => ({
    image: new TilingSprite({
      texture: Texture.from(`penguin-move-north-${i}`),
      width: 176,
      height: 135,
    }),
    duration: 120,
  }));
  const moveEast = [...Array(4)].map((_, i) => ({
    image: new TilingSprite({
      texture: Texture.from(`penguin-move-east-${i}`),
      width: 176,
      height: 135,
    }),
    duration: 120,
  }));
  const moveWest = [...Array(4)].map((_, i) => ({
    image: new TilingSprite({
      texture: Texture.from(`penguin-move-west-${i}`),
      width: 176,
      height: 135,
    }),
    duration: 120,
  }));

  const layDown = [...Array(32)].map((_, i) => ({
    image: new TilingSprite({
      texture: Texture.from(`penguin-lay-down-${i}`),
      width: 176,
      height: 135,
    }),
    duration: 120,
  }));

  return { idle, moveSouth, moveNorth, moveEast, moveWest, layDown };
};

export const penguinAssets = [
  ...[...Array(12)].map((_, i) => ({
    alias: `penguin-idle-${i}`,
    src: `/public/static/assets/sprites/penguin/idle/${i}.png`,
  })),
  ...[...Array(4)].map((_, i) => ({
    alias: `penguin-move-south-${i}`,
    src: `/public/static/assets/sprites/penguin/moveSouth/${i}.png`,
  })),
  ...[...Array(4)].map((_, i) => ({
    alias: `penguin-move-north-${i}`,
    src: `/public/static/assets/sprites/penguin/moveNorth/${i}.png`,
  })),
  ...[...Array(4)].map((_, i) => ({
    alias: `penguin-move-east-${i}`,
    src: `/public/static/assets/sprites/penguin/moveEast/${i}.png`,
  })),
  ...[...Array(4)].map((_, i) => ({
    alias: `penguin-move-west-${i}`,
    src: `/public/static/assets/sprites/penguin/moveWest/${i}.png`,
  })),
  ...[...Array(32)].map((_, i) => ({
    alias: `penguin-lay-down-${i}`,
    src: `/public/static/assets/sprites/penguin/idleLayDown/${i}.png`,
  })),
];

export default getPenguinAssets;
