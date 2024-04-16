import FuelManager from "../Manager/FuelManager";
import { Collectable } from "./Collectable";
const {ccclass, property} = cc._decorator;

@ccclass
class FuelCan extends Collectable {
    

    collect(): void {
        FuelManager.Instance().refuel(100);
        this.node.destroy();
    }
}
