import FuelController from "../Manager/FuelController";
import GameManager from "../Manager/GameManager";
import { Collectable } from "./Collectable";
const {ccclass, property} = cc._decorator;

@ccclass
class FuelCan extends Collectable {

    collect(): void {
        GameManager.getInstance().boat.getComponent(FuelController)
        FuelController.getInstance().refuel(100);
        this.showCollectableAnimation();
    }
}
