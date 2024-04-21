import HUDManager from "../Manager/HudManager";

const { ccclass, property } = cc._decorator;

@ccclass
export default class DamageController extends cc.Component {
    @property
    damageInterval: number = 2.0; // Time in seconds between possible damage events

    private lastDamageTime: number = 0; // Timestamp of the last damage event

    onLoad() {
        this.resetDamageTimer();
    }

    // Call this method when the boat collides with a damage-causing obstacle
    applyDamage() {
        const currentTime = Date.now();
        if (currentTime - this.lastDamageTime > this.damageInterval * 1000) {
            this.lastDamageTime = currentTime;
            this.handleDamage();
        }
    }

    private handleDamage() {
        console.log("Damage applied to the boat");
        HUDManager.getInstance().setDamage(10);
    }

    resetDamageTimer() {
        this.lastDamageTime = Date.now() - this.damageInterval * 1000;
    }
}
