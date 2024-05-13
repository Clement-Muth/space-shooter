import { Application, Container, type Scene } from "../../../library";
import Ticker from "../../../library/components/functions/ticker";
import type Player from "../../players";
import Player1 from "../../players/player1";
import Player2 from "../../players/player2";
import Level from "./level";

export default class InGame implements Scene {
  public view: Container;
  public size: { width: number; height: number };

  private _app: Application = Application.getInstance();
  private _level: Scene;
  private _currentLevel = 1;
  private _startInterval: NodeJS.Timeout;
  private _ticker: Ticker;
  private _players: Player[] = [];
  private _isChangingLevel: boolean;
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

    this._isChangingLevel = false;
    this._level = new Level({
      level: this._currentLevel,
      size,
      players: this._players,
    });
  }

  private _isOutsideBondary = () => {
    if (this._isChangingLevel) return;

    for (const ship of this._players.map((player) => player.ship)) {
      if (
        ship.sprite.x < 0 ||
        ship.sprite.x > this._app.canvas.width ||
        ship.sprite.y < 0 ||
        ship.sprite.y > this._app.canvas.height
      ) {
        this._isChangingLevel = true;
        this._onChangeLevel();
      }
    }
  };

  private _onChangeLevel = () => {
    this._players.map((player) => player.initPlayer);
    this._level.stop(this.view);
    this._currentLevel++;
    this._level = new Level({
      level: this._currentLevel,
      size: this.size,
      players: this._players,
    });

    this.view.addChild(
      this._level.start(),
      ...this._players.map((player) => player.score),
      ...this._players.map((player) => player.ship).map((c) => c.view),
    );
    this._isChangingLevel = false;
  };

  private _gameEventListener = () => {
    for (const player of this._players) {
      if (player.status === "loose") {
        this._onLoose(player);
      }
    }
    this._isOutsideBondary();
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
    this._level.stop(this.view);
  };
}
