import { _decorator, Component, Node, BoxCollider, CCBoolean, game } from 'cc';
import { footBallGame } from '../FootBallGame';
import { Msg } from '../Msg';
const { ccclass, property } = _decorator;

@ccclass('BallDoor')
export class BallDoor extends Component {
    @property(BoxCollider)
    collider: BoxCollider = null;
    @property(CCBoolean)
    isTrigger = false;
    onLoad() {
        game.on(Msg.ResetGame, () => {
            this.collider.isTrigger = this.isTrigger;
            this.collider.off("onCollisionEnter", this.onShootingIn, this)
            this.collider.off("onTriggerEnter", this.onShootingIn, this)
            this.collider.on("onCollisionEnter", this.onShootingIn, this)
            this.collider.on("onTriggerEnter", this.onShootingIn, this)
        })
    }

    update(deltaTime: number) {

    }
    onShootingIn() {
        this.collider.off("onCollisionEnter", this.onShootingIn, this)
        this.collider.off("onTriggerEnter", this.onShootingIn, this)

        footBallGame.shootingIn();
    }
}

