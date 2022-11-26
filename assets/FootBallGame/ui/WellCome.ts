import { _decorator, Component, Node, input, Input, game } from 'cc';
import { Msg } from '../Msg';
import { UIType } from './UI';
import { UIBase } from './UIBase';
const { ccclass, property } = _decorator;

@ccclass('WellCome')
export class WellCome extends UIBase {
    private _func = null;
    start() {
        this._func = input.on(Input.EventType.TOUCH_END, () => {
            game.emit(Msg.ShowUI, { type: UIType.Level })
        })
    }
    onDisable() {
    }
    onDestroy() {
        input.off(Input.EventType.TOUCH_END, this._func)
    }
    update(deltaTime: number) {

    }
}

