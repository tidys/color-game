import { _decorator, Component, Node, input, Camera, Vec3, Input, EventKeyboard, KeyCode, game, PlaneCollider, Prefab, PhysicsSystem, geometry, instantiate, EventTouch, Vec2, tween, view, setDisplayStats, QuadRenderData, Quat } from 'cc';
import { footBallGame } from './FootBallGame';
import { GameCamera } from './FootBallGameCamera';
import { FootBallGameData } from './FootBallGameData';
import { ILevelConfig } from './LevelData';
import { Ball } from './logic/Ball';
import { Role, Team, Type } from './logic/Role'
import { RoleBlock } from './logic/RoleBlock';
import { RoleKeeper } from './logic/RoleKeeper';
import { Msg } from './Msg';
import { TipsDirectionAndForce } from './ui/TipsDirectionAndForce';
import { UIOptions, UIType } from './ui/UI';

const { ccclass, property } = _decorator;

@ccclass('SceneComponent')
export class SceneComponent extends Component {

    @property({ type: Prefab, displayName: "球员" })
    rolePrefab: Prefab = null

    role: Role = null;

    keeper: RoleKeeper = null;
    blocks: RoleBlock[] = [];

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

    private sceneRootNode: Node = null;
    start() {
        footBallGame.setFootBall(this.ball);
        footBallGame.setMainCamera(this.gameCamera);

        // game.emit(Msg.ShowKicking);
        game.emit(Msg.ShowUI, { type: UIType.WellCome } as UIOptions)
        // game.emit(Msg.EnterLevel, 10)
    }
    onLoad() {
        this.sceneRootNode = this.node.parent;
        footBallGame.worldNode = this.sceneRootNode;

        setDisplayStats(false)

        // 玩家自己
        this._initReadPlayer()

        game.on(Msg.ResetGame, () => {
            game.emit(Msg.GameBegan);
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
        game.on(Msg.ShowLevel, () => {
            game.emit(Msg.ExitGame)
            game.emit(Msg.ShowUI, { type: UIType.Level })

        })
        game.on(Msg.EnterLevel, (levelID?: number) => {
            footBallGame.setLevelID(levelID);
            let cfg = footBallGame.getLevelConfig();
            // 默认配置
            let defaultCfg: ILevelConfig = {
                id: 0, keeper: false,
                camera: {
                    pos: new Vec3(-25, 8, 0),
                    rotation: new Quat(0.19, -0.68, -0.196, -0.67)
                },
                ball: { position: new Vec3(-40, 1, 0) }
            };
            cfg = Object.assign(defaultCfg, cfg)

            // 球和人
            this.ball.resetPosition();
            this.role.resetWithPos(this.ball.node.getPosition(), this.door.getPosition())

            // 守门员
            if (cfg.keeper) {
                this._createKeeper();
            } else {
                this._removeKeeper()
            }
            // 阻挡的队员
            this._removeBlocks()
            if (cfg.block) {
                for (let i = 0; i < cfg.block.pos.length; i++) {
                    const item = cfg.block.pos[i];
                    this._createBolck(item)
                }
            }
            if (cfg.camera) {
                this.gameCamera.updateCamera(cfg.camera.pos, cfg.camera.rotation)
            }
            game.emit(Msg.CleanUI);
            // 场景提示
            if (cfg.tips?.scene) {
                game.emit(Msg.ShowUI, { type: UIType.TipsDirectionAndForce });
            }
            footBallGame.reset()
            game.emit(Msg.EnterGame);
        })
        game.on(Msg.ShootingIn, () => {
            tween().target(this).delay(1).call(() => {
                game.emit(Msg.ShowLevel);
            }).start()
        })
        this._initShortKey()
    }
    private _initShortKey() {
        input.on(Input.EventType.KEY_DOWN, (event: EventKeyboard) => {
            if (event.keyCode === KeyCode.KEY_R) {
                footBallGame.reset()
            }
        })
    }
    private _initReadPlayer() {
        const roleNode = instantiate(this.rolePrefab);
        let script = roleNode.getComponent(Role);
        if (!script) {
            script = roleNode.addComponent(Role)
        }
        this.role = script;
        this.sceneRootNode.addChild(roleNode);
        this.role.init(Type.Player, Team.Read);

    }
    private _removeKeeper() {
        if (this.keeper) {
            this.keeper.node.destroy();
            this.keeper = null;
        }
    }
    private _removeBlocks() {
        for (let i = 0; i < this.blocks.length; i++) {
            const block = this.blocks[i];
            block.node.destroy()
        }
        this.blocks = []
    }
    private _createBolck(pos: Vec3) {
        const node = instantiate(this.rolePrefab);
        let script = node.getComponent(RoleBlock)
        if (!script) {
            script = node.addComponent(RoleBlock)
        }
        this.sceneRootNode.addChild(node);
        script.initWithPostion(pos, this.role.node.getPosition())
        this.blocks.push(script)
    }
    private _createKeeper() {
        if (!this.keeper) {
            const keeperNode = instantiate(this.rolePrefab);
            let script = keeperNode.getComponent(RoleKeeper)
            if (!script) {
                script = keeperNode.addComponent(RoleKeeper);
            }
            this.keeper = script;
            this.sceneRootNode.addChild(keeperNode);
        }
        this.keeper.init(Type.Keeper, Team.Blue);
    }
    private touchToEnsureDirection(event: EventTouch) {
        if (footBallGame.isDesign) {
            return
        }
        this.role.rigidBodyStatic();
        let ray = new geometry.Ray();
        this.gameCamera.getCamera().screenPointToRay(event.getLocationX(), event.getLocationY(), ray);

        if (PhysicsSystem.instance.raycast(ray)) {
            let results = PhysicsSystem.instance.raycastResults;
            for (let i = 0; i < results.length; i++) {
                let result = results[i]
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
                    let distance = Vec2.distance(touchVec2, arrowPosVec2);

                    let vec = arrowPosVec2.subtract(touchVec2);
                    this.arrowNode.forward = new Vec3(vec.x, 0, vec.y);
                    const scale = this.arrowNode.getScale();
                    scale.z = vec.length() + 2;
                    this.arrowNode.setScale(scale);
                    this.role.arroundBall(this.ball.node.getPosition(), result.hitPoint)
                    FootBallGameData.Force = distance;
                    game.emit(Msg.UpdateForce, FootBallGameData.getCalcForce());
                    FootBallGameData.Direction = this.arrowNode.forward;
                }
            }
        }
    }
    onTipsDirection() {
        const touchMove = (event: EventTouch) => {
            this.updateArrowForward(event);
        };
        const touchEnd = (event: EventTouch) => {
            input.off(Input.EventType.TOUCH_MOVE, touchMove);
            input.off(Input.EventType.TOUCH_END, touchEnd);
            if (this.arrowNode) {
                this.arrowNode.destroy()
                this.arrowNode = null;
            }
            this.role.rigidBodyDynamic();
            // 显示踢小球的哪个部分界面
            game.emit(Msg.ShowUI, { type: UIType.Kicking } as UIOptions);
            // game.emit(Msg.GotoShoot);
        }

        input.on(Input.EventType.TOUCH_MOVE, touchMove);
        input.on(Input.EventType.TOUCH_END, touchEnd);
    }

    update(deltaTime: number) {

    }
}

