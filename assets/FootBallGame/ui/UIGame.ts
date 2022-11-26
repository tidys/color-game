import { _decorator, Component, Node, game, Label } from 'cc';
import { Msg } from '../Msg';
import { UIType } from './UI';
import { UIBase } from './UIBase';
const { ccclass, property } = _decorator;

@ccclass('UIGame')
export class UIGame extends UIBase {
    @property(Label)
    text: Label = null

    onLoad() {
        game.on(Msg.UpdateForce, (num?: number) => {
            this._updateForce(num)
        }, this)
        game.on(Msg.ResetGame, () => {
            this._updateForce(0)
        }, this)
        this._updateForce(0)
    }
    onDestroy() {
        game.targetOff(this)
    }

    _updateForce(v) {
        v = v.toFixed(2);
        this.text.string = `力度：${v}`;
    }
    update(deltaTime: number) {

    }
    onBtnClickGoLevel() {
        game.emit(Msg.ShowLevel)
    }
}

