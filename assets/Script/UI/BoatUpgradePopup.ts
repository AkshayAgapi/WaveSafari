import AudioManager, { SoundClipType } from "../Manager/AudioManager";
import { PopupBase } from "../Manager/PopupBase";

const {ccclass, property} = cc._decorator;

@ccclass
export default class BoatUpgradePopup extends PopupBase {
    
    @property(cc.Button)
    upgradeButton: cc.Button = null;

    onLoad() {
        if (this.upgradeButton) {
            this.upgradeButton.node.on('click', this.onUpgradeButtonCliked, this);
        }
    }

    onDestroy() {
        if (this.upgradeButton) {
            this.upgradeButton.node.off('click', this.onUpgradeButtonCliked, this);
        }
    }

    protected setupPopup(params?: any[]): void {
    }

    public onShow(): void {
        super.onShow();
    }

    public onHide(): void {
        super.onHide();
    }

    private onUpgradeButtonCliked(): void {
        AudioManager.getInstance().playSfx(SoundClipType.BUTTON_CLICK_SFX);
       this.onHide();
    }
}
