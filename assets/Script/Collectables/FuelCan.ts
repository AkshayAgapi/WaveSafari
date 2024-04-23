import AudioManager, { SoundClipType } from "../Manager/AudioManager";
import FuelController from "../Manager/FuelController";
import GameManager from "../Manager/GameManager";
import { Collectable } from "./Collectable";
const {ccclass, property} = cc._decorator;

@ccclass
class FuelCan extends Collectable {

    public collect(): void {
        GameManager.getInstance().boat.getComponent(FuelController).refuel(100);
        this.showCollectableAnimation();
        AudioManager.getInstance().playSfx(SoundClipType.FUEL_COLLECTION_SFX);
    }
}
