import { _decorator, Component, Node, Prefab, instantiate } from 'cc';
import { footBallGame } from '../FootBallGame';
import { getLevelConfig, LevelConfigs } from '../LevelData';
import { LevelItem } from './LevelItem';
import { UIBase } from './UIBase';
const { ccclass, property } = _decorator;

@ccclass('Level')
export class Level extends UIBase {
    @property(Prefab)
    item: Prefab = null;
    @property(Node)
    contentNode: Node = null;
    start() {
        const size = LevelConfigs.length;
        this.contentNode.destroyAllChildren()
        for (let i = 0; i < size; i++) {
            const node = instantiate(this.item);
            const cfg = LevelConfigs[i];
            node.getComponent(LevelItem).initData(i + 1, cfg.id);
            this.contentNode.addChild(node);
        }
    }

    update(deltaTime: number) {

    }
    onEnable() {
    }
    onDisable() {
    }
}

