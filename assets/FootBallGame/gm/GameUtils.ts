import { _decorator, Component, Node } from 'cc';
import { footBallGame } from './Game';
const { ccclass, property } = _decorator;

@ccclass('GameUtils')
export class GameUtils extends Component {
    @property(Node)
    ball: Node = null;

    start() {

    }
    onResetBallPositon() {
        footBallGame.reset()
        footBallGame.getFootBall()?.resetPosition();
    }
    update(deltaTime: number) {

    }
}

