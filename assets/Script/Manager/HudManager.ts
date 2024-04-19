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
            this.node.destroy();
        } else {
            HUDManager.instance = this;
            //cc.game.addPersistRootNode(this.node); 
        }

        this.setDamage(0);
        this.setFuel(100);
        this.setCoins(0);
    }

    // Update damage level on the damage indicator sprite
    setDamage(damage: number) {
        if (this.damageIndicator) {
            this.damageIndicator.fillRange = 1 - damage / 100; 
        }
    }

    // Update fuel level on the fuel indicator sprite
    setFuel(fuel: number) {
        if (this.fuelIndicator) {
            this.fuelIndicator.fillRange = fuel / 100; 
        }
    }

    // Update coin count
    setCoins(coinCount: number) {
        if (this.coinLabel) {
            this.coinLabel.string = coinCount.toString();
        }
    }
}
