import { _decorator, Component, Node, BoxCollider, CCBoolean } from 'cc';
import { footBallGame } from '../FootBallGame';
const { ccclass, property } = _decorator;

@ccclass('BallDoor')
export class BallDoor extends Component {
    @property(BoxCollider)
    collider: BoxCollider = null;
    @property(CCBoolean)
    isTrigger = false;
    start() {
        this.collider.isTrigger = this.isTrigger;
        this.collider.on("onTriggerEnter", () => {
            this.onShootingIn();
        })
        this.collider.on("onCollisionEnter", () => {
            this.onShootingIn()
        })
    }

    update(deltaTime: number) {

    }
    onShootingIn() {
        footBallGame.shootingIn();
    }
}

