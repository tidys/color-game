import { _decorator, Component, Node, Input, input, EventKeyboard, KeyCode } from 'cc';

const { ccclass, property } = _decorator;

enum Horizontal {
    None,
    Left,
    Right,
}

enum Vertical {
    None,
    Front,
    Back,
}


@ccclass('Role')
export class Role extends Component {
    isWalking = false;
    horizontal: Horizontal = Horizontal.None;
    vertical: Vertical = Vertical.None;
    speed = 1;

    start() {
        input.on(Input.EventType.KEY_DOWN, (event: EventKeyboard) => {
            if (event.keyCode === KeyCode.KEY_W) {
                this.vertical = Vertical.Front;
            } else if (event.keyCode === KeyCode.KEY_S) {
                this.vertical = Vertical.Back;
            } else if (event.keyCode === KeyCode.KEY_A) {
                this.horizontal = Horizontal.Left;
            } else if (event.keyCode === KeyCode.KEY_D) {
                this.horizontal = Horizontal.Right;
            }
        })
        input.on(Input.EventType.KEY_UP, (event: EventKeyboard) => {
            if (event.keyCode === KeyCode.KEY_W ||
                event.keyCode === KeyCode.KEY_S) {
                this.vertical = Vertical.None;
            } else if (event.keyCode === KeyCode.KEY_A ||
                event.keyCode === KeyCode.KEY_D) {
                this.horizontal = Horizontal.None;
            }
        })
    }

    update(deltaTime: number) {
        let position = this.node.getPosition();

        switch (this.vertical) {
            case Vertical.Back: {
                position.z++;
                break;
            }
            case Vertical.Front: {
                position.z--;

                break
            }
        }
        switch (this.horizontal) {
            case Horizontal.Left: {
                position.x--;
                break;
            }
            case Horizontal.Right: {
                position.x++;
                break;
            }
        }
        this.node.setPosition(position);

    }
}

