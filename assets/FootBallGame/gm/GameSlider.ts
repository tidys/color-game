import { _decorator, Component, Node, Slider, Label, CCInteger } from 'cc';
import { Data } from './GameData';
const { ccclass, property } = _decorator;

@ccclass('GameSlider')
export class GameSlider extends Component {
    @property(Label)
    label: Label = null;
    @property(CCInteger)
    maxValue = 10000;
    start() {
        this._updateLabel()
    }

    update(deltaTime: number) {

    }
    setForce(event: Slider) {
        this._updateLabel()
    }
    _updateLabel() {
        let slider = this.getComponent(Slider);
        if (slider) {
            let val = slider.progress * this.maxValue;
            Data.Force = val;
            this.label.string = val.toFixed(0).toString();
        }

    }
}

