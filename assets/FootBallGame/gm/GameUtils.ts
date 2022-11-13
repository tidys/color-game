import { _decorator, Component, Node, game } from 'cc';
import { FootBallGame, footBallGame } from '../FootBallGame';
import { Msg } from '../Msg';
const { ccclass, property } = _decorator;

@ccclass('GameUtils')
export class GameUtils extends Component {
    @property(Node)
    ball: Node = null;

    start() {

    }
    onResetBallPositon() {
        footBallGame.reset()
    }
    update(deltaTime: number) {

    }
}

