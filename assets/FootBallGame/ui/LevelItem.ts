import { _decorator, Component, Node, Label, Input, game } from 'cc';
import { footBallGame } from '../FootBallGame';
import { getLevelConfig } from '../LevelData';
import { Msg } from '../Msg';
const { ccclass, property } = _decorator;

@ccclass('LevelItem')
export class LevelItem extends Component {
    @property(Label)
    text: Label = null;

    private levelID: number = null;
    start() {
        this.node.on(Input.EventType.TOUCH_END, () => {
            game.emit(Msg.EnterLevel, this.levelID);
        })
    }

    update(deltaTime: number) {

    }
    initData(index, id) {
        this.levelID = id;
        const cfg = getLevelConfig(id);
        if (cfg && cfg.desc) {
            this.text.string = `${index.toString()}:${cfg.desc}`
        } else {
            this.text.string = index.toString()
        }
        // this.text.string = this.levelID.toString();
    }
}

