import FuelManager from "../Manager/FuelManager";
import { Collectable } from "./Collectable";
const {ccclass, property} = cc._decorator;

@ccclass
class FuelCan extends Collectable {
    

    collect(): void {
        FuelManager.getInstance().refuel(100);
        this.node.destroy();
    }
}
