import { _decorator, Component, Node, Vec2, Vec3, tween, ICollisionEvent } from 'cc';
import { footBallGame } from '../FootBallGame';
import { Role } from './Role';
const { ccclass, property } = _decorator;

@ccclass('RoleBlock')
export class RoleBlock extends Role {
    onLoad() {
        super.onLoad()
        this.enabledBoxCollider(true)
        this.setDefaultGroup()
        this.collider.on("onCollisionEnter", (event: ICollisionEvent) => {
            if (event.otherCollider === footBallGame.getFootBall().getCollider())
                if (footBallGame.isGamePlaying()) {
                    footBallGame.setGameFinish()
                    tween().target(this.node).delay(1).call(() => {
                        footBallGame.failed();
                    }).start()
                }
        })
    }

    update(deltaTime: number) {

    }
    initWithPostion(pos: Vec3, rolePos: Vec3) {
        console.log(rolePos)
        const p = new Vec3(pos.x, this.height / 2, pos.z);
        this.node.setPosition(p);

        // 这里模型有点问题，z轴反了
        let forward = pos.clone().subtract(rolePos.clone()).normalize()
        forward.y = 0;
        this.node.forward = forward
    }
}

