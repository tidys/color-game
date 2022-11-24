import { _decorator, Component, Node, Vec3, Vec2, game, RigidBody, BoxCollider, TriggerEventType, physics, ICollisionEvent } from 'cc';
import { footBallGame, FootBallGame } from '../FootBallGame';
import { Msg } from '../Msg';
import { Role } from './Role';
const { ccclass, property } = _decorator;

const moveRange = 3;// 门将的左右活动范围
const moveSpeed = 1;// 移动速度： 单位 米/s
const xDiff = 0.1;




@ccclass('RoleKeeper')
export class RoleKeeper extends Role {

    onLoad() {
        super.onLoad()
        game.on(Msg.GameBegan, () => {

            this._watchBall = true;
        })
        this.enabledBoxCollider(true)
        this.setDefaultGroup()
        const collider = this.getComponent(BoxCollider)
        if (collider) {
            collider.on('onCollisionEnter', (event: ICollisionEvent) => {
                const ballCollider = footBallGame.getFootBall().getCollider()
                if (event.otherCollider === ballCollider) {
                    console.log("守门员捉到球了")
                    footBallGame.failed();
                }
            })
        }
    }

    placeToKeeperPositon(keeperPos) {
        const offset = 0.5;
        const vec = (new Vec3()).subtract(keeperPos.clone()).normalize();
        const newPos = keeperPos.clone().add(vec.multiplyScalar(offset));
        this.node.setPosition(newPos);

        let v2 = new Vec2(keeperPos.x, keeperPos.z);
        v2.normalize()
        this.node.forward = new Vec3(v2.x, 0, v2.y);
    }
    private _watchBall = true;
    update(dt: number) {
        this.enabledBoxCollider(true)

        if (this._watchBall) {
            const ballPos: Vec3 = footBallGame.getFootBall().node.getPosition();
            const selfPos = this.node.getPosition()
            // 始终和球的z方向一致
            if (Math.abs(selfPos.z - ballPos.z) > xDiff) {
                if (selfPos.z > ballPos.z) {
                    selfPos.z -= moveSpeed * dt;
                } else {
                    selfPos.z += moveSpeed * dt;
                }
                this.node.setPosition(selfPos)
            }
            // 具体非常近了，判断是否需要跳起来
            // let dis = Vec3.distance(ballPos, selfPos);
            // if (dis < 1) {
            //     this._watchBall = false;
            //     this.catchBall()
            // }
        }
    }
    private catchBall() {
        const ballPos: Vec3 = footBallGame.getFootBall().node.getPosition();
        const selfPos = this.node.getPosition()
        console.log("catch ball")
    }
}

