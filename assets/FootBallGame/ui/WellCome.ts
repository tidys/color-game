import { _decorator, Component, Node, input, Input, game } from 'cc';
import { Msg } from '../Msg';
import { UIType } from './UI';
import { UIBase } from './UIBase';
const { ccclass, property } = _decorator;

@ccclass('WellCome')
export class WellCome extends UIBase {
    start() {
        this.node.on(Input.EventType.TOUCH_END, () => {
            game.emit(Msg.ShowUI, { type: UIType.Level })
        })
    }

    update(deltaTime: number) {

    }
}

