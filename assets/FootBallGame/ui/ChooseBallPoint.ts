import { _decorator, Component, Node, Input, EventTouch, UITransform, Vec3, game } from 'cc';
import { footBallGame } from '../FootBallGame';
import { Msg } from '../Msg';
const { ccclass, property } = _decorator;

@ccclass('ChooseBallPoint')
export class ChooseBallPoint extends Component {
    @property(Node)
    ball: Node = null;

    start() {
        this.ball.on(Input.EventType.TOUCH_START, (event: EventTouch) => {
            // 标记点击位置
        })
        this.ball.on(Input.EventType.TOUCH_END, (event: EventTouch) => {
            const pos = event.getLocation();
            let transtorm = this.ball.getComponent(UITransform);
            if (transtorm.hitTest(pos)) {
                // console.log('点中了', pos)
                let ret = transtorm.convertToNodeSpaceAR(new Vec3(pos.x, pos.y, 0));
                // console.log(ret)
                footBallGame.getFootBall()?.shoot();
                game.emit(Msg.HideKiching)
            }
        });
    }

    update(deltaTime: number) {

    }
}

