import { BoatUpgrade } from "../Data/BoatUpgradeData";
import PlayerData from "../Data/PlayerData";
import AudioManager, { SoundClipType } from "../Manager/AudioManager";
import PopupManager from "../Manager/PopupManager";
import { PopupBase } from "./Base/PopupBase";
import CommonPopup from "./CommonPopup";

const {ccclass, property} = cc._decorator;

@ccclass
export default class BoatUpgradePopup extends PopupBase {
    
    @property(cc.Button)
    upgradeButton: cc.Button = null;

    @property(cc.Button)
    closeButton: cc.Button = null;

    private _purchaseCallback: () => void = null;
    private boatUpgradeData : BoatUpgrade = null;
    
    protected onLoad() {
        if (this.upgradeButton) {
            this.upgradeButton.node.on('click', this.onUpgradeButtonCliked, this);
        }
        if (this.closeButton) {
            this.closeButton.node.on('click', this.onCloseButtonCliked, this);
        }
    }

    protected onDestroy() {
        if (this.upgradeButton) {
            this.upgradeButton.node.off('click', this.onUpgradeButtonCliked, this);
        }
        if (this.closeButton) {
            this.closeButton.node.on('click', this.onCloseButtonCliked, this);
        }
    }

    protected setupPopup(params?: any[]): void {
        if (params.length > 0) {
            if(params[0] != null){
                this.boatUpgradeData = params[0];
                console.log("Boat Upgrade Data : ");
            }
            if(params[1] != null){
                this._purchaseCallback = params[1];
            }
        }
    }

    public onShow(params?: any[]): void {
        super.onShow(params);
    }

    public onHide(): void {
        super.onHide();
    }

    private onUpgradeButtonCliked(): void {
        AudioManager.Instance().playSfx(SoundClipType.BUTTON_CLICK_SFX);

        if(PlayerData.getTotalCoins() >= this.boatUpgradeData.cost){
            PlayerData.purchaseBoatUpgrade(this.boatUpgradeData.id);
            PlayerData.deductCoins(this.boatUpgradeData.cost);
            this._purchaseCallback();
        }
        else{
            PopupManager.Instance().showPopup(CommonPopup,["You don't have enough coins to upgrade!", "Okay",this.onPopupActionCallback ]);
        }

       this.onHide();
    }

    private onPopupActionCallback()
    {

    }

    private onCloseButtonCliked(): void {
        AudioManager.Instance().playSfx(SoundClipType.BUTTON_CLICK_SFX);
       this.onHide();
    }
}
