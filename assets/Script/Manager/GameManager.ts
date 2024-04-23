import Joystick from "../../Module/Joystick/Joystick/Joystick";
import GameEvents, { GameEventNames } from "../Common/GameEvents";
import DamageController from "../Controller/DamageController";
import PlayerData from "../Data/PlayerData";
import StartPopup from "../UI/StartPopup";
import AudioManager, { SoundClipType } from "./AudioManager";
import FuelController from "./FuelController";
import HUDManager from "./HudManager";
import PopupManager from "./PopupManager";
import ScoreManager from "./ScoreManager";

const { ccclass, property } = cc._decorator;

@ccclass
export default class GameManager extends cc.Component {

    @property(cc.Node)
    boat: cc.Node = null;

    @property(cc.Node)
    splashScreen: cc.Node = null;

    @property(Joystick)
    joyStick: Joystick = null;

    public fuelController : FuelController = null;
    public damageController : DamageController = null;

    private isGamePaused: boolean = false;
    private static instance: GameManager;

    public static getInstance(): GameManager {
        return GameManager.instance;
    }

    onLoad() {

        if (GameManager.instance) {
            this.node.destroy();
        } else {
            GameManager.instance = this;
        }

        this.initGame();
        GameEvents.on(GameEventNames.GameEnd, this.HandleOnGameEnd);
        GameEvents.on(GameEventNames.GameRestarted, this.HandleOnGameRestarted);
        GameEvents.on(GameEventNames.GameCinematicTutorialDone, this.HandleOnGameTutorialDone);
    }

    protected start(): void {
        this.joyStick.TurnOff();
        HUDManager.getInstance().hideHudElements();
        this.fuelController = this.boat.getComponent(FuelController);
        this.damageController = this.boat.getComponent(DamageController);
    }

    protected onDestroy(): void {
        GameEvents.off(GameEventNames.GameEnd, this.HandleOnGameEnd);
        GameEvents.off(GameEventNames.GameRestarted, this.HandleOnGameRestarted);
        GameEvents.off(GameEventNames.GameCinematicTutorialDone, this.HandleOnGameTutorialDone);
    }

    private HandleOnGameEnd = () => {
        this.joyStick.TurnOff();
        HUDManager.getInstance().hideHudElements();
    };

    private HandleOnGameRestarted = () => {
        this.joyStick.TurnOn();
        HUDManager.getInstance().showHudElements();
        HUDManager.getInstance().setFuel(0);
        ScoreManager.getInstance().resetScore();

        if(this.fuelController != null){
            this.fuelController.refuel(100);
        }
    };

    private HandleOnGameTutorialDone = () => {
        GameEvents.dispatchEvent(GameEventNames.GameRestarted);
        this.scheduleOnce(() => {
            HUDManager.getInstance().setVisibilityFingerTutorial(true);
        }, 4);
        AudioManager.getInstance().playBGM(SoundClipType.GAMEPLAY_BGM);
    };

    initGame() {
        this.checkFirstTimeUser();
    }

    onSplashScreenEnd() {
        //this.fadeOutSplashScreen();
        //this.checkFirstTimeUser();
    }

    checkFirstTimeUser() {
        const isFirstTime = PlayerData.isFirstTime();
        if (true) {
                //disable the joystick input
            GameEvents.dispatchEvent(GameEventNames.GameSplashZoomStart);
        
            this.scheduleOnce(() => {
                this.fadeInSplashNode();
            }, 3);

            this.scheduleOnce(() => {
                this.fadeOutSplashNode();
            }, 6);

            this.scheduleOnce(() => {
                console.log("Dispatch GameCinematicTutorialStart");
                //GameEvents.dispatchEvent(GameEventNames.GameCinematicTutorialStart);
                PopupManager.getInstance().showPopup(StartPopup);
            }, 7); 
        } else {
            AudioManager.getInstance().playBGM(SoundClipType.GAMEPLAY_BGM);
            this.startGame();
        }
    }

    startGame() {
        // Transition to the main game scene or whatever needs to be done next
    }

    // Optional: Handling first-time user setup
    handleFirstTimeUser() {
        // Placeholder for any setup like tutorials or initial configurations
        console.log("Handle first-time user setup");
        // Once setup is complete, possibly go to the main game or a tutorial scene
        cc.director.loadScene("TutorialScene");
    }

    public restartGame(){
        GameEvents.dispatchEvent(GameEventNames.GameRestarted);
    }

    public pauseGame(): void {
        if (!this.isGamePaused) {
            cc.director.pause();
            this.isGamePaused = true;
            console.log("Game paused.");
        }
    }

    public resumeGame(): void {
        if (this.isGamePaused) {
            cc.director.resume();
            this.isGamePaused = false;
            console.log("Game resumed.");
        }
    }

    public fadeInSplashNode(): void {
        // Ensure the node is active and fully transparent before fading in
        this.splashScreen.active = true;
        this.splashScreen.opacity = 0;

        cc.tween(this.splashScreen)
            .to(2, { opacity: 255 })
            .call(() => {
                console.log("Fade in completed.");
                // Additional actions after fade in
            })
            .start();
    }

    private fadeOutSplashNode(): void {
        cc.tween(this.splashScreen)
            .to(0.5, { opacity: 0 })
            .call(() => {
                console.log("Fade out completed.");
                // Additional actions after fade out, like deactivating the node
                this.splashScreen.active = false;
            })
            .start();
    }
}
