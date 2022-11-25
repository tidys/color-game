import { _decorator, Component, Node, BoxCollider, SphereCollider, physics, RigidBody, Vec3, math, input, Input, Camera, EventTouch, geometry, PhysicsSystem, UITransform, Prefab, instantiate, Mat3, Mat4, tween, EventKeyboard, KeyCode, Quat, game, Vec2, PlaneCollider, Collider, ERigidBodyType } from 'cc';
import { footBallGame, GameState } from '../FootBallGame';
import { FootBallGameData } from '../FootBallGameData';
import { Msg } from '../Msg';
import { Role } from './Role';
const { ccclass, property } = _decorator;

@ccclass('Ball')
export class Ball extends Component {
    private rigidBody: RigidBody = null;
    private collider: Collider = null;
    resetPosition() {
        this.node.setParent(footBallGame.worldNode)
        this.node.setPosition(new Vec3(-40, 1, 0));
        this.releaseForce()
        this.setStatic(false)
    }
    releaseForce() {
        let rigidBody = this.node.getComponent(RigidBody);
        if (rigidBody) {
            rigidBody.clearVelocity()
            rigidBody.clearForces();
            rigidBody.clearState()
        }
    }

    setStatic(b) {
        if (b) {
            this.rigidBody.type = ERigidBodyType.STATIC;
            this.rigidBody.enabled = false;
            this.collider.enabled = false;
        } else {
            this.rigidBody.type = ERigidBodyType.DYNAMIC;
            this.rigidBody.enabled = true;
            this.collider.enabled = true;
        }

    }
    getCollider() {
        return this.collider;
    }
    onLoad() {
        game.on(Msg.ResetGame, () => {
            this.resetPosition();
        })

        this.rigidBody = this.getComponent(RigidBody);
        this.collider = this.getComponent(SphereCollider)
    }
    shoot() {
        const rigidBody = this.getComponent(RigidBody);
        const force = FootBallGameData.getShortForce();
        footBallGame.setGameState(GameState.BallMoving);
        rigidBody.wakeUp();
        // rigidBody.applyForce(new Vec3(-6000, 0, 0));// 添加一个可持续力
        // rigidBody.applyTorque(new Vec3(1, v, 1))
        rigidBody.applyImpulse(force, new Vec3(0, 0, 0));// 添加一个瞬间冲击力，
    }

    update(deltaTime: number) {
        if (footBallGame.getGameState() === GameState.BallMoving) {
            if (this.rigidBody.isSleeping) {
                footBallGame.failed()
            } else {
                if (FootBallGameData.enabledBanana) {
                    // 运动的过程中施加一个瞬时力来实现香蕉球，方向为人与球方向的法线
                    const v = FootBallGameData.getBananaVec()
                    this.rigidBody.applyImpulse(v);
                }
            }
        } else {

        }
    }
}

