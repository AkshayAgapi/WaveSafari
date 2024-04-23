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

    private instantiatedCards: cc.Node[] = [];
    private selectedCard: BoatSettingCard = null;

    onShow(params?: any[]): void {

        super.onShow(params);
        this.totalCoinValueLabel.string = PlayerData.getTotalCoins().toString();
        this.loadUpgradeCards();
    }

    onHide(): void {
        super.onHide();
        this.instantiatedCards.forEach(card => card.destroy());
        this.instantiatedCards = [];
        this.selectedCard = null;
    }

    onLoad() {
        if (this.playButton) {
            this.playButton.node.on('click', this.onPlayButtonClicked, this);
        }
    }

    protected setupPopup(params?: any[]): void {
    }

    onPlayButtonClicked(): void {
        GameManager.getInstance().restartGame();
        AudioManager.getInstance().playSfx(SoundClipType.BUTTON_CLICK_SFX);
        this.onHide();
    }

    private loadUpgradeCards() : void {

        var boatUpgrades = PlayerData.getBoatUpgrades();

        if(this.instantiatedCards.length > 0){
            this.instantiatedCards.forEach(card => card.destroy());
            this.instantiatedCards = []; 
        }

        boatUpgrades.forEach(upgrade => {
            this.spawnUpgradeCard(upgrade);
        });
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
        this.instantiatedCards.push(upgradeCardInstance);

        if (upgradeData.id === PlayerData.getCurrentBoatSetting().id) {
            this.selectCard(boatSetting);
        }

        upgradeCardInstance.on('click', () => {
            console.log("clicked");
            this.selectCard(boatSetting);
        });
    }

    private selectCard(card: BoatSettingCard) {
        if (this.selectedCard) {
            this.selectedCard.deselect();
        }
        this.selectedCard = card;
        this.selectedCard.select();

        AudioManager.getInstance().playSfx(SoundClipType.BUTTON_CLICK_SFX);

        if(card.isCardLocked)
        {
            PopupManager.getInstance().showPopup(BoatUpgradePopup);
        }
    }

    onDestroy() {
        if (this.playButton) {
            this.playButton.node.off('click', this.onPlayButtonClicked, this);
        }
    }
}
