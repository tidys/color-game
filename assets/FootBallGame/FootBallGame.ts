import { Ball } from "../FootBall"

export class FootBallGame {
    private ball: Ball = null;
    setFootBall(ball: Ball) {
        this.ball = ball;
    }
    getFootBall() {
        return this.ball;
    }
    reset() {
        this._isShootingIn = false;
    }
    private _isShootingIn = false;
    shootingIn() {
        if (!this._isShootingIn) {
            this._isShootingIn = true;
            console.log("进球了")
        }
    }
}
export const footBallGame = new FootBallGame()