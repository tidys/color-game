import { EventTarget } from "cc"
import { Msg } from "./Msg";
export enum Type {
    KickingFootBall,// 踢球

}
export const UIEvent = new EventTarget();
export class UIMgr {
    init() {

    }
    show(type: Type) {

        UIEvent.emit(Msg.ShowKicking, type);

    }
    hide() {

    }
}
export const uiMgr = new UIMgr();
