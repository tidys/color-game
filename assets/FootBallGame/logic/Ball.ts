import { _decorator, Component, Node, BoxCollider, SphereCollider, physics, RigidBody, Vec3, math, input, Input, Camera, EventTouch, geometry, PhysicsSystem, UITransform, Prefab, instantiate, Mat3, Mat4, tween, EventKeyboard, KeyCode, Quat, game, Vec2, PlaneCollider } from 'cc';
import { footBallGame, GameState } from '../FootBallGame';
import { FootBallGameData } from '../FootBallGameData';
import { Msg } from '../Msg';
import { Role } from './Role';
const { ccclass, property } = _decorator;

@ccclass('Ball')
export class Ball extends Component {

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
        // rigidBody.applyTorque(new Vec3(1, v, 1))
        rigidBody.applyImpulse(force, new Vec3(0, 0, 0));// 添加一个瞬间冲击力，
    }

    update(deltaTime: number) {
        if (footBallGame.getGameState() === GameState.BallMoving) {
            let rigidBody = this.node.getComponent(RigidBody);
            if (rigidBody.isSleeping) {
                footBallGame.failed()
            } else {
                // 运动的过程中施加一个瞬时力来实现香蕉球
                // rigidBody.applyImpulse(new Vec3(FootBallGameData.Offset, 0, 0));
            }
        } else {

        }
    }
}

