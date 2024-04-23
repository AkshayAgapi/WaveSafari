import { BoatUpgrade } from "../Data/BoatUpgradeData";
import PlayerData from "../Data/PlayerData";
import AudioManager, { SoundClipType } from "../Manager/AudioManager";
import GameManager from "../Manager/GameManager";
import { PopupBase } from "../Manager/PopupBase";
import PopupManager from "../Manager/PopupManager";
import BoatSettingCard from "./BoatSettingCard";
import BoatUpgradePopup from "./BoatUpgradePopup";

const {ccclass, property} = cc._decorator;

@ccclass
export default class MainPopup extends PopupBase {

    @property(cc.Label)
    totalCoinValueLabel: cc.Label = null; 

    @property(cc.Prefab)
    upgradeCardPrefab: cc.Prefab = null;

    @property(cc.Node)
    parentUI: cc.Node = null;

    @property(cc.Button)
    playButton: cc.Button = null;

    private _instantiatedCards: cc.Node[] = [];
    private _selectedCard: BoatSettingCard = null;

    public onShow(params?: any[]): void {

        super.onShow(params);
        this.totalCoinValueLabel.string = PlayerData.getTotalCoins().toString();
        this.loadUpgradeCards();
    }

    public onHide(): void {
        super.onHide();
        this._instantiatedCards.forEach(card => card.destroy());
        this._instantiatedCards = [];
        this._selectedCard = null;
    }

    protected onLoad() {
        if (this.playButton) {
            this.playButton.node.on('click', this.onPlayButtonClicked, this);
        }
    }

    protected setupPopup(params?: any[]): void {
    }

    private onPlayButtonClicked(): void {

        if(PlayerData.isBoatSettingUnlocked(this._selectedCard.cardId)){
            GameManager.getInstance().restartGame();
            AudioManager.getInstance().playSfx(SoundClipType.BUTTON_CLICK_SFX);
            this.onHide();
        }
        else{
            PopupManager.getInstance().showPopup(BoatUpgradePopup, [this._selectedCard.upgradeData, this.onPurchaseSuccess]);
        }
    }

    private loadUpgradeCards() : void {

        var boatUpgrades = PlayerData.getBoatUpgrades();

        if(this._instantiatedCards.length > 0){
            this._instantiatedCards.forEach(card => card.destroy());
            this._instantiatedCards = []; 
        }

        boatUpgrades.forEach(upgrade => {
            this.spawnUpgradeCard(upgrade);
        });
    }

    private refershCards() : void{
        this.loadUpgradeCards();
    }

    private spawnUpgradeCard(upgradeData: BoatUpgrade): void {
        if (!this.upgradeCardPrefab || !this.parentUI) {
            console.error("Prefab or Parent not assigned!");
            return;
        }

        const upgradeCardInstance: cc.Node = cc.instantiate(this.upgradeCardPrefab);
        upgradeCardInstance.setParent(this.parentUI);
        var boatSetting = upgradeCardInstance.getComponent(BoatSettingCard);
        boatSetting.setData(upgradeData);
        this._instantiatedCards.push(upgradeCardInstance);

        if (upgradeData.id === PlayerData.getCurrentBoatSetting().id) {
            this.selectCard(boatSetting);
        }

        upgradeCardInstance.on('click', () => {
            this.selectCard(boatSetting);
        });
    }

    private selectCard(card: BoatSettingCard) {
        if (this._selectedCard) {
            this._selectedCard.deselect();
        }
        this._selectedCard = card;
        this._selectedCard.select();

        AudioManager.getInstance().playSfx(SoundClipType.BUTTON_CLICK_SFX);

        if(card.isCardLocked)
        {
            PopupManager.getInstance().showPopup(BoatUpgradePopup, [card.upgradeData, this.onPurchaseSuccess]);
        }
    }

    private onPurchaseSuccess() {
        this.refershCards();
    }

    protected onDestroy() {
        if (this.playButton) {
            this.playButton.node.off('click', this.onPlayButtonClicked, this);
        }
    }
}
