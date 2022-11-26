import { _decorator, Component, Node, game } from 'cc';
import { Msg } from '../Msg';
import { UIType } from './UI';
import { UIBase } from './UIBase';
const { ccclass, property } = _decorator;

@ccclass('UIGame')
export class UIGame extends UIBase {
    start() {

    }

    update(deltaTime: number) {

    }
    onBtnClickGoLevel() {
        game.emit(Msg.ShowUI, { type: UIType.Level })
    }
}

