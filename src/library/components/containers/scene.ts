import type Container from "./container";

export default class Scene {
  public view: Container;

  public start: () => Container;
  public stop: () => void;
}
