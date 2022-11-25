import { _decorator, Component, Node, Input, input, EventKeyboard, KeyCode, RigidBody, Vec3, SkeletalAnimation, tween, BoxCollider, Vec2, game, MeshCollider, Collider, ERigidBodyType } from 'cc';
import { Msg } from '../Msg';
import { RoleAnimation } from './RoleAnimation';
import { RoleCfg } from './RoleCfg';

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

const Group = {
    Default: 1 << 0,
    Ball: 1 << 1,
    Ground: 1 << 2,
    Nothing: 1 << 3,
    DoorHole: 1 << 4,
}

export const offsetBallDistance = 4;
@ccclass('Role')
export class Role extends Component {
    isWalking = false;
    horizontal: Horizontal = Horizontal.None;
    vertical: Vertical = Vertical.None;
    speed = 0.1;

    _roleAnimation: RoleAnimation = null;

    _type: Type = Type.None;
    _team: Team = Team.None;
    collider: Collider | null = null;
    rigidBody: RigidBody | null = null;
    protected height = 1.8;// 身高
    protected mass = 3000;// 体重

    @property(Node)
    handBallNode: Node = null;

    onLoad() {
        this._roleAnimation = this.node.addComponent(RoleAnimation);
        const cfg = this.node.getComponent(RoleCfg)
        this._roleAnimation.initSkeleta(cfg.skeleta);
        this.enabledBoxCollider(true);
        this.collider = cfg.collider;
        this.rigidBody = cfg.rigidBody;
        this.handBallNode = cfg.handBallNode;

        this.rigidBody.mass = this.mass;
        game.on(Msg.GameBegan, () => {
            this._roleAnimation.stand()
            this.enabledBoxCollider(true);
        })
        this.setNothingGroup()
    }
    rigidBodyStatic() {
        this.rigidBody.type = ERigidBodyType.STATIC;
    }
    rigidBodyDynamic() {
        this.rigidBody.type = ERigidBodyType.DYNAMIC;
    }
    setDefaultGroup() {
        this._updateGroup(Group.Default);
    }
    setNothingGroup() {
        this._updateGroup(Group.Nothing)
    }
    private _updateGroup(group) {
        const rigidBody = this.getComponent(RigidBody);
        if (rigidBody) {
            rigidBody.group = group;
        }
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
        this.node.setPosition(new Vec3(rolePos.x, this.height / 2, rolePos.z))
        this.node.forward = vec;
        this._roleAnimation.stand()
        this.enabledBoxCollider(true);
    }

    enabledBoxCollider(enabled: boolean) {
        this.collider && (this.collider.enabled = enabled);
        this.rigidBody && (this.rigidBody.enabled = enabled);
    }
    arroundBall(ballPos: Vec3, clickPos: Vec3) {
        ballPos.y = 0;
        clickPos.y = 0;
        let vec = clickPos.subtract(ballPos)
        let rolePos = ballPos.add(vec.normalize().multiplyScalar(offsetBallDistance));
        this.node.setPosition(new Vec3(rolePos.x, this.height / 2, rolePos.z))
        this.node.forward = vec;
    }
    gotoShoot(ballPos: Vec3, cb?: Function) {
        this.enabledBoxCollider(false);
        ballPos.y = this.height / 2;
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

