import { Quat, Vec2, Vec3 } from "cc";
import { UIType } from "./ui/UI";

export interface ILevelConfig {
    id: number,
    desc?: string,
    camera?: {
        pos: Vec3,
        rotation: Quat,
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
        id: 10, keeper: false, desc: "直线",
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
        id: 20, keeper: false, desc: "左旋球",
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
        id: 30, keeper: false, desc: "右旋球",
        block: {
            pos: [new Vec3(-45, 0, 0)]
        },
        ball: { position: new Vec3(-40, 1, 0) },
        tips: {
            scene: {
                text: "注意前方的球员"
            },
            ball: {
                pos: new Vec2(-0.7, 0),
                text: "点击球的左侧提出右旋球"
            }
        }
    },
    {
        id: 40, keeper: false, desc: "挑射",
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
    {
        id: 50, keeper: false, desc: "综合练习1",
        block: {
            pos: [new Vec3(-43, 0, 0),
            new Vec3(-46, 0, 1.5),
            new Vec3(-46, 0, -1.5),
            ]
        },
        ball: { position: new Vec3(-40, 1, 0) },
        tips: {
            scene: {
                text: "注意前方球员的位置分布情况"
            }
        }
    },
    {
        id: 51, keeper: false, desc: "综合练习2",
        block: {
            pos: [new Vec3(-43, 0, 0),
            new Vec3(-40, 0, 1),
            new Vec3(-36, 0, -1),
            ]
        },
        camera: {
            pos: new Vec3(-19, 5.5, -1.3),
            rotation: new Quat(-0.11, 0.72, 0.1237, 0.667),
        },
        ball: { position: new Vec3(-30, 1, 0) },
        tips: {
            scene: {
                text: "注意前方球员的位置分布情况"
            }
        }
    },
    // 增加几个练习关卡
    // 长距离挑射

    {
        id: 60, keeper: true, desc: "守门员",
        tips: {
            scene: {
                text: '注意躲避守门员'
            }
        }
    },
    {
        id: 61, keeper: true, desc: "守门员+单个防线",
        camera: {
            pos: new Vec3(-27.7, 6.4, -0.31),
            rotation: new Quat(-0.117, 0.704, 0.119, 0.68)
        },
        block: {
            pos: [new Vec3(-44, 0, 0)]
        }
    },
    {
        id: 62, keeper: true, desc: "守门员+多个防线",
        camera: {
            pos: new Vec3(-30.30, 5.3, -0.12),
            rotation: new Quat(-0.1565127545121999, 0.6820603636853462, 0.1529875634876427, 0.6977766285728775)
        },
        block: {
            pos: [new Vec3(-44, 0, 0), new Vec3(-45, 0, -1), new Vec3(-45, 0, 1)]
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