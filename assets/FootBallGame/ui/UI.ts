import { _decorator, Component, Node, Input, EventTouch, EventTarget, Slider, game } from 'cc';
import { Msg } from '../Msg';
import { Type } from './UIMgr';
const { ccclass, property } = _decorator;

@ccclass('UI')
export class UI extends Component {
    @property(Node)
    ballNode: Node = null;
    onLoad() {
        game.on(Msg.ShowKicking, () => {
            this.ballNode.active = true;
        })
        game.on(Msg.HideKiching, () => {
            this.ballNode.active = false;
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

