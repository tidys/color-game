import { _decorator, Component, Node, SkeletalAnimation, BoxCollider, RigidBody, MeshCollider, Collider } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('RoleCfg')
export class RoleCfg extends Component {
    @property(SkeletalAnimation)
    skeleta: SkeletalAnimation = null;

    @property(Collider)
    collider: Collider = null;

    @property(RigidBody)
    rigidBody: RigidBody = null;

    @property(Node)
    handBallNode: Node = null;
}

