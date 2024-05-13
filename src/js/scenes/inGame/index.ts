import { Container, type Scene } from "../../../library";
import Ticker from "../../../library/components/functions/ticker";
import type Player from "../../players";
import Player1 from "../../players/player1";
import Player2 from "../../players/player2";
import Level from "./level";

export default class InGame implements Scene {
  public view: Container;
  public size: { width: number; height: number };

  private _level: Scene;
  private _currentLevel = 1;
  private _startInterval: NodeJS.Timeout;
  private _ticker: Ticker;
  private _players: Player[] = [];
  private _onLoose: (player: Player) => void;

  constructor({
    size,
    onLoose,
  }: { size: any; onLoose: (player: Player) => void }) {
    this.view = new Container();
    this.size = size;
    this._onLoose = onLoose;

    this._players.push(Player1(), Player2());
    this._players.map((player) => player.initPlayer());

    this._ticker = new Ticker();

    this._level = new Level({
      level: this._currentLevel,
      size,
      players: this._players,
      onChangeLevel: this._onChangeLevel,
    });
  }

  private _onChangeLevel = () => {
    this._level.stop();
    this._currentLevel++;
    this._level = new Level({
      level: this._currentLevel,
      size: this.size,
      players: this._players,
      onChangeLevel: this._onChangeLevel,
    });

    this.view.addChild(
      this._level.start(),
      ...this._players.map((player) => player.score),
      ...this._players.map((player) => player.ship).map((c) => c.view),
    );
  };

  private _gameEventListener = () => {
    for (const player of this._players) {
      if (player.status === "loose") {
        this._onLoose(player);
      }
    }
  };

  public start = () => {
    this.view.addChild(
      this._level.start(),
      ...this._players.map((player) => player.score),
      ...this._players.map((player) => player.ship).map((c) => c.view),
    );

    this._ticker.add(this._gameEventListener);

    return this.view;
  };

  public stop = () => {
    clearInterval(this._startInterval);
    this._ticker.remove(this._gameEventListener);
    this._ticker.destroy();
    this._level.stop();
    this._players.map((player) => player.ship.detroy());
    this.view.removeChild(this._level);
  };
}
