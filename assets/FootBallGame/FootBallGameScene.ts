import { _decorator, Component, Node, input, Camera, Vec3, Input, EventKeyboard, KeyCode } from 'cc';
import { footBallGame } from './FootBallGame';
import { Ball } from './logic/Ball';
import { Role } from './logic/Role'

const { ccclass, property } = _decorator;

@ccclass('SceneComponent')
export class SceneComponent extends Component {
    @property(Role)
    role: Role = null;

    @property(Camera)
    camera: Camera = null;

    @property(Ball)
    ball: Ball = null;
    start() {
        footBallGame.setFootBall(this.ball);
        footBallGame.reset()
    }
    onLoad() {

    }
    update(deltaTime: number) {
        if (this.camera && this.role) {
            let pox = this.role.node.getPosition();
            let cameraPos = this.camera.node.getPosition();
            cameraPos.x = pox.x;
            this.camera.node.setPosition(cameraPos);
        }
    }
}
