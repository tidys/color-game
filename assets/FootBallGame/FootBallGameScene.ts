import { _decorator, Component, Node, input, Camera, Vec3, Input, EventKeyboard, KeyCode, game, PlaneCollider, Prefab, PhysicsSystem, geometry, instantiate, EventTouch, Vec2, tween, view, setDisplayStats } from 'cc';
import { footBallGame } from './FootBallGame';
import { GameCamera } from './FootBallGameCamera';
import { FootBallGameData } from './FootBallGameData';
import { Ball } from './logic/Ball';
import { Role } from './logic/Role'
import { Msg } from './Msg';

const { ccclass, property } = _decorator;

@ccclass('SceneComponent')
export class SceneComponent extends Component {

    @property({ type: Prefab, displayName: "球员" })
    rolePrefab: Prefab = null

    role: Role = null;

    @property({ type: Node, displayName: "球门" })
    door: Node = null;

    @property({ type: Ball, displayName: "球" })
    ball: Ball = null;

    @property({ type: PlaneCollider, displayName: "球场" })
    spaceCollider: PlaneCollider = null;

    @property(GameCamera)
    gameCamera: GameCamera = null;

    @property(Prefab)
    arrowPrefab: Prefab = null;

    private arrowNode: Node = null;


    start() {
        footBallGame.setFootBall(this.ball);
        footBallGame.reset()
        // game.emit(Msg.ShowKicking);
    }
    onLoad() {
        const roleNode = instantiate(this.rolePrefab);
        this.role = roleNode.getComponent(Role);
        this.node.parent.addChild(roleNode);

        setDisplayStats(false)
        game.on(Msg.ResetGame, () => {
            this.role.resetWithPos(this.ball.node.getPosition(), this.door.getPosition())
            input.off(Input.EventType.TOUCH_START, this.touchToEnsureDirection, this);
            input.on(Input.EventType.TOUCH_START, this.touchToEnsureDirection, this);
        })
        game.on(Msg.GotoShoot, () => {
            this.role.gotoShoot(this.ball.node.getPosition(), () => {
                this.gameCamera.shake();
                this.ball.shoot()
            })
        })
    }
    private touchToEnsureDirection(event: EventTouch) {
        let ray = new geometry.Ray();
        this.gameCamera.getCamera().screenPointToRay(event.getLocationX(), event.getLocationY(), ray);

        if (PhysicsSystem.instance.raycastClosest(ray)) {
            let result = PhysicsSystem.instance.raycastClosestResult;
            if (result.collider === this.spaceCollider) {
                let arrow = instantiate(this.arrowPrefab);
                arrow.forward = new Vec3(0, 0, -1);
                arrow.setScale(1, 1, 1);
                arrow.worldPosition = new Vec3(this.ball.node.worldPosition.x, 0.001, this.ball.node.worldPosition.z);
                this.node.parent.addChild(arrow);
                this.arrowNode = arrow;

                this.updateArrowForward(event);
                input.off(Input.EventType.TOUCH_START, this.touchToEnsureDirection, this);
                this.onTipsDirection();
            }
        }
    }
    private updateArrowForward(event: EventTouch) {
        const arrowPosVec3 = this.arrowNode.getPosition();
        const arrowPosVec2 = new Vec2(arrowPosVec3.x, arrowPosVec3.z)

        let ray = new geometry.Ray();
        this.gameCamera.getCamera().screenPointToRay(event.getLocationX(), event.getLocationY(), ray);
        if (PhysicsSystem.instance.raycast(ray)) {
            let results = PhysicsSystem.instance.raycastResults;
            for (let i = 0; i < results.length; i++) {
                let result = results[i];
                // 点击到了球场
                if (result.collider === this.spaceCollider) {
                    const touchVec2 = new Vec2(result.hitPoint.x, result.hitPoint.z);
                    let vec = arrowPosVec2.subtract(touchVec2);
                    this.arrowNode.forward = new Vec3(vec.x, 0, vec.y);
                    const scale = this.arrowNode.getScale();
                    scale.z = vec.length() + 2;
                    this.arrowNode.setScale(scale);

                    this.role.arroundBall(this.ball.node.getPosition(), result.hitPoint)
                }
            }
        }
    }
    onTipsDirection() {
        const touchMove = (event: EventTouch) => {
            this.updateArrowForward(event);
        };
        const touchEnd = () => {
            input.off(Input.EventType.TOUCH_MOVE, touchMove);
            input.off(Input.EventType.TOUCH_END, touchEnd);
            FootBallGameData.Direction = this.arrowNode.forward;
            FootBallGameData.Force;
            if (this.arrowNode) {
                this.arrowNode.removeFromParent()
                this.arrowNode = null;
            }
            // 显示踢小球的哪个部分界面
            // game.emit(Msg.ShowKicking);
            game.emit(Msg.GotoShoot);

        }

        input.on(Input.EventType.TOUCH_MOVE, touchMove);
        input.on(Input.EventType.TOUCH_END, touchEnd);
    }

    update(deltaTime: number) {

    }
}

