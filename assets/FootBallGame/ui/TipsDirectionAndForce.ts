import { _decorator, EventTarget, Event, game, Component, Input, Label } from "cc"
import { footBallGame } from "../FootBallGame";
import { Msg } from "../Msg";
import { UIBase } from "./UIBase";
const { ccclass, property } = _decorator;


@ccclass("TipsDirectionAndForce")
export class TipsDirectionAndForce extends UIBase {
    @property(Label)
    text: Label = null;
    start() {
        this.node.on(Input.EventType.TOUCH_START, () => {
            this.node.removeFromParent()
        })
        const cfg = footBallGame.getLevelConfig();
        this.text.string = cfg.tips.scene.text;
    }

}


