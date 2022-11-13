import { _decorator, Component, Node, Slider, Label, CCInteger, lerp } from 'cc';
import { FootBallGameData } from '../FootBallGameData';
const { ccclass, property } = _decorator;

@ccclass('GameSlider')
export class GameSlider extends Component {
    @property(Label)
    label: Label = null;
    @property(CCInteger)
    minValue = 0;

    @property(CCInteger)
    maxValue = 10000;

    @property(CCInteger)
    fixed = 0;

    start() {
        this._updateLabel()
    }

    _calcFunc: Function = null;
    setCalcFunc(cb: Function) {
        this._calcFunc = cb;
    }

    onUpdateProcess() {
        this._updateLabel()
    }
    private _updateLabel() {
        let slider = this.getComponent(Slider);
        if (slider) {
            let val = lerp(this.minValue, this.maxValue, slider.progress);
            this.label.string = val.toFixed(this.fixed).toString();
            this._calcFunc(val);
        }
    }
}

