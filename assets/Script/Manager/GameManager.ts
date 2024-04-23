import Joystick from "../../Module/Joystick/Joystick/Joystick";
import GameEvents, { GameEventNames } from "../Common/GameEvents";
import DamageController from "../Controller/DamageController";
import PlayerData from "../Data/PlayerData";
import Boat from "../Entities/Boat";
import MainPopup from "../UI/MainPopup";
import StartPopup from "../UI/StartPopup";
import AudioManager, { SoundClipType } from "./AudioManager";
import FuelController from "./FuelController";
import HUDManager from "./HudManager";
import PopupManager from "./PopupManager";
import ScoreManager from "./ScoreManager";
import SegmentManager from "./SegmentManager";

const { ccclass, property } = cc._decorator;

@ccclass
export default class GameManager extends cc.Component {

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
    private static _instance: GameManager;

    public static getInstance(): GameManager {
        return GameManager._instance;
    }

    protected onLoad() {

        if (GameManager._instance) {
            this.node.destroy();
        } else {
            GameManager._instance = this;
        }

        this.initGame();
        GameEvents.on(GameEventNames.GameEnd, this.handleOnGameEnd);
        GameEvents.on(GameEventNames.GameCinematicTutorialDone, this.HandleOnGameTutorialDone);
    }

    protected start(): void {
        this.joyStick.TurnOff();
        HUDManager.getInstance().hideHudElements();
        this.fuelController = this.boat.getComponent(FuelController);
        this.damageController = this.boat.getComponent(DamageController);
    }

    protected onDestroy(): void {
        GameEvents.off(GameEventNames.GameEnd, this.handleOnGameEnd);
        GameEvents.off(GameEventNames.GameCinematicTutorialDone, this.HandleOnGameTutorialDone);
    }

    private handleOnGameEnd = () => {
        this.joyStick.TurnOff();
        HUDManager.getInstance().hideHudElements();
    };

    private initGameSetting(){
        this.joyStick.TurnOn();
        HUDManager.getInstance().showHudElements();
        HUDManager.getInstance().setFuel(0);
        ScoreManager.getInstance().resetScore();

        if(this.fuelController != null){
            this.fuelController.refuel(100);
        }
    }

    private HandleOnGameTutorialDone = () => {
        this.initGameSetting();
        this.scheduleOnce(() => {
            HUDManager.getInstance().setVisibilityFingerTutorial(true);
        }, 4);
        AudioManager.getInstance().playBGM(SoundClipType.GAMEPLAY_BGM);
    };

    private initGame() {
        this.checkFirstTimeUser();
    }

    private checkFirstTimeUser() {
        var isFirstTime = PlayerData.isFirstTime();
        if (true) {
                //disable the joystick input
            GameEvents.dispatchEvent(GameEventNames.GameSplashZoomFirstTimeStart);
        
            this.scheduleOnce(() => {
                this.fadeInSplashNode();
            }, 3);

            this.scheduleOnce(() => {
                this.fadeOutSplashNode();
            }, 6);

            this.scheduleOnce(() => {
                PopupManager.getInstance().showPopup(StartPopup);
            }, 7); 
        } else {
            this.startGame();
        }
    }

    private startGame() {
        GameEvents.dispatchEvent(GameEventNames.GameSplashZoomStart);
        this.scheduleOnce(() => {
            AudioManager.getInstance().playBGM(SoundClipType.GAMEPLAY_BGM);
            PopupManager.getInstance().showPopup(MainPopup);
        }, 1);
    }

    public restartGame(){
        this.segmentManager.resetSegments();
        this.boat.resetPoisition();
        this.initGameSetting();
    }

    public pauseGame(): void {
        if (!this._isGamePaused) {
            AudioManager.getInstance().pauseAllSounds();
            cc.director.pause();
            this._isGamePaused = true;
        }
    }

    public resumeGame(): void {
        if (this._isGamePaused) {
            AudioManager.getInstance().pauseAllSounds();
            cc.director.resume();
            this._isGamePaused = false;
        }
    }

    public fadeInSplashNode(): void {
        // Ensure the node is active and fully transparent before fading in
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
