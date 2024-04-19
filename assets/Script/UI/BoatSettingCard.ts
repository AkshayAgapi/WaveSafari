import { GameConst } from "../Common/GameConstant";
import { BoatUpgrade } from "../Data/BoatUpgradeData";

const {ccclass, property} = cc._decorator;

@ccclass
export default class BoatSettingCard extends cc.Component {

    @property(cc.Sprite)
    speedProgress: cc.Sprite = null;

    @property(cc.Sprite)
    stabilityProgress: cc.Sprite = null;

    @property(cc.Sprite)
    fuelConsumptionProgress: cc.Sprite = null;

    @property(cc.Label)
    headingLabel: cc.Label = null; 

    @property(cc.Node)
    lockPanel: cc.Node = null; 

    @property(cc.Label)
    priceValueLabel: cc.Label = null; 
    
    @property(cc.Button)
    cardButton: cc.Button = null;

    @property(cc.Node)
    childContent: cc.Node = null; 

    cardId : number = 0;
    isSelected: boolean = false;
    contentSize : cc.Size = null;

    public setData(upgradeData: BoatUpgrade) : void{
        
        this.cardId = upgradeData.id;
        this.speedProgress.fillRange = (GameConst.MOVEMENT_SPEED * upgradeData.speedMultiplier) / 500; 
        this.stabilityProgress.fillRange = upgradeData.stability / 100; 
        this.fuelConsumptionProgress.fillRange = (GameConst.FUEL_CONSUMPTION_RATE * upgradeData.fuelConsumption ) / 8; 

        this.headingLabel.string = upgradeData.name;
        this.lockPanel.active = !upgradeData.unlocked;

        this.priceValueLabel.string = upgradeData.cost.toString();
    }

    public select() {
        this.isSelected = true;
        this.contentSize = this.node.getContentSize();
        cc.tween(this.childContent)
            .to(0.2, { scale: 1.2 }, { easing: 'quadOut' })
            .start();

        cc.tween(this.node)
            .to(0.2, { width: 450, height: 400 }, { easing: 'quadOut' })
            .start();
    }

    public deselect() {
        this.isSelected = false;
        cc.tween(this.childContent)
        .to(0.2, { scale: 1 }, { easing: 'quadIn' })
        .start();

        cc.tween(this.node)
        .to(0.2, { width: this.contentSize.width, height: this.contentSize.height }, { easing: 'quadIn' })
        .start();
    }

}