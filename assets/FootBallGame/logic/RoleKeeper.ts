import { _decorator, Component, Node, Vec3, Vec2, game, RigidBody, BoxCollider, TriggerEventType, physics, ICollisionEvent, Input, input, EventTouch, geometry, PhysicsSystem, tween } from 'cc';
import { footBallGame, FootBallGame } from '../FootBallGame';
import { Msg } from '../Msg';
import { Role } from './Role';
const { ccclass, property } = _decorator;

const moveRange = 3;// 门将的左右活动范围
const moveSpeed = 1.5;// 移动速度： 单位 米/s
const xDiff = 0.1;
const keeperPos = new Vec3(-48, 0, 0)
@ccclass('RoleKeeper')
export class RoleKeeper extends Role {
    onLoad() {
        super.onLoad()
        game.on(Msg.GameBegan, () => {
            this._watchBall = true;
            this.rigidBody.clearState();
            this.placeToKeeperPositon(keeperPos)
        })
        this.enabledBoxCollider(true)
        this.setDefaultGroup()
        this.collider.on('onCollisionEnter', (event: ICollisionEvent) => {
            const ball = footBallGame.getFootBall();
            const ballCollider = ball.getCollider()
            if (event.otherCollider === ballCollider) {
                ball.releaseForce()
                ball.node.setParent(this.handBallNode);
                ball.node.setPosition(new Vec3());
                ball.setStatic(true);
                console.log("守门员捉到球了")

                tween().target(this.node).delay(1).call(() => {
                    footBallGame.failed();
                }).start()
            }
        })
        input.on(Input.EventType.TOUCH_START, (event: EventTouch) => {
            let ray = new geometry.Ray();
            footBallGame.getMainCamera().getCamera().screenPointToRay(event.getLocationX(), event.getLocationY(), ray);
            if (PhysicsSystem.instance.raycastClosest(ray)) {
                let result = PhysicsSystem.instance.raycastClosestResult;
                if (result.collider === this.collider) {
                    console.log("click me")
                    this.rigidBody.applyLocalImpulse(new Vec3(3000, 3000, 0), new Vec3(0, 0.2, 0));
                }
            }
        }, this);
    }

    placeToKeeperPositon(keeperPos) {
        keeperPos.y = this.height / 2;
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
                if (Math.abs(selfPos.x - ballPos.x) < 2) {
                    // 球已经到脸前了，但是自己还是跑不过去，直接扑过去
                    this._watchBall = false;
                    // y, z方向
                    let selfVec2 = new Vec2(selfPos.y, selfPos.z);
                    let ballVec2 = new Vec2(ballPos.y, ballPos.z);
                    let dis = Vec2.distance(selfVec2, ballVec2);
                    let vec = ballVec2.subtract(selfVec2).normalize();
                    // 扑的力度
                    vec = vec.multiplyScalar(Math.min(dis * 6000, 10000));
                    this.rigidBody.applyImpulse(new Vec3(selfPos.x, vec.x, vec.y), new Vec3(0, 0.7, 0));

                } else {
                    // 没有到脸前，继续左右移动
                    if (selfPos.z > ballPos.z) {
                        selfPos.z -= moveSpeed * dt;
                    } else {
                        selfPos.z += moveSpeed * dt;
                    }
                    // 不能超过活动范围
                    if (selfPos.z >= moveRange) {
                        selfPos.z = moveRange;
                    }
                    if (selfPos.z < -moveRange) {
                        selfPos.z = -moveRange;
                    }
                    this.node.setPosition(selfPos)
                }
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

