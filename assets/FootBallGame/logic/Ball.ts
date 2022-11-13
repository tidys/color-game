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
        this.node.setPosition(new Vec3(0, 12, 0));
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
                    arrow.worldPosition = new Vec3(this.node.worldPosition.x, 0.1, this.node.worldPosition.z);
                    this.node.parent.addChild(arrow);
                    this.arrowNode = arrow;

                    this.onTipsDirection();
                    // let force = new Vec3(0, 0.4, -1);
                    // force.normalize().multiplyScalar(FootBallGameData.Force);
                    // footBallGame.setGameState(GameState.BallMoving);
                    // rigidBody.applyForce(force);
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
            }

        };
        const touchEnd = () => {
            input.off(Input.EventType.TOUCH_MOVE, touchMove);
            input.off(Input.EventType.TOUCH_END, touchEnd);
            if (this.arrowNode) {
                this.arrowNode.removeFromParent()
                this.arrowNode = null;
            }

        }

        input.on(Input.EventType.TOUCH_MOVE, touchMove);
        input.on(Input.EventType.TOUCH_END, touchEnd);
    }
    update(deltaTime: number) {
        let rigidBody = this.node.getComponent(RigidBody);
        if (rigidBody.isSleeping) {
            if (footBallGame.getGameState() === GameState.BallMoving) {
                footBallGame.failed()
            }
        }
    }
}
