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

    public OnShow(): void {
        super.OnShow();
    }

    public OnHide(): void {
        super.OnHide();
    }

    private onUpgradeButtonCliked(): void {
       this.OnHide();
    }
}
