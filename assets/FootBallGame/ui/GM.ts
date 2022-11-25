import { _decorator, Component, Node } from 'cc';
import { footBallGame } from '../FootBallGame';
import { FootBallGameData } from '../FootBallGameData';
import { GameSlider } from '../gm/GameSlider';
const { ccclass, property } = _decorator;

@ccclass('GM')
export class GM extends Component {
    @property(GameSlider)
    forceSlider: GameSlider = null;

    @property(GameSlider)
    offsetSlider: GameSlider = null;
    onLoad() {
        this.forceSlider.setCalcFunc((val: number) => {
            FootBallGameData.Force = val;

        })
        this.offsetSlider.setCalcFunc((val: number) => {
            FootBallGameData.OffsetX = 0 / val;
        })
    }

    update(deltaTime: number) {

    }
    onResetBallPositon() {
        footBallGame.reset()
    }
    updateForce() {

    }
    updateOffset() {

    }
    onShoot() {
        footBallGame.getFootBall().shoot();
    }
}

