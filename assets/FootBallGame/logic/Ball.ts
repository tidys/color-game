import { _decorator, Component, Node, BoxCollider, SphereCollider, physics, RigidBody, Vec3, math, input, Input, Camera, EventTouch, geometry, PhysicsSystem, UITransform, Prefab, instantiate, Mat3, Mat4, tween, EventKeyboard, KeyCode, Quat } from 'cc';
import { FootBallGameData } from '../FootBallGameData';
const { ccclass, property } = _decorator;

@ccclass('Ball')
export class Ball extends Component {
    @property(Camera)
    camera: Camera;

    @property(Prefab)
    item: Prefab = null;

    preNode: Node = null;

    resetPosition() {
        this.node.setPosition(new Vec3(0, 2, 0));
        let rigidBody = this.node.getComponent(RigidBody);
        if (rigidBody) {
            rigidBody.clearVelocity()
            rigidBody.clearForces();
        }
    }
    start() {
        let rigidBody = this.getComponent(RigidBody);
        input.on(Input.EventType.TOUCH_START, (event: EventTouch) => {
            let ray = new geometry.Ray();
            this.camera.screenPointToRay(event.getLocationX(), event.getLocationY(), ray);

            if (PhysicsSystem.instance.raycastClosest(ray)) {
                let result = PhysicsSystem.instance.raycastClosestResult;
                if (result.collider.node === this.node) {
                    let force = new Vec3(0, 0.4, -1);
                    force.normalize().multiplyScalar(FootBallGameData.Force);

                    rigidBody.applyForce(force);
                }
            }
        });


        let boxCollider = this.getComponent(SphereCollider);
        if (boxCollider) {

            boxCollider.on("onCollisionEnter", (event: physics.ICollisionEvent) => {
                console.log("onCollisionEnter")
                event.otherCollider;

            });
            boxCollider.on("onTriggerEnter", () => {
                console.log("onTriggerEnter")
            });
        }
    }

    update(deltaTime: number) {

    }
}

