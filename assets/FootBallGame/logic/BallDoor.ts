import { _decorator, Component, Node, BoxCollider, CCBoolean, game, tween } from 'cc';
import { footBallGame } from '../FootBallGame';
import { Msg } from '../Msg';
const { ccclass, property } = _decorator;

@ccclass('BallDoor')
export class BallDoor extends Component {
    @property({ type: BoxCollider, displayName: "进球的碰撞体" })
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
        game.on(Msg.ShootingIn, () => {
            tween().target(this).delay(1).call(() => {
                game.emit(Msg.ResetGame);
            }).start()
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

