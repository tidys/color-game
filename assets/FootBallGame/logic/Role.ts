import { _decorator, Component, Node, Input, input, EventKeyboard, KeyCode, RigidBody, Vec3 } from 'cc';

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
    speed = 0.1;

    start() {
        input.on(Input.EventType.KEY_DOWN, (event: EventKeyboard) => {
            if (event.keyCode === KeyCode.KEY_Q) {

                let rigidBody = this.getComponent(RigidBody);
                rigidBody.applyForce(new Vec3(300, 100, 0));
            }
        });
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
                position.z += this.speed;
                break;
            }
            case Vertical.Front: {
                position.z -= this.speed;

                break
            }
        }
        switch (this.horizontal) {
            case Horizontal.Left: {
                position.x -= this.speed;
                break;
            }
            case Horizontal.Right: {
                position.x += this.speed;
                break;
            }
        }
        this.node.setPosition(position);

    }
}

