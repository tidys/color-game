import { lerp, Vec2, Vec3 } from "cc"

export class FootBallGameData {
    static Force: number = 0; // 点击的位置与球的距离，[0, 10]
    static OffsetX: number = 0;// 香蕉球：决定球的左右偏离，取值[0,1]
    static OffsetY: number = 0;// 挑球：决定球的上下，取值[0,1]
    static Direction: Vec3 = new Vec3()
    static enabledBanana = true;
    // 香蕉球的方向
    static getBananaVec() {
        //没有y:(x,0,z)
        let v2 = new Vec2(this.Direction.x, this.Direction.z);
        // 左？右？
        if (this.OffsetX > 0) {
            v2 = v2.rotate(-Math.PI / 2);
        } else {
            v2 = v2.rotate(Math.PI / 2);
        }
        let v3 = new Vec3(v2.x, 0, v2.y);
        // 倍率
        const mul = 1;
        v3 = v3.normalize().multiplyScalar(Math.abs(this.OffsetX * mul))
        return v3;
    }
    static getJump() {
        const mul = 2;
        let y = this.OffsetY * mul;
        // x,y方向的值都是[0,1]，最终值落在[0.3,2]
        y = Math.min(y, 2);
        y = Math.max(0.3, y);
        return y;
    }
    static getShortForce() {
        let y = this.getJump();
        let force = new Vec3(this.Direction.x, y, this.Direction.z);
        let process = this.Force / 10;
        if (process >= 1) {
            process = 1;
        }
        const scalar = lerp(20, 200, process)
        force.normalize().multiplyScalar(scalar);
        return force;
    }
}