import { _decorator, Component, Node, Label, Input, game } from 'cc';
import { footBallGame } from '../FootBallGame';
import { Msg } from '../Msg';
const { ccclass, property } = _decorator;

@ccclass('LevelItem')
export class LevelItem extends Component {
    @property(Label)
    text: Label = null;

    private levelID: number = null;
    start() {
        this.node.on(Input.EventType.TOUCH_END, () => {
            game.emit(Msg.CleanUI);
            footBallGame.setLevelID(this.levelID);
            game.emit(Msg.EnterLevel, this.levelID);
        })
    }

    update(deltaTime: number) {

    }
    initData(id) {
        this.levelID = id;
        this.text.string = this.levelID.toString();
    }
}

