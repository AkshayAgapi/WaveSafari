import OrientationManager from "../../LoadScene/OrientationManager";
import Joystick from "../../Module/Joystick/Joystick/Joystick";
import GameEvents, { GameEventNames } from "../Common/GameEvents";
import { GenericSingleton } from "../Common/GenericSingleton";
import DamageController from "../Controller/DamageController";
import FuelController from "../Controller/FuelController";
import PlayerData from "../Data/PlayerData";
import Boat from "../Entities/Boat";
import MainPopup from "../UI/MainPopup";
import StartPopup from "../UI/StartPopup";
import AudioManager, { SoundClipType } from "./AudioManager";
import HUDManager from "./HudManager";
import PopupManager from "./PopupManager";
import ScoreManager from "./ScoreManager";
import SegmentManager from "./SegmentManager";

const { ccclass, property } = cc._decorator;

@ccclass
export default class GameManager extends GenericSingleton<GameManager> {

    @property(Boat)
    boat: Boat = null;

    @property(cc.Node)
    splashScreen: cc.Node = null;

    @property(Joystick)
    joyStick: Joystick = null;

    @property(SegmentManager)
    segmentManager: SegmentManager = null;

    public fuelController : FuelController = null;
    public damageController : DamageController = null;

    private _isGamePaused: boolean = false;

    protected onLoad() {

        super.onLoad();
        OrientationManager.changeOrientation(1); 
        this.initGame();
        GameEvents.on(GameEventNames.GameEnd, this.handleOnGameEnd);
        GameEvents.on(GameEventNames.GameCinematicTutorialDone, this.HandleOnGameTutorialDone);
    }

    protected start(): void {
        this.joyStick.TurnOff();
        HUDManager.Instance().hideHudElements();
        this.fuelController = this.boat.getComponent(FuelController);
        this.damageController = this.boat.getComponent(DamageController);
    }

    protected onDestroy(): void {
        GameEvents.off(GameEventNames.GameEnd, this.handleOnGameEnd);
        GameEvents.off(GameEventNames.GameCinematicTutorialDone, this.HandleOnGameTutorialDone);
    }

    private handleOnGameEnd = () => {
        this.joyStick.TurnOff();
        HUDManager.Instance().hideHudElements();
    };

    private initGameSetting(){
        this.joyStick.TurnOn();
        HUDManager.Instance().showHudElements();
        HUDManager.Instance().setFuel(0);
        HUDManager.Instance().setDamage(0);
        ScoreManager.getInstance().resetScore();

        if(this.damageController != null){
            this.damageController.resetDamage();
        }
        if(this.fuelController != null){
            this.fuelController.refuel(100);
        }
    }

    private HandleOnGameTutorialDone = () => {
        this.initGameSetting();
        this.scheduleOnce(() => {
            HUDManager.Instance().setVisibilityFingerTutorial(true);
        }, 4);
        AudioManager.Instance().playBGM(SoundClipType.GAMEPLAY_BGM);
    };

    private initGame() {
        this.checkFirstTimeUser();
    }

    private checkFirstTimeUser() {
        var isFirstTime = PlayerData.isFirstTime();
        if (isFirstTime) {
            GameEvents.dispatchEvent(GameEventNames.GameSplashZoomFirstTimeStart);
        
            this.scheduleOnce(() => {
                this.fadeInSplashNode();
            }, 3);

            this.scheduleOnce(() => {
                this.fadeOutSplashNode();
            }, 6);

            this.scheduleOnce(() => {
                PopupManager.Instance().showPopup(StartPopup);
            }, 7); 
        } else {
            this.startGame();
        }
    }

    private startGame() {
        GameEvents.dispatchEvent(GameEventNames.GameSplashZoomStart);
        this.scheduleOnce(() => {
            AudioManager.Instance().playBGM(SoundClipType.GAMEPLAY_BGM);
            PopupManager.Instance().showPopup(MainPopup);
        }, 1);
    }

    public restartGame(){
        this.segmentManager.resetSegments();
        this.boat.resetPoisition();
        this.initGameSetting();
    }

    public pauseGame(): void {
        if (!this._isGamePaused) {
            AudioManager.Instance().pauseAllSounds();
            cc.director.pause();
            this._isGamePaused = true;
        }
    }

    public resumeGame(): void {
        if (this._isGamePaused) {
            AudioManager.Instance().resumeAllSounds();
            cc.director.resume();
            this._isGamePaused = false;
        }
    }

    public fadeInSplashNode(): void {
        this.splashScreen.active = true;
        this.splashScreen.opacity = 0;

        cc.tween(this.splashScreen)
            .to(2, { opacity: 255 })
            .start();
    }

    private fadeOutSplashNode(): void {
        cc.tween(this.splashScreen)
            .to(0.5, { opacity: 0 })
            .call(() => {
                this.splashScreen.active = false;
            })
            .start();
    }
}
