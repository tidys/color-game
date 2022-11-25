import { Vec2, Vec3 } from "cc";
import { UIType } from "./ui/UI";

export interface ILevelConfig {
    id: number,
    keeper: boolean;// 是否有门将
    ball: {
        position: Vec3,
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
        id: 1, keeper: false,
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
    }
];
export function getLevelConfig(id) {
    return LevelConfigs.find(el => {
        if (el.id.toString() === id.toString()) {
            return true;
        }
    })
}