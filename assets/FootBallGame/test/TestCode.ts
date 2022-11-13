import { _decorator, Component, Node, BoxCollider, SphereCollider, physics, RigidBody, Vec3, math, input, Input, Camera, EventTouch, geometry, PhysicsSystem, UITransform, Prefab, instantiate, Mat3, Mat4, tween, EventKeyboard, KeyCode, Quat } from 'cc';
const { ccclass, property } = _decorator;

export class TestCode extends Component {
    @property(Prefab)
    item: Prefab = null;

    start() {
        let nodes = [];
        let arr = [new Vec3(0, -1, -0.1), new Vec3(0, 0, 1), new Vec3(0, 0, -1),

        new Vec3(-1, 0, 1), new Vec3(-1, 0, -1),
        new Vec3(0, 1, 0), new Vec3(0, -1, 0),];
        for (let i = 0; i < arr.length; i++) {
            let node = instantiate(this.item);
            let scale = 0.1;
            node.setScale(scale, scale, scale);
            node.setPosition(i * 1.4, 4, 0);
            node.forward = arr[i];
            this.node.parent.addChild(node);
            nodes.push(node);
        }
        input.on(Input.EventType.KEY_DOWN, (event: EventKeyboard) => {
            let node = null;
            if (event.keyCode === KeyCode.KEY_Z) {
                node = nodes[0];
            } else if (event.keyCode === KeyCode.KEY_X) {
                node = nodes[1];
            } else if (event.keyCode === KeyCode.KEY_C) {
                node = nodes[2];
            } else if (event.keyCode === KeyCode.KEY_V) {
                nodes[0].forward = new Vec3(-1, 0, 1);
            }
            if (node) {
                let newPos = node.getPosition().add(node.forward.multiplyScalar(1));
                console.log(newPos)
                node.setPosition(newPos);
                console.log(node.getPosition());
            }
        })
        input.on(Input.EventType.KEY_PRESSING, (event: EventKeyboard) => {
            if (event.keyCode === KeyCode.SPACE) {
                let ret = new Quat();
                Quat.rotateY(ret, this.node.rotation.clone(), 0.1);
                this.node.setRotation(ret);
            }
        });
    }
    preNode: Node = null
    test() {
        let result: physics.PhysicsRayResult = null;
        let force = result.hitNormal;
        // force.multiplyScalar(-100);
        // rigidBody.applyForce(force);


        let node = instantiate(this.item);
        let pos = result.hitPoint.add(result.hitNormal.clone().multiplyScalar(.001))
        pos = result.hitPoint;
        node.worldPosition = result.hitPoint;
        let scale = 0.1;
        node.setScale(scale, scale, scale)
        node.setParent(this.node.parent);
        if (this.preNode) {
            this.preNode.removeFromParent()
        }
        this.preNode = node;

        // let worldMatrix = node.worldMatrix.clone();
        // Mat4.invert(worldMatrix,)
        // node.setPosition(pos);
        // node.forward = result.hitNormal.clone().multiplyScalar(-1);
        node.forward = new Vec3(0, 1, 0);//result.hitNormal.clone();
        console.log(node.forward);
        // this.node.addChild(node);
    }
}