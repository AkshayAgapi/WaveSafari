const { ccclass, property } = cc._decorator;

@ccclass
export default class HUDManager extends cc.Component{
    @property(cc.Sprite)
    damageIndicator: cc.Sprite = null;

    @property(cc.Sprite)
    fuelIndicator: cc.Sprite = null;

    @property(cc.Label)
    coinLabel: cc.Label = null;


    private static instance: HUDManager;

    public static getInstance(): HUDManager {
        if (!HUDManager.instance) {
            return HUDManager.instance;
            
        }
        return HUDManager.instance;
    }

    // Initialize HUD values
    onLoad() {

        if (HUDManager.instance) {
            console.error("Another instance of ScoreManager already exists!");
            this.node.destroy(); // Optionally destroy the duplicate
        } else {
            HUDManager.instance = this;
            cc.game.addPersistRootNode(this.node); // Make node persistent across scenes
        }

        this.setDamage(0);  // No damage initially
        this.setFuel(100);  // Full fuel initially
        this.setCoins(0);   // No coins initially
    }

    // Update damage level on the damage indicator sprite
    setDamage(damage: number) {
        if (this.damageIndicator) {
            this.damageIndicator.fillRange = 1 - damage / 100;  // Assuming damage is a percentage
        }
    }

    // Update fuel level on the fuel indicator sprite
    setFuel(fuel: number) {
        if (this.fuelIndicator) {
            this.fuelIndicator.fillRange = fuel / 100;  // Assuming fuel is a percentage
        }
    }

    // Update coin count
    setCoins(coinCount: number) {
        if (this.coinLabel) {
            this.coinLabel.string = coinCount.toString();
        }
    }
}
