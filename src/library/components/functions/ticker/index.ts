/**
 * Represents a callback function for the Ticker.
 */
type TickerCallback<T = any> = (deltaTime: number) => void;

/**
 * Enum defining update priorities for Ticker listeners.
 */
enum UPDATE_PRIORITY {
  HIGH = 0,
  NORMAL = 5,
  LOW = 10,
}

/**
 * Ticker Class
 *
 * The `Ticker` class provides a mechanism for managing game update loops.
 */
export default class Ticker {
  /**
   * Indicates whether the Ticker should automatically start.
   */
  autoStart: boolean;

  /**
   * The time elapsed between the current and previous frames.
   */
  deltaTime: number;

  /**
   * The time of the last frame.
   */
  lastTime: number;

  /**
   * Indicates whether the Ticker has started.
   */
  started: boolean;

  /**
   * Array containing the registered listener functions.
   */
  private listeners: { fn: TickerCallback; context?: any; priority: number }[];

  /**
   * Constructs a new Ticker instance.
   * @param autoStart Whether the Ticker should automatically start.
   */
  constructor(autoStart = true) {
    this.autoStart = autoStart;
    this.deltaTime = 0;
    this.lastTime = 0;
    this.started = false;
    this.listeners = [];

    if (autoStart) {
      this.start();
    }
  }

  /**
   * Adds a listener function to the Ticker.
   * @param fn The listener function.
   * @param context The context in which the listener function will be called.
   * @param priority The priority of the listener.
   * @returns The Ticker instance.
   */
  public add = <T = any>(
    fn: TickerCallback<T>,
    context?: T,
    priority: number = UPDATE_PRIORITY.NORMAL,
  ): this => {
    this.listeners.push({ fn, context, priority });
    this.listeners.sort((a, b) => a.priority - b.priority);
    return this;
  };

  /**
   * Adds a one-time listener function to the Ticker.
   * @param fn The listener function.
   * @param context The context in which the listener function will be called.
   * @param priority The priority of the listener.
   * @returns The Ticker instance.
   */
  public addOnce = <T = any>(
    fn: TickerCallback<T>,
    context?: T,
    priority: number = UPDATE_PRIORITY.NORMAL,
  ): this => {
    const onceFn: TickerCallback<T> = (deltaTime) => {
      fn(deltaTime);
      this.remove(onceFn, context);
    };
    return this.add(onceFn, context, priority);
  };

  /**
   * Removes a listener function from the Ticker.
   * @param fn The listener function to remove.
   * @param context The context associated with the listener function.
   * @returns The Ticker instance.
   */
  public remove = <T = any>(fn: TickerCallback<T>, context?: T): this => {
    this.listeners = this.listeners.filter(
      (listener) => listener.fn !== fn || listener.context !== context,
    );
    return this;
  };

  /**
   * Starts the Ticker.
   */
  public start = (): void => {
    if (!this.started) {
      this.started = true;
      this.lastTime = performance.now();
      requestAnimationFrame(this.update.bind(this));
    }
  };

  /**
   * Stops the Ticker.
   */
  public stop = (): void => {
    this.started = false;
  };

  /**
   * Destroys the Ticker.
   */
  public destroy = (): void => {
    this.stop();
    this.listeners = [];
  };

  /**
   * Gets the frames per second of the Ticker.
   */
  public get FPS(): number {
    return 1000 / this.deltaTime;
  }

  /**
   * Updates the Ticker and calls registered listener functions.
   */
  private update = (): void => {
    const currentTime = performance.now();
    this.deltaTime = currentTime - this.lastTime;
    this.lastTime = currentTime;

    for (const listener of this.listeners) {
      listener.fn(this.deltaTime);
    }

    if (this.started) {
      requestAnimationFrame(this.update.bind(this));
    }
  };
}
