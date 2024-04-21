import GameEvents, { GameEventNames } from "../Common/GameEvents";
import { PopupBase } from "../Manager/PopupBase";

const {ccclass, property} = cc._decorator;

@ccclass
export default class NewClass extends PopupBase {

    @property(cc.Button)
    continueButton: cc.Button = null;

    onLoad() {
        if (this.continueButton) {
            this.continueButton.node.on('click', this.onContinueButtonClicked, this);
        }
    }

    OnShow(): void {
        super.OnShow();
    }

    OnHide(): void {
        super.OnHide();
    }

    onContinueButtonClicked(): void {
        GameEvents.dispatchEvent(GameEventNames.GameCinematicTutorialStart);
        this.OnHide();
    }

    onDestroy() {
        if (this.continueButton) {
            this.continueButton.node.off('click', this.onContinueButtonClicked, this);
        }
    }
}
