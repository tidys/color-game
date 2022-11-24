import { _decorator, Component, Node, Input, input, EventKeyboard, KeyCode, RigidBody, Vec3, SkeletalAnimation, tween, BoxCollider, Vec2, game } from 'cc';
import { Msg } from '../Msg';
import { RoleAnimation } from './RoleAnimation';

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

export enum Type {
    None,
    Keeper,
    Player,
}
export enum Team {
    None,
    Read,
    Blue,
}
export const offsetBallDistance = 2;
@ccclass('Role')
export class Role extends Component {
    isWalking = false;
    horizontal: Horizontal = Horizontal.None;
    vertical: Vertical = Vertical.None;
    speed = 0.1;

    @property(SkeletalAnimation)
    skeleta: SkeletalAnimation = null;

    _roleAnimation: RoleAnimation = null;

    _type: Type = Type.None;
    _team: Team = Team.None;

    onLoad() {
        this._roleAnimation = this.node.addComponent(RoleAnimation);
        this._roleAnimation.initSkeleta(this.skeleta);
        this.enabledBoxCollider(true);

        game.on(Msg.GameBegan, () => {
            this._roleAnimation.stand()
            this.enabledBoxCollider(true);

        })
    }
    init(type: Type, team: Team) {
        this._type = type;
        this._team = team;
    }
    resetWithPos(ballPos: Vec3, doorPos: Vec3) {
        ballPos.y = 0;
        doorPos.y = 0;
        let vec: Vec3 = ballPos.clone().subtract(doorPos.clone());
        let rolePos = ballPos.add(vec.normalize().multiplyScalar(offsetBallDistance));
        this.node.setPosition(new Vec3(rolePos.x, 0, rolePos.z))
        this.node.forward = vec;
        this._roleAnimation.stand()
        this.enabledBoxCollider(true);
    }
    placeToKeeperPositon(keeperPos) {
        this.node.setPosition(keeperPos);
        let v2 = new Vec2(keeperPos.x, keeperPos.z);
        v2.normalize()
        this.node.forward = new Vec3(v2.x, 0, v2.y);
    }
    enabledBoxCollider(enabled: boolean) {
        const collider = this.node.getComponent(BoxCollider);
        if (collider) {
            collider.enabled = enabled;
        }
        const body = this.node.getComponent(RigidBody);
        if (body) {
            body.enabled = enabled;
        }
    }
    arroundBall(ballPos: Vec3, clickPos: Vec3) {
        ballPos.y = 0;
        clickPos.y = 0;
        let vec = clickPos.subtract(ballPos)
        let rolePos = ballPos.add(vec.normalize().multiplyScalar(offsetBallDistance));
        this.node.setPosition(new Vec3(rolePos.x, 0, rolePos.z))
        this.node.forward = vec;
    }
    gotoShoot(ballPos: Vec3, cb?: Function) {
        this.enabledBoxCollider(false);
        ballPos.y = 0;
        this._roleAnimation.walk();
        tween().target(this.node)
            .to(0.8, { position: ballPos })
            .call(() => {
                this._roleAnimation.stand()
                cb && cb();
            })
            .delay(0.5)
            .call(() => {
                this.enabledBoxCollider(true)
            })
            .start()
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

