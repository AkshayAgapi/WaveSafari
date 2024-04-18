const {ccclass, property} = cc._decorator;

@ccclass
export default class PlayerData extends cc.Component {
    private static readonly COINS_KEY = "totalCoins";

    // Get the total coins collected from storage
    static getTotalCoins(): number {
        const coins = localStorage.getItem(PlayerData.COINS_KEY);
        return coins ? parseInt(coins, 10) : 0;
    }

    // Save the total coins collected to storage
    static saveTotalCoins(value: number): void {
        localStorage.setItem(PlayerData.COINS_KEY, value.toString());
    }

    // Add coins to the current total and save
    static addCoins(value: number): void {
        const currentCoins = PlayerData.getTotalCoins();
        PlayerData.saveTotalCoins(currentCoins + value);
    }
}
