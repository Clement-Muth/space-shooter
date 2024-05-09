/**
 * Assets Class
 *
 * The `Assets` class provides a convenient way to manage and load assets in your application.
 * It offers methods for loading textures asynchronously and accessing them by alias.
 */
export default class Assets {
  private textures: Map<string, string> = new Map();
  private loadingPromise: Promise<void> | null = null;

  private constructor() {}

  private static getInstance(): Assets {
    const t = "test";

    if (!Assets.instance) {
      Assets.instance = new Assets();
    }
    return Assets.instance;
  }

  /**
   * Loads textures asynchronously from the provided URLs.
   * @param urls An array of objects containing aliases and URLs of textures to load.
   * @returns A promise that resolves when all textures are loaded.
   */
  public static load = async (
    urls: { alias: string; src: string }[],
  ): Promise<void> => {
    const assets = this.getInstance();

    if (assets.loadingPromise) await assets.loadingPromise;

    assets.loadingPromise = new Promise((resolve) => {
      for (const url of urls) {
        fetch(url.src)
          .then((response) => response.blob())
          .then((blob) => {
            const reader = new FileReader();
            reader.readAsDataURL(blob);
            reader.onloadend = () => {
              const dataURL = reader.result;
              assets.textures.set(url.alias, dataURL as string);
              if (assets.textures.size === urls.length) resolve();
            };
          })
          .catch((error) => console.error("Error loading texture:", error));
      }
    });

    await assets.loadingPromise;
  };

  /**
   * Retrieves the data URL of the asset associated with the given alias.
   * @param alias The alias of the asset.
   * @returns The data URL of the asset, or undefined if the asset is not found.
   */
  public static getAsset(alias: string): string | undefined {
    const assets = Assets.getInstance();

    return assets.textures.get(alias);
  }

  private static instance: Assets;
}
