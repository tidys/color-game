import { _decorator, Component, Node, Input, EventTouch, EventTarget, Slider, game, input, EventKeyboard, KeyCode, Camera, Prefab, instantiate, UITransform, Vec3 } from 'cc';
import { Msg } from '../Msg';
const { ccclass, property } = _decorator;

export enum UIType {
    Kicking = "Kicking",
    TipsDirectionAndForce = "TipsDirectionAndForce",
    GM = "GM",
    Level = "Level",
    WellCome = "WellCome",
    Game = "Game",
}
export interface UIOptions {
    type: UIType,
}
@ccclass('UI')
export class UI extends Component {
    @property({ type: Prefab, displayName: "选择踢球的界面" })
    ballNode: Prefab = null;

    @property(Camera)
    camera: Camera = null;

    @property({ type: Prefab, displayName: "提示方向和力量界面" })
    tipsNode: Prefab = null;

    @property({ type: Prefab, displayName: "关卡" })
    levelPrefab: Prefab = null;

    @property({ type: Prefab, displayName: "欢迎页面" })
    wellCome: Prefab = null;

    @property({ type: Prefab, displayName: "游戏内UI" })
    gameUI: Prefab = null;
    private _createUI(data?: UIOptions) {
        const cfg = {};
        cfg[UIType.Game] = this.gameUI;
        cfg[UIType.WellCome] = this.wellCome;
        cfg[UIType.GM] = null;
        cfg[UIType.Level] = this.levelPrefab;
        cfg[UIType.Kicking] = this.ballNode;
        cfg[UIType.TipsDirectionAndForce] = this.tipsNode;
        let prefab = cfg[data.type];
        if (prefab) {
            console.log(`UI: ${data.type}`)
            this._cleanUI()
            const node: Node = instantiate(prefab);
            node.setPosition(new Vec3())
            this.curUINode = node;
            this.node.addChild(node);

        } else {
            console.log("未配置的界面：", data.type)
        }
    }
    private _cleanUI() {
        if (this.curUINode) {
            this.curUINode.destroy();
            this.curUINode = null;
        }
    }
    private gameUINode: Node = null;
    private curUINode: Node = null;

    private _visibleGameUI(b: boolean) {
        if (!this.gameUINode) {
            this.gameUINode = instantiate(this.gameUI);
            this.gameUINode.setPosition(new Vec3());
            this.node.addChild(this.gameUINode);
        }
        this.gameUINode.active = b;
    }
    onLoad() {
        this._visibleGameUI(false);
        game.on(Msg.ExitGame, () => [
            this._visibleGameUI(false)
        ])
        game.on(Msg.EnterGame, () => {
            this._visibleGameUI(true);
        })
        game.on(Msg.ResetGame, () => {
            this._visibleGameUI(true)
        })
        game.on(Msg.ShowUI, (data?: UIOptions) => {
            this._createUI(data);
        })
        game.on(Msg.CleanUI, () => {
            this._cleanUI()
        })
        input.on(Input.EventType.KEY_DOWN, (event: EventKeyboard) => {
            if (event.keyCode === KeyCode.KEY_V) {
                this.camera.node.active = !this.camera.node.active;
            }
        })
        this._cleanUI()
    }

    update(deltaTime: number) {

    }

}

