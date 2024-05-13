const random = (min: number, max: number, isFloat?: boolean) =>
  !isFloat
    ? Math.floor(Math.random() * (max - min + 1)) + min
    : Math.random() * (max - min) + min;

export default random;
