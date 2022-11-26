import { _decorator, Component, Node, input, Input, KeyCode, EventKeyboard, Enum, Vec2, EventMouse, UITransform, Quat, TERRAIN_HEIGHT_BASE, Vec3, tween, randomRange, Camera } from 'cc';
import { footBallGame } from './FootBallGame';
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

const Type = Enum({
    None: 0,
    FreeMove: 1,
    FlowTarget: 2,
})
@ccclass('GameCamera')
export class GameCamera extends Component {
    @property(Node)
    flowTarget: Node = null;

    @property({ type: Type, displayName: "类型" })
    type: number = Type.None;


    isWalking = false;
    horizontal: Horizontal = Horizontal.None;
    vertical: Vertical = Vertical.None;
    speed = 0.1;

    enabledFunc = false;

    offset = new Vec2();
    getCamera() {
        return this.node.getComponent(Camera);
    }
    updateCamera(pos: Vec3, rotation: Quat) {
        this.node.setPosition(pos);
        this.node.setRotation(rotation);
    }
    start() {
        input.on(Input.EventType.KEY_DOWN, (event: EventKeyboard) => {
            if (event.keyCode === KeyCode.KEY_W) {
                if (this.vertical === Vertical.None) {
                    this.vertical = Vertical.Front;
                }
            } else if (event.keyCode === KeyCode.KEY_S) {
                if (this.vertical === Vertical.None) {
                    this.vertical = Vertical.Back;
                }
            } else if (event.keyCode === KeyCode.KEY_A) {
                if (this.horizontal === Horizontal.None) {
                    this.horizontal = Horizontal.Left;
                }
            } else if (event.keyCode === KeyCode.KEY_D) {
                if (this.horizontal === Horizontal.None) {
                    this.horizontal = Horizontal.Right;
                }
            } else if (event.keyCode === KeyCode.SPACE) {

            } else if (event.keyCode === KeyCode.KEY_Q) {
                this.enabledFunc = !this.enabledFunc;
                if (this.enabledFunc) {
                    console.log("摄像机功能启用")
                } else {
                    console.log("摄像机功能禁用")
                }
                footBallGame.isDesign = this.enabledFunc;
            } else if (event.keyCode === KeyCode.KEY_E) {
                console.log("postion: ", this.node.getPosition());
                console.log("rotation: ", this.node.getRotation());
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
        });
        let turnArroundEye;
        input.on(Input.EventType.MOUSE_DOWN, (event: EventMouse) => {
            turnArroundEye = true;
        });
        input.on(Input.EventType.MOUSE_MOVE, (event: EventMouse) => {
            if (turnArroundEye && this.enabledFunc) {
                let rotateSpeed = 0.2;
                let angleBase = this.node.eulerAngles;
                let quatTemp = new Quat();
                Quat.fromEuler(quatTemp, angleBase.x - event.movementY * rotateSpeed, angleBase.y - event.movementX * rotateSpeed, 0);
                this.node.setRotation(quatTemp);
            }
        });
        input.on(Input.EventType.MOUSE_UP, (event: EventMouse) => {
            turnArroundEye = false;
        });
        input.on(Input.EventType.MOUSE_WHEEL, (event: EventMouse) => {
            if (this.enabledFunc) {
                let x = event.getScrollY();
                let dis = this.node.forward.normalize().multiplyScalar(x * 0.01);
                let transform = this.node.getComponent(UITransform);
                this.node.setPosition(this.node.getPosition().add(dis));
            }
        });
    }
    shake() {
        let act = tween().target(this.node);
        const pos = this.node.getPosition();
        const offset = 0.05;
        const time = 0.3;
        const num = 5;
        for (let i = 0; i < num; i++) {
            const x = randomRange(-offset, offset);
            const y = randomRange(-offset, offset);
            const z = randomRange(-offset, offset);
            act.to(time / num, { position: pos.clone().add(new Vec3(x, y, z)) }).call(() => {
                // console.log('pos:', x, y, z)
            });
        }
        act.call(() => {
            this.node.setPosition(pos)
        })
            .start()
    }
    update(deltaTime: number) {
        if (this.enabledFunc) {
            if (this.type === Type.FlowTarget) {
                this._updateWithTarget();
            } else if (this.type === Type.FreeMove) {
                this._updateWithFree();
            }
        }
    }
    _updateWithFree() {
        let position = this.node.getPosition();
        let forward = this.node.forward;

        let verticalVec = new Vec2();
        switch (this.vertical) {
            case Vertical.Back: {
                verticalVec.x = forward.x;
                verticalVec.y = forward.z;
                verticalVec.rotate(Math.PI);
                break;
            }
            case Vertical.Front: {
                verticalVec.x = forward.x;
                verticalVec.y = forward.z;
                verticalVec.rotate(0);
                break
            }
        }

        let horizonalVec = new Vec2();
        switch (this.horizontal) {
            case Horizontal.Left: {
                horizonalVec.x = forward.x;
                horizonalVec.y = forward.z;
                horizonalVec.rotate(-Math.PI / 2);
                break;
            }
            case Horizontal.Right: {
                horizonalVec.x = forward.x;
                horizonalVec.y = forward.z;
                horizonalVec.rotate(Math.PI / 2);
                break;
            }
        }
        let directionVec = horizonalVec.normalize().add(verticalVec.normalize());
        if (!directionVec.equals2f(0, 0)) {
            position.add(new Vec3(directionVec.x, 0, directionVec.y).multiplyScalar(this.speed));
            this.node.setPosition(position);
        }
    }
    _updateWithTarget() {
        if (this.flowTarget) {
            let pos = this.flowTarget.getWorldPosition();
            this.node.setWorldPosition(pos);
        }
    }
}

