import { _decorator, Component, Node, Input, EventTouch, EventTarget, Slider } from 'cc';
import { Msg } from '../Msg';
import { Type, UIEvent } from './UIMgr';
const { ccclass, property } = _decorator;

@ccclass('UI')
export class UI extends Component {
    @property(Node)
    ballNode: Node = null;
    start() {
        UIEvent.on(Msg.ShowKicking, (type: Type) => {
            if (Type.KickingFootBall === type) { }
        })

        if (this.ballNode) {
            this.ballNode.active = false

            this.ballNode.on(Input.EventType.TOUCH_START, () => {

            })
            this.ballNode.on(Input.EventType.TOUCH_END, (event: EventTouch) => {

            })
        }
    }

    update(deltaTime: number) {

    }

}
