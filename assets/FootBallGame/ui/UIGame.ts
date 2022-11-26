import { _decorator, Component, Node, game, Label } from 'cc';
import { Msg } from '../Msg';
import { UIType } from './UI';
import { UIBase } from './UIBase';
const { ccclass, property } = _decorator;

@ccclass('UIGame')
export class UIGame extends UIBase {
    @property(Label)
    text: Label = null

    private _func = null;
    onLoad() {
        game.on(Msg.UpdateForce, (num?: number) => {
            this._updateForce(num)
        })
        game.on(Msg.ResetGame, () => {
            this._updateForce(0)
        })
        this._updateForce(0)
    }
    onDesstroy() {
        game.off(this._func)
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

