import { _decorator, Component, Node, Input, EventTouch, EventTarget, Slider, game, input, EventKeyboard, KeyCode, Camera } from 'cc';
import { Msg } from '../Msg';
import { Type } from './UIMgr';
const { ccclass, property } = _decorator;

@ccclass('UI')
export class UI extends Component {
    @property(Node)
    ballNode: Node = null;
    @property(Camera)
    camera: Camera = null;
    onLoad() {
        game.on(Msg.ShowKicking, () => {
            this.ballNode.active = true;
        })
        game.on(Msg.HideKiching, () => {
            this.ballNode.active = false;
        })
        input.on(Input.EventType.KEY_DOWN, (event: EventKeyboard) => {
            if (event.keyCode === KeyCode.KEY_V) {
                this.camera.node.active = !this.camera.node.active;
            }
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

