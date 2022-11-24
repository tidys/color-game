import { _decorator, Component, Node, SkeletalAnimation } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('RoleCfg')
export class RoleCfg extends Component {
    @property(SkeletalAnimation)
    skeleta: SkeletalAnimation = null;
}

