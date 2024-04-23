import DamageController from "../Controller/DamageController";
import AudioManager, { SoundClipType } from "../Manager/AudioManager";
import FuelController from "../Manager/FuelController";
import GameManager from "../Manager/GameManager";
import { PopupBase } from "../Manager/PopupBase";
import PopupManager from "../Manager/PopupManager";
import ScoreManager from "../Manager/ScoreManager";
import SegmentManager from "../Manager/SegmentManager";
import MainPopup from "./MainPopup";

const {ccclass, property} = cc._decorator;

export enum ResultState {
    FuelEmpty,
    FullDamage,
    FirstSafariDone
}

@ccclass
export default class ResultPopup extends PopupBase {

    @property(cc.Label)
    headerLabel: cc.Label = null; 

    @property(cc.Label)
    coinsCollectedLabel: cc.Label = null; 

    @property(cc.Label)
    damagePercentageLabel: cc.Label = null; 

    @property(cc.Button)
    continueButton: cc.Button = null;

    private _currentState: ResultState;

    protected onLoad() {
        if (this.continueButton) {
            this.continueButton.node.on('click', this.onContinueButtonClicked, this);
        }
    }

    public onShow(params?: any[]): void {
        super.onShow(params);
        this.updateLabelBasedOnState();
        this.coinsCollectedLabel.string = ScoreManager.getInstance().getScore()+" COINS";
        this.damagePercentageLabel.string = "DAMAGE "+GameManager.getInstance().boat.getComponent(DamageController).getTotalDamage().toString() +"%";
    }

    protected setupPopup(params?: any[]): void {
        if (params.length > 0 && params[0] != null && this.isResultState(params[0])) {
            this._currentState = params[0];
        }
    }

    private isResultState(value: any): value is ResultState {
        return Object.values(ResultState).includes(value);
    }

    private updateLabelBasedOnState(): void {
        switch (this._currentState) {
            case ResultState.FuelEmpty:
                this.headerLabel.string = "FUEL EMPTY!";
                break;
            case ResultState.FullDamage:
                this.headerLabel.string = "BOAT DAMAGED!";
                break;
            case ResultState.FirstSafariDone:
                this.headerLabel.string = "WELL DONE!";
                break;
        }
    }

    public onHide(): void {
        super.onHide();
    }

    private onContinueButtonClicked(): void {
       
        PopupManager.getInstance().showPopup(MainPopup);
        AudioManager.getInstance().playSfx(SoundClipType.BUTTON_CLICK_SFX);
        this.onHide();
    }

    protected onDestroy() {
        if (this.continueButton) {
            this.continueButton.node.off('click', this.onContinueButtonClicked, this);
        }
    }
}
