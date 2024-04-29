import FuelController from "../Controller/FuelController";
import AudioManager, { SoundClipType } from "../Manager/AudioManager";
import GameManager from "../Manager/GameManager";
import { Collectable } from "./Collectable";
const {ccclass, property} = cc._decorator;

@ccclass
class FuelCan extends Collectable {

    public collect(): void {
        GameManager.Instance().boat.getComponent(FuelController).refuel(100);
        this.showCollectableAnimation();
        AudioManager.Instance().playSfx(SoundClipType.FUEL_COLLECTION_SFX);
    }
}
