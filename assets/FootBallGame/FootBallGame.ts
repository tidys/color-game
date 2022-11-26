import { BoxCollider, game, Scheduler, tween, Node } from "cc";
import { GameCamera } from "./FootBallGameCamera";
import { ILevelConfig, LevelConfigs, getLevelConfig } from "./LevelData";
import { Ball } from "./logic/Ball"
import { Msg } from "./Msg";

export enum GameState {
    ReadyShoot = "ReadyShoot",
    BallMoving = "BallMoving",
    Result = "Result",
}
export class FootBallGame {
    public isDesign = false;
    private ball: Ball = null;
    private camera: GameCamera = null;
    private _state: GameState = GameState.ReadyShoot;
    private _levelConfig: ILevelConfig = null;
    getLevelConfig() {
        return this._levelConfig;
    }
    setLevelID(id) {
        this._levelConfig = getLevelConfig(id)
    }
    isGamePlaying() {
        return this._state !== GameState.Result;
    }
    setGameFinish() {
        this._state = GameState.Result;
    }
    setGameState(state: GameState) {
        this._state = state;
    }
    getGameState() {
        return this._state;
    }
    setFootBall(ball: Ball) {
        this.ball = ball;
    }
    setMainCamera(camera: GameCamera) {
        this.camera = camera;
    }
    getMainCamera() {
        return this.camera;
    }
    getFootBall() {
        return this.ball;
    }
    public worldNode: Node = null;
    reset() {
        this._state = GameState.ReadyShoot;
        game.emit(Msg.ResetGame);
    }
    shootingIn() {
        this._state = GameState.Result;
        console.log("进球了")
        game.emit(Msg.ShootingIn);
    }
    failed() {
        this._state = GameState.Result;
        console.log("失败了")
        game.emit(Msg.ResetGame);
    }

}
export const footBallGame = new FootBallGame()