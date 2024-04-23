import GameEvents, { GameEventNames } from "../Common/GameEvents";
import AudioManager, { SoundClipType } from "../Manager/AudioManager";
import { PopupBase } from "../Manager/PopupBase";

const {ccclass, property} = cc._decorator;

@ccclass
export default class StartPopup extends PopupBase {

    @property(cc.Button)
    continueButton: cc.Button = null;

    @property(cc.Node)
    sailorNode: cc.Node = null;


    onLoad() {
        if (this.continueButton) {
            this.continueButton.node.on('click', this.onContinueButtonClicked, this);
        }
    }

    onShow(params?: any[]): void {
        super.onShow(params);
    }

    protected setupPopup(params?: any[]): void {
    }

    onHide(): void {
        super.onHide();
    }

    onContinueButtonClicked(): void {
        GameEvents.dispatchEvent(GameEventNames.GameCinematicTutorialStart);
        AudioManager.getInstance().playSfx(SoundClipType.BUTTON_CLICK_SFX);
        this.onHide();
    }


    onDestroy() {
        if (this.continueButton) {
            this.continueButton.node.off('click', this.onContinueButtonClicked, this);
        }
    }
}
