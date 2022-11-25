import { _decorator, Component, Node, BoxCollider, ITriggerEvent, tween } from 'cc';
import { footBallGame } from '../FootBallGame';
const { ccclass, property } = _decorator;

@ccclass('Gym')
export class Gym extends Component {
    @property(Node)
    wall: Node = null;

    onLoad() {
        const colliders = this.wall.getComponents(BoxCollider);
        for (let i = 0; i < colliders.length; i++) {
            const collider = colliders[i];
            collider.isTrigger = true;
            collider.on("onTriggerEnter", (event: ITriggerEvent) => {
                const ballCollider = footBallGame.getFootBall().getCollider();
                if (event.otherCollider === ballCollider) {
                    console.log('出界了')
                    tween().target(this.node).delay(1).call(() => {
                        footBallGame.failed();
                    }).start()
                }
            })
        }

    }

    update(deltaTime: number) {

    }
}

