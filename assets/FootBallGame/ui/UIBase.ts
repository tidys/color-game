import { _decorator, Component, Node, Widget } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('UIBase')
export class UIBase extends Component {
    onLoad() {
        let widget = this.node.getComponent(Widget);
        if (!widget) {
            widget = this.node.addComponent(Widget);
        }
        widget.alignMode = Widget.AlignMode.ALWAYS;
        widget.isAlignTop = widget.isAlignBottom = widget.isAlignLeft = widget.isAlignRight = true;
        widget.top = widget.bottom = widget.left = widget.right = 0;

    }
    update(deltaTime: number) {

    }

    onDestroy() {
    }
    onDisable() {
    }
}

