import CommonPopup from "../UI/CommonPopup";
import AudioManager from "./AudioManager";
import GameManager from "./GameManager";
import PopupManager from "./PopupManager";

const { ccclass, property } = cc._decorator;

@ccclass
export default class HUDManager extends cc.Component{
    @property(cc.Sprite)
    damageIndicator: cc.Sprite = null;

    @property(cc.Sprite)
    fuelIndicator: cc.Sprite = null;

    @property(cc.Label)
    coinLabel: cc.Label = null;

    @property(cc.Node)
    hudLeftElementParent: cc.Node = null;

    @property(cc.Node)
    hudRightElementParent: cc.Node = null;

    @property(cc.Node)
    public coinHudUI: cc.Node = null;

    @property(cc.Node)
    public fuelHudPos: cc.Node = null;

    @property(cc.Node)
    public fingerTutorialNode: cc.Node = null;

    @property(cc.Button)
    soundToggleButton: cc.Button = null;

    @property(cc.Button)
    pauseButton: cc.Button = null;

    @property(cc.Sprite)
    soundImage: cc.Sprite = null;

    @property(cc.SpriteFrame)
    soundIcon: cc.SpriteFrame = null;

    @property(cc.SpriteFrame)
    muteIcon: cc.SpriteFrame = null;

    private static _instance: HUDManager;

    public static getInstance(): HUDManager {
        if (!HUDManager._instance) {
            return HUDManager._instance;
            
        }
        return HUDManager._instance;
    }

    // Initialize HUD values
    onLoad() {

        if (HUDManager._instance) {
            this.node.destroy();
        } else {
            HUDManager._instance = this;
            //cc.game.addPersistRootNode(this.node); 
        }


        this.soundToggleButton.node.on('click', this.onSoundToggleButtonClicked, this);
        this.pauseButton.node.on('click', this.onPauseButtonClicked, this);
        this.setDamage(0);
        this.setFuel(100);
        this.setCoins(0);
    }

    protected onDestroy() {
        this.soundToggleButton.node.off('click', this.onSoundToggleButtonClicked, this);
        this.pauseButton.node.off('click', this.onPauseButtonClicked, this);
    }

    private onSoundToggleButtonClicked(): void {
        var isMuted = AudioManager.getInstance().toggleAudio();
        this.soundImage.spriteFrame = isMuted? this.muteIcon : this.soundIcon;
    }

    private onPauseButtonClicked(): void {
        PopupManager.getInstance().showPopup(CommonPopup,["Game Paused!", "Resume",this.onPopupActionCallback ]);
        this.scheduleOnce(() => {
            GameManager.getInstance().pauseGame();
        }, 0.4);
    }

    private onPopupActionCallback(){
        GameManager.getInstance().resumeGame();
    }

    // Update damage level on the damage indicator sprite
    public setDamage(damage: number) {
        if (this.damageIndicator) {
            this.damageIndicator.fillRange = damage / 100; 
        }
    }

    // Update fuel level on the fuel indicator sprite
    public setFuel(fuel: number) {
        if (this.fuelIndicator) {
            this.fuelIndicator.fillRange = fuel / 100; 
        }
    }

    // Update coin count
    public setCoins(coinCount: number) {
        if (this.coinLabel) {
            this.coinLabel.string = coinCount.toString();
        }
    }

    public setVisibilityFingerTutorial(visible)
    {
        this.fingerTutorialNode.active = visible;
    }

    public hideHudElements()
    {
        this.hudLeftElementParent.active = false;
        this.hudRightElementParent.active = false;
    }

    public showHudElements()
    {
        this.hudLeftElementParent.active = true;
        this.hudRightElementParent.active = true;
    }
}
