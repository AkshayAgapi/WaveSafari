import { GameConst } from "../Common/GameConstant";
import GameEvents, { GameEventNames } from "../Common/GameEvents";
import AudioManager, { SoundClipType } from "../Manager/AudioManager";
import HUDManager from "../Manager/HudManager";
import PopupManager from "../Manager/PopupManager";
import ResultPopup, { ResultState } from "../UI/ResultPopup";

const { ccclass, property } = cc._decorator;

@ccclass
export default class DamageController extends cc.Component {
    @property
    damageInterval: number = 2.0; // Time in seconds between possible damage events

    private _lastDamageTime: number = 0; // Timestamp of the last damage event
    private _totalDamage: number = 0;

    protected onLoad() {
        this.resetDamageTimer();
    }
    
    public getTotalDamage() : number{
        return this._totalDamage;
    }

    // Call this method when the boat collides with a damage-causing obstacle
    public applyDamage() {
        const currentTime = Date.now();
        if (currentTime - this._lastDamageTime > this.damageInterval * 1000) {
            this._lastDamageTime = currentTime;
            this.handleDamage();
        }
    }

    private handleDamage() {
        this._totalDamage += GameConst.DAMAGE_PER_COLLIDE;
        HUDManager.getInstance().setDamage(this._totalDamage);
        AudioManager.getInstance().playSfx(SoundClipType.COLLISION_SFX);

        if(this._totalDamage > 100)
        {
            PopupManager.getInstance().showPopup(ResultPopup, [ResultState.FullDamage])
            GameEvents.dispatchEvent(GameEventNames.GameEnd);
        }
    }

    private resetDamageTimer() {
        this._lastDamageTime = Date.now() - this.damageInterval * 1000;
    }
}
