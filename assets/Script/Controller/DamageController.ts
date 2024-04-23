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

    private lastDamageTime: number = 0; // Timestamp of the last damage event
    private totalDamage: number = 0;
    private damagePerCollide: number = 10;

    onLoad() {
        this.resetDamageTimer();
    }
    
    getTotalDamage() : number{
        return this.totalDamage;
    }

    // Call this method when the boat collides with a damage-causing obstacle
    applyDamage() {
        console.log("Apply Damage");
        const currentTime = Date.now();
        if (currentTime - this.lastDamageTime > this.damageInterval * 1000) {
            this.lastDamageTime = currentTime;
            this.handleDamage();
        }
    }

    private handleDamage() {
        console.log("Damage applied to the boat");
        this.totalDamage += this.damagePerCollide;
        HUDManager.getInstance().setDamage(this.totalDamage);
        AudioManager.getInstance().playSfx(SoundClipType.COLLISION_SFX);

        if(this.totalDamage > 100)
        {
            PopupManager.getInstance().showPopup(ResultPopup, [ResultState.FullDamage])
            GameEvents.dispatchEvent(GameEventNames.GameEnd);
        }
    }

    resetDamageTimer() {
        this.lastDamageTime = Date.now() - this.damageInterval * 1000;
    }
}
