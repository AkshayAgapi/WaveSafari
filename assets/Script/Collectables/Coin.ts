import ScoreManager from "../Manager/ScoreManager";
import { Collectable } from "./Collectable";
const {ccclass, property} = cc._decorator;

@ccclass
class Coin extends Collectable {
    @property
    value: number = 10;

    collect(): void {
        ScoreManager.Instance().addScore(this.value);
        this.node.destroy();
    }
}