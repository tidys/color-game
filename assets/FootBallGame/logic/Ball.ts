import { _decorator, Component, Node, BoxCollider, SphereCollider, physics, RigidBody, Vec3, math, input, Input, Camera, EventTouch, geometry, PhysicsSystem, UITransform, Prefab, instantiate, Mat3, Mat4, tween, EventKeyboard, KeyCode, Quat, game, Vec2 } from 'cc';
import { footBallGame, GameState } from '../FootBallGame';
import { FootBallGameData } from '../FootBallGameData';
import { Msg } from '../Msg';
const { ccclass, property } = _decorator;

@ccclass('Ball')
export class Ball extends Component {
    @property(Camera)
    camera: Camera;

    @property(Prefab)
    arrowPrefab: Prefab = null;

    arrowNode: Node = null;

    resetPosition() {
        this.node.setPosition(new Vec3(-44, 1, 0));
        let rigidBody = this.node.getComponent(RigidBody);
        if (rigidBody) {
            rigidBody.clearVelocity()
            rigidBody.clearForces();
        }
    }
    onLoad() {
        game.on(Msg.ResetGame, () => {
            this.resetPosition();
        })


        let rigidBody = this.getComponent(RigidBody);
        input.on(Input.EventType.TOUCH_START, (event: EventTouch) => {
            let ray = new geometry.Ray();
            this.camera.screenPointToRay(event.getLocationX(), event.getLocationY(), ray);

            if (PhysicsSystem.instance.raycastClosest(ray)) {
                let result = PhysicsSystem.instance.raycastClosestResult;
                if (result.collider.node === this.node) {
                    let arrow = instantiate(this.arrowPrefab);
                    arrow.forward = new Vec3(0, 0, -1);
                    arrow.setScale(1, 1, 1);
                    arrow.worldPosition = new Vec3(this.node.worldPosition.x, 0.001, this.node.worldPosition.z);
                    this.node.parent.addChild(arrow);
                    this.arrowNode = arrow;

                    this.onTipsDirection();
                }
            }
        });


        let boxCollider = this.getComponent(SphereCollider);
        if (boxCollider) {

            boxCollider.on("onCollisionEnter", (event: physics.ICollisionEvent) => {
                // console.log("onCollisionEnter")
                event.otherCollider;

            });
            boxCollider.on("onTriggerEnter", () => {
                // console.log("onTriggerEnter")
            });
        }
    }
    shoot() {
        const rigidBody = this.getComponent(RigidBody);
        let force = new Vec3(FootBallGameData.Direction.x, 0.4, FootBallGameData.Direction.z);
        force.normalize().multiplyScalar(FootBallGameData.Force);
        footBallGame.setGameState(GameState.BallMoving);
        rigidBody.wakeUp();

        // rigidBody.applyForce(new Vec3(-6000, 0, 0));// 添加一个可持续力
        rigidBody.applyImpulse(force, new Vec3(0, 0, 0));// 添加一个瞬间冲击力，
        if (rigidBody.isAwake) {
            // console.log("添加扭矩成功")
            let v = FootBallGameData.Offset;
            // rigidBody.applyTorque(new Vec3(1, v, 1))
        }
    }
    onTipsDirection() {
        const touchMove = (event: EventTouch) => {
            const arrowPosVec3 = this.arrowNode.getPosition();
            const arrowPosVec2 = new Vec2(arrowPosVec3.x, arrowPosVec3.z)

            let ray = new geometry.Ray();
            this.camera.screenPointToRay(event.getLocationX(), event.getLocationY(), ray);
            if (PhysicsSystem.instance.raycastClosest(ray)) {
                let result = PhysicsSystem.instance.raycastClosestResult;
                // TODO 得点住地面
                const touchVec2 = new Vec2(result.hitPoint.x, result.hitPoint.z);
                let vec = arrowPosVec2.subtract(touchVec2);
                this.arrowNode.forward = new Vec3(vec.x, 0, vec.y);
                const scale = this.arrowNode.getScale();
                scale.z = vec.length() + 2;
                this.arrowNode.setScale(scale);
            }

        };
        const touchEnd = () => {
            input.off(Input.EventType.TOUCH_MOVE, touchMove);
            input.off(Input.EventType.TOUCH_END, touchEnd);
            FootBallGameData.Direction = this.arrowNode.forward;
            FootBallGameData.Force;
            if (this.arrowNode) {
                this.arrowNode.removeFromParent()
                this.arrowNode = null;
            }
            // 显示踢小球的哪个部分界面
            // game.emit(Msg.ShowKicking);
            this.shoot()

        }

        input.on(Input.EventType.TOUCH_MOVE, touchMove);
        input.on(Input.EventType.TOUCH_END, touchEnd);
    }
    update(deltaTime: number) {
        if (footBallGame.getGameState() === GameState.BallMoving) {
            let rigidBody = this.node.getComponent(RigidBody);
            if (rigidBody.isSleeping) {
                footBallGame.failed()
            } else {
                // 运动的过程中施加一个瞬时力来实现香蕉球
                rigidBody.applyImpulse(new Vec3(FootBallGameData.Offset, 0, 0));
            }
        } else {

        }
    }
}

