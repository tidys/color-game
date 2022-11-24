import { _decorator, Component, Node, SkeletalAnimation } from 'cc';
const { ccclass, property } = _decorator;

const stand = "stand";
const walk = "walk";
@ccclass('RoleAnimation')
export class RoleAnimation extends Component {
    private _ani: string = null;
    private _skeletal: SkeletalAnimation = null;

    initSkeleta(skeAnimation: SkeletalAnimation) {
        this._skeletal = skeAnimation;
        skeAnimation.createState(skeAnimation.clips[0], stand);
        skeAnimation.createState(skeAnimation.clips[1], walk);
    }
    start() {
    }
    stand() {
        this._turnAnimation(stand);
    }
    walk() {
        this._turnAnimation(walk);
    }
    private _turnAnimation(aniName: string) {
        if (this._ani === aniName) {
            return;
        }
        this._ani = aniName;
        this._skeletal.play(aniName);
    }

    update(deltaTime: number) {

    }
}

