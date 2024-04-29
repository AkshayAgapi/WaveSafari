import AudioManager, { SoundClipType } from "../Manager/AudioManager";
import ScoreManager from "../Manager/ScoreManager";
import { Collectable } from "./Collectable";
const {ccclass, property} = cc._decorator;

@ccclass
class Coin extends Collectable {
    @property
    value: number = 10;

    public collect(): void {
        ScoreManager.getInstance().addScore(this.value);
        this.showCollectableAnimation();
        AudioManager.Instance().playSfx(SoundClipType.COIN_COLLECTION_SFX);
    }
}
