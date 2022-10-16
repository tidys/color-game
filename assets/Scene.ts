import { _decorator, Component, Node, input, Input, EventKeyboard, KeyCode } from 'cc';
import {Role} from './Role'
const { ccclass, property } = _decorator;

@ccclass('SceneComponent')
export class SceneComponent extends Component {
    @property(Role)
    role: Role = null;

    start() {


    }

    update(deltaTime: number) {

    }
}

