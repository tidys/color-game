import { _decorator, Component, Node, Prefab, instantiate, view, math, Sprite, Color, UITransform, setDisplayStats, EventTouch, Input, input, tween, AudioSource, AudioClip, Label } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('ColorGame')
export class ColorGame extends Component {
    @property({ type: Prefab, visible: true })
    item = null;
    @property({ type: AudioClip })
    click: AudioClip = null;

    @property({ type: AudioClip })
    bgMusic: AudioClip = null;

    @property(Node)
    gameNode: Node = null;
    @property(Label)
    gameInfo: Label = null;

    @property(Node)
    gameOver: Node = null;

    @property(Prefab)
    tipsPrefab: Prefab = null;
    _totalIndex = 0;
    _rightCount = 0;
    _tipsCount = 0;
    start() {
        setDisplayStats(false)
        this.onInit()
        this.replay()
    }
    onInit() {
        let audioSource = this.getComponent(AudioSource);
        audioSource.clip = this.bgMusic;
        audioSource.loop = true;
        audioSource.play()

        this.gameOver.active = false;
        this.gameOver.getComponent(UITransform).setContentSize(view.getVisibleSize());
        this.gameOver.on(Input.EventType.TOUCH_START, () => {
            this.replay()
        })
    }
    replay() {
        this.reset();
        this.playNext();
    }
    reset() {
        this.gameOver.active = false;
        this._totalIndex = 0;
        this._rightCount = 1;
        this.updateInfo()
    }
    onGameOver() {
        this.gameOver.active = true;
    }
    updateInfo() {
        this.gameInfo.string = `${this._rightCount}/${this._totalIndex}`
    }
    playNext() {
        this._totalIndex++;
        this.updateInfo()
        const buttonCount = 3;
        const color = this.getRandomColor()
        this.gameNode.destroyAllChildren();
        this.createBigColor(buttonCount, color, () => {
            this.tips(buttonCount, () => {
                this.createButtons(buttonCount, color, (chooseColor: Color) => {
                    if (chooseColor.equals(color)) {
                        this._rightCount++;
                        this.updateInfo()
                        this.playNext();
                    } else {
                        this._rightCount--;
                        this.updateInfo();
                        if (this._rightCount <= 0) {
                            // 失败
                            this.onGameOver()
                        }
                    }
                });
            })

        });
    }
    tips(buttonCount, cb) {
        this._tipsCount++;
        if (this._tipsCount > 2) {
            cb();
            return;
        }

        let size: math.Size = view.getVisibleSize();
        let node = instantiate(this.tipsPrefab);
        let btnWidth = size.width / buttonCount;
        node.getComponent(UITransform).setAnchorPoint(0.5, 0.5);
        node.getComponent(UITransform).setContentSize(size.width, btnWidth)
        node.setPosition(0, -size.height / 2 + btnWidth / 2)
        this.gameNode.addChild(node);
        let finishTips = () => {
            input.off(Input.EventType.TOUCH_START, finishTips);
            node.off(Input.EventType.TOUCH_START, finishTips)
            node.removeFromParent()
            cb();
        };
        input.on(Input.EventType.TOUCH_START, finishTips);
        node.on(Input.EventType.TOUCH_START, finishTips)
    }
    _bigColorNode: Node = null;
    private createBigColor(buttonCount, color, cb) {
        let size: math.Size = view.getVisibleSize();
        let node = instantiate(this.item);
        const height = size.height - size.width / buttonCount - 10;
        let transform = node.getComponent(UITransform);
        transform.setContentSize(size.width, 0);
        transform.setAnchorPoint(0.5, 1);
        node.setPosition(0, size.height / 2);
        node.getComponent(Sprite).color = color;
        this.gameNode.addChild(node);
        tween().target(transform).to(0.3, { height: height }, { easing: "fade" }).call(() => {
            cb && cb();
        }).start();
        this._bigColorNode = node;
    }
    private getRandomColor() {
        const r = math.randomRangeInt(0, 255)
        const g = math.randomRangeInt(0, 255)
        const b = math.randomRangeInt(0, 255)

        return new Color(r, g, b, 255);
    }
    createButtons(num, color, cb) {
        if (num < 2) {
            return false;
        }
        const colors = [color, this.getRandomColor(), this.getRandomColor()];
        colors.sort(() => {
            return 0.5 - Math.random();
        })
        let size: math.Size = view.getVisibleSize();
        let btnWidth = size.width / num;
        let x = -size.width / 2 + btnWidth / 2;
        let y = -size.height / 2 + btnWidth / 2;
        for (let i = 0; i < num; i++) {
            let node: Node = instantiate(this.item);
            node.getComponent(UITransform).setContentSize(btnWidth, btnWidth);
            node.setPosition(x, y)
            const sprite: Sprite = node.getComponent(Sprite);
            sprite.color = colors[i];
            this.gameNode.addChild(node);
            const curColor = colors[i];

            node.on(Input.EventType.TOUCH_START, () => {
                const audioSource = this.getComponent(AudioSource);
                // audioSource.clip = this.click;
                // audioSource.play();
                audioSource.playOneShot(this.click);
                cb && cb(colors[i])
            });
            x += btnWidth;
        }
        tween().target(this._bigColorNode.getComponent(UITransform)).to(1.0, { height: 0 }).call(() => {
            this.onGameOver()
            this.gameNode.destroyAllChildren()
        }).start();
    }

    update(deltaTime: number) {

    }
}

