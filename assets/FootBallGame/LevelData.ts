import { Vec2, Vec3 } from "cc";
import { UIType } from "./ui/UI";

export interface ILevelConfig {
    id: number,
    desc?: string,
    camera?: {
        pos?: Vec3,
        rotation?: Vec3,
    }
    keeper: boolean;// 是否有门将
    block?: {
        pos: Vec3[],
    }
    ball?: {
        position?: Vec3,
    },
    tips?: {
        scene?: {
            text: string,
        },
        ball?: {
            pos: Vec2,
            text: string,
        }
    }

}
export const LevelConfigs: ILevelConfig[] = [
    {
        id: 1, keeper: false, desc: "直线练习",
        ball: { position: new Vec3(-40, 1, 0) },
        tips: {
            scene: {
                text: "通过拖动来选择踢球方向和力量"
            },
            ball: {
                pos: new Vec2(),
                text: "点击球的中心踢出直线球",
            }
        }
    },
    {
        id: 2, keeper: false, desc: "左旋球",
        block: {
            pos: [new Vec3(-45, 0, 0)]
        },
        ball: { position: new Vec3(-40, 1, 0) },
        tips: {
            scene: {
                text: "注意前方的球员"
            },
            ball: {
                pos: new Vec2(0.7, 0),
                text: "点击球的右侧提出左旋球"
            }
        }
    },
    {
        id: 3, keeper: false, desc: "挑射练习",
        block: {
            pos: [new Vec3(-45, 0, 0), new Vec3(-45, 0, -1), new Vec3(-45, 0, 1)]
        },
        tips: {
            scene: {
                text: "注意踢球的力量，不要拖太远了"
            },
            ball: {
                pos: new Vec2(0, -0.7),
                text: "点击球的底部来挑射"
            }
        }
    },
    // 增加几个练习关卡
    // 长距离挑射

    {
        id: 10, keeper: true, desc: "守门员练习",
        tips: {
            scene: {
                text: '注意躲避守门员'
            }
        }
    },
    {
        id: 20, keeper: true,
        block: {
            pos: []
        }
    }

];
export function getLevelConfig(id) {
    return LevelConfigs.find(el => {
        if (el.id.toString() === id.toString()) {
            return true;
        }
    })
}