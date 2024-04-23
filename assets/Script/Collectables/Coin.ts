import AudioManager, { SoundClipType } from "../Manager/AudioManager";
import PopupManager from "../Manager/PopupManager";
import ScoreManager from "../Manager/ScoreManager";
import MainPopup from "../UI/MainPopup";
import { Collectable } from "./Collectable";
const {ccclass, property} = cc._decorator;

@ccclass
class Coin extends Collectable {
    @property
    value: number = 10;

    collect(): void {
        ScoreManager.getInstance().addScore(this.value);
        this.showCollectableAnimation();
        AudioManager.getInstance().playSfx(SoundClipType.COIN_COLLECTION_SFX);
    }
}
