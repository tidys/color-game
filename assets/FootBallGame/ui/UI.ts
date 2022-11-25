import { _decorator, Component, Node, Input, EventTouch, EventTarget, Slider, game, input, EventKeyboard, KeyCode, Camera, Prefab, instantiate, UITransform } from 'cc';
import { Msg } from '../Msg';
const { ccclass, property } = _decorator;

export enum UIType {
    Kicking = "Kicking",
    TipsDirectionAndForce = "TipsDirectionAndForce",
    GM = "GM",
}
export interface UIOptions {
    type: UIType,
}
@ccclass('UI')
export class UI extends Component {
    @property({ type: Prefab, displayName: "选择踢球的界面" })
    ballNode: Prefab = null;

    @property(Camera)
    camera: Camera = null;

    @property({ type: Prefab, displayName: "提示方向和力量界面" })
    tipsNode: Prefab = null;

    onLoad() {
        game.on(Msg.ShowUI, (data?: UIOptions) => {
            const cfg = {};
            cfg[UIType.GM] = null;
            cfg[UIType.Kicking] = this.ballNode;
            cfg[UIType.TipsDirectionAndForce] = this.tipsNode;
            let prefab = cfg[data.type];
            if (prefab) {
                const node = instantiate(prefab);
                node.x = node.y = 0;
                this.node.addChild(node);
            }
        })
        game.on(Msg.CleanUI, () => {
            this.node.destroyAllChildren()
        })
        input.on(Input.EventType.KEY_DOWN, (event: EventKeyboard) => {
            if (event.keyCode === KeyCode.KEY_V) {
                this.camera.node.active = !this.camera.node.active;
            }
        })
        this.node.destroyAllChildren()
    }

    update(deltaTime: number) {

    }

}

