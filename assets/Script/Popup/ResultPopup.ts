import { PopupBase } from "../Manager/PopupBase";
import ScoreManager from "../Manager/ScoreManager";

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

    private currentState: ResultState;

    onLoad() {
        if (this.continueButton) {
            this.continueButton.node.on('click', this.onContinueButtonClicked, this);
        }
    }

    public setState(state: ResultState): void {
        this.currentState = state;
    }

    OnShow(): void {
        super.OnShow();
        this.updateLabelBasedOnState();
        this.coinsCollectedLabel.string = ScoreManager.getInstance().getScore()+" COINS";
    }

    private updateLabelBasedOnState(): void {
        switch (this.currentState) {
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

    OnHide(): void {
        super.OnHide();
    }

    onContinueButtonClicked(): void {
        this.OnHide();
    }

    onDestroy() {
        if (this.continueButton) {
            this.continueButton.node.off('click', this.onContinueButtonClicked, this);
        }
    }
}
