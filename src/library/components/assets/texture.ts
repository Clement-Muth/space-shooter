import Assets from "./assets";

/**
 * Texture Class
 *
 * The `Texture` class provides a convenient way to retrieve texture assets.
 */
// biome-ignore lint/complexity/noStaticOnlyClass: <explanation>
export default class Texture {
  /**
   * Retrieves the data URL of the texture asset associated with the given alias.
   * @param alias The alias of the texture asset.
   * @returns The data URL of the texture asset.
   * @throws Error if the texture asset is not found.
   */
  static from = (alias: string): string => {
    const src = Assets.getAsset(alias);

    if (!src) throw new Error(`Texture not found ${alias}`);

    return src;
  };
}
