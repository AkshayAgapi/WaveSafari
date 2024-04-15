import { GenericSingleton } from "./GenericSingleton";

const { ccclass, property } = cc._decorator;

@ccclass
export default class GameConfig extends GenericSingleton<GameConfig> {
   
   @property(cc.Rect)
   boundaryRect: cc.Rect = new cc.Rect(-500, -500, 1000, 1000);
}
