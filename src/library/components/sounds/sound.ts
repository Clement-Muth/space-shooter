/**
 * Sound Class
 *
 * The `Sound` class represents a sound object that can be played, paused, stopped, and adjusted in volume.
 */
export default class Sound {
  /**
   * The HTML audio element used to play the sound.
   */
  private audio: HTMLAudioElement;

  /**
   * Constructs a new Sound instance.
   * @param src The URL of the sound file.
   */
  constructor(src: string) {
    this.audio = new Audio(src);
  }

  /**
   * Plays the sound.
   */
  public play = (): void => {
    this.audio.play();
  };

  /**
   * Pauses the sound.
   */
  public pause = (): void => {
    this.audio.pause();
  };

  /**
   * Stops the sound.
   */
  public stop = (): void => {
    this.audio.pause();
    this.audio.currentTime = 0;
  };

  /**
   * Sets the volume of the sound.
   * @param volume The volume level (0 to 1).
   */
  public setVolume = (volume: number): void => {
    this.audio.volume = volume;
  };

  /**
   * Checks if the sound is currently playing.
   * @returns True if the sound is playing, otherwise false.
   */
  public isPlaying = (): boolean => {
    return !this.audio.paused;
  };
}
