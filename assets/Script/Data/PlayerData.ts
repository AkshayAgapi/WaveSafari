import { BoatUpgrade, BoatUpgradeData } from "./BoatUpgradeData";

const {ccclass, property} = cc._decorator;

@ccclass
export default class PlayerData extends cc.Component {
    private static readonly COINS_KEY = "totalCoins";
    private static readonly BOAT_SETTING_ID = "boatSetting";
    private static readonly BOAT_UPGRADES_KEY = "boatUpgrades";
    private static readonly IS_FIRST_TIME = "isFirstTime";


    // Get the total coins collected from storage
    static getTotalCoins(): number {
        const coins = localStorage.getItem(PlayerData.COINS_KEY);
        return coins ? parseInt(coins, 10) : 0;
    }

    // Save the total coins collected to storage
    static saveTotalCoins(sessionCoins: number): void {
        var newTotalCoins = this.getTotalCoins() + sessionCoins
        localStorage.setItem(PlayerData.COINS_KEY, newTotalCoins.toString());
    }

    // Add coins to the current total and save
    static addCoins(value: number): void {
        const currentCoins = PlayerData.getTotalCoins();
        PlayerData.saveTotalCoins(currentCoins + value);
    }

    static deductCoins(value: number): void {
        const currentCoins = PlayerData.getTotalCoins();
        PlayerData.saveTotalCoins(currentCoins - value);
    }

    static getCurrentBoatSetting(): BoatUpgrade {
        var boatSettingIdString = localStorage.getItem(PlayerData.BOAT_SETTING_ID);
        var boatSettingId =  boatSettingIdString ? parseInt(boatSettingIdString, 10) : 1;
        return BoatUpgradeData.find(u => u.id === boatSettingId);
    }

    static isBoatSettingUnlocked(id: number): boolean {
        const upgrades = PlayerData.getBoatUpgrades();
        const foundUpgrade = upgrades.find(u => u.id === id);
        return foundUpgrade ? foundUpgrade.unlocked : false;
    }

    // Set the current active boat setting by ID
    static setCurrentActiveBoatSettingId(id: number): void {
        localStorage.setItem(PlayerData.BOAT_SETTING_ID, id.toString());
    }

    static getBoatUpgrades(): BoatUpgrade[] {
        const upgradesJson = localStorage.getItem(PlayerData.BOAT_UPGRADES_KEY);
        if (upgradesJson) {
            return JSON.parse(upgradesJson);
        } else {
            PlayerData.saveBoatUpgrades(BoatUpgradeData);
            return BoatUpgradeData;
        }
    }

    static saveBoatUpgrades(upgrades: BoatUpgrade[]): void {
        const upgradesJson = JSON.stringify(upgrades);
        localStorage.setItem(PlayerData.BOAT_UPGRADES_KEY, upgradesJson);
    }

    static purchaseBoatUpgrade(upgradeId: number): void {
        const upgrades = PlayerData.getBoatUpgrades();
        const upgrade = upgrades.find(u => u.id === upgradeId);
        if (upgrade) {
            upgrade.unlocked = true;
            PlayerData.saveBoatUpgrades(upgrades);
        }
    }

    static isFirstTime(): boolean {
        const isFirstTime = localStorage.getItem(PlayerData.IS_FIRST_TIME);
        return !isFirstTime || isFirstTime === "1"; 
    }    

    static firstTimeDone(): void {
        localStorage.setItem(PlayerData.IS_FIRST_TIME, "0");
    }
}
