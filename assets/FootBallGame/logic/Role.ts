import { _decorator, Component, Node, Input, input, EventKeyboard, KeyCode, RigidBody, Vec3, SkeletalAnimation } from 'cc';

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

const stand = "stand";
const walk = "walk";
export const offsetBallDistance = 2;
@ccclass('Role')
export class Role extends Component {
    isWalking = false;
    horizontal: Horizontal = Horizontal.None;
    vertical: Vertical = Vertical.None;
    speed = 0.1;
    onLoad() {
        const skeAnimation = this.node.getComponent(SkeletalAnimation);
        skeAnimation.createState(skeAnimation.clips[0], stand);
        skeAnimation.createState(skeAnimation.clips[1], walk);
    }
    resetWithPos(ballPos: Vec3, doorPos: Vec3) {
        ballPos.y = 0;
        doorPos.y = 0;
        let vec: Vec3 = ballPos.clone().subtract(doorPos.clone());
        let rolePos = ballPos.add(vec.normalize().multiplyScalar(offsetBallDistance));
        this.node.setPosition(new Vec3(rolePos.x, 0, rolePos.z))
        this.node.forward = vec;
        const skeAnimation = this.node.getComponent(SkeletalAnimation);
        skeAnimation.play(stand);
    }
    arroundBall(ballPos: Vec3, clickPos: Vec3) {
        let vec = clickPos.subtract(ballPos)
        let rolePos = ballPos.add(vec.normalize().multiplyScalar(offsetBallDistance));
        this.node.setPosition(new Vec3(rolePos.x, 0, rolePos.z))
        this.node.forward = vec;
    }
    start() {
        // input.on(Input.EventType.KEY_DOWN, (event: EventKeyboard) => {
        //     if (event.keyCode === KeyCode.KEY_Q) {

        //         let rigidBody = this.getComponent(RigidBody);
        //         rigidBody.applyForce(new Vec3(300, 100, 0));
        //     }
        // });
        // input.on(Input.EventType.KEY_DOWN, (event: EventKeyboard) => {
        //     if (event.keyCode === KeyCode.KEY_W) {
        //         this.vertical = Vertical.Front;
        //     } else if (event.keyCode === KeyCode.KEY_S) {
        //         this.vertical = Vertical.Back;
        //     } else if (event.keyCode === KeyCode.KEY_A) {
        //         this.horizontal = Horizontal.Left;
        //     } else if (event.keyCode === KeyCode.KEY_D) {
        //         this.horizontal = Horizontal.Right;
        //     }
        // })
        // input.on(Input.EventType.KEY_UP, (event: EventKeyboard) => {
        //     if (event.keyCode === KeyCode.KEY_W ||
        //         event.keyCode === KeyCode.KEY_S) {
        //         this.vertical = Vertical.None;
        //     } else if (event.keyCode === KeyCode.KEY_A ||
        //         event.keyCode === KeyCode.KEY_D) {
        //         this.horizontal = Horizontal.None;
        //     }
        // })
    }

    update(deltaTime: number) {
        // let position = this.node.getPosition();

        // switch (this.vertical) {
        //     case Vertical.Back: {
        //         position.z += this.speed;
        //         break;
        //     }
        //     case Vertical.Front: {
        //         position.z -= this.speed;

        //         break
        //     }
        // }
        // switch (this.horizontal) {
        //     case Horizontal.Left: {
        //         position.x -= this.speed;
        //         break;
        //     }
        //     case Horizontal.Right: {
        //         position.x += this.speed;
        //         break;
        //     }
        // }
        // this.node.setPosition(position);

    }
}

