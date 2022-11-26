import { _decorator, EventTarget, Event, game, Component, Input, Label, input } from "cc"
import { footBallGame } from "../FootBallGame";
import { Msg } from "../Msg";
import { UIBase } from "./UIBase";
const { ccclass, property } = _decorator;


@ccclass("TipsDirectionAndForce")
export class TipsDirectionAndForce extends UIBase {
    @property(Label)
    text: Label = null;

    private _func = null;
    start() {
        this._func = input.on(Input.EventType.TOUCH_START, () => {
            this.node.destroy()
        })
        const cfg = footBallGame.getLevelConfig();
        this.text.string = cfg.tips.scene.text;
    }
    onDestroy() {
        input.off(Input.EventType.TOUCH_START, this._func)
    }

}


