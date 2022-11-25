import { _decorator, Component, Node, Input, EventTouch, UITransform, Vec3, game, Label, Animation } from 'cc';
import { footBallGame } from '../FootBallGame';
import { FootBallGameData } from '../FootBallGameData';
import { Msg } from '../Msg';
import { UIBase } from './UIBase';
const { ccclass, property } = _decorator;

@ccclass('ChooseBallPoint')
export class ChooseBallPoint extends UIBase {
    @property(Node)
    ball: Node = null;

    @property(Label)
    text: Label = null;

    @property(Node)
    hand: Node = null;

    start() {
        const cfg = footBallGame.getLevelConfig();
        if (cfg.tips?.ball) {
            const { pos, text } = cfg.tips.ball;
            this.hand.active = true;
            this.text.node.active = true;
            this.text.string = text;
            const transfrom = this.ball.getComponent(UITransform);
            this.hand.setPosition(new Vec3(pos.x * transfrom.width / 2, pos.y * transfrom.height / 2, 0))

            const ani = this.hand.getComponent(Animation)
            if (ani) {
                ani.play();
            }
        } else {
            this.text.node.active = false;
            this.hand.active = false;
        }


        this.ball.on(Input.EventType.TOUCH_START, (event: EventTouch) => {
            // 标记点击位置
        })
        this.ball.on(Input.EventType.TOUCH_END, (event: EventTouch) => {
            const pos = event.getLocation();
            let transtorm = this.ball.getComponent(UITransform);
            if (transtorm.hitTest(pos)) {
                // console.log('点中了', pos)
                let ret = transtorm.convertToNodeSpaceAR(new Vec3(pos.x, pos.y, 0));
                FootBallGameData.OffsetX = ret.x / (transtorm.width / 2);
                if (ret.y > 0) {
                    // 踢中球的上半部分，球只能往前
                    FootBallGameData.OffsetY = 0;
                } else {
                    // 踢中球的下半部分，球会挑起来
                    FootBallGameData.OffsetY = Math.abs(ret.y) / (transtorm.height / 2);
                }
                game.emit(Msg.CleanUI)
                game.emit(Msg.GotoShoot);
            }
        });
    }

    update(deltaTime: number) {

    }
}

