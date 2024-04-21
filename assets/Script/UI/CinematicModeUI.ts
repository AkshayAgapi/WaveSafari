import GameEvents, { GameEventNames } from "../Common/GameEvents";

const { ccclass, property } = cc._decorator;

@ccclass
export default class CinematicModeUI extends cc.Component {

    @property(cc.Node)
    topBar: cc.Node = null;

    @property(cc.Node)
    bottomBar: cc.Node = null;

    @property
    duration: number = 2; // Duration of the animation

    protected onLoad(): void {
        GameEvents.on(GameEventNames.GameCinematicTutorialStart, this.HandleOnCinematicTutorialStart);
        GameEvents.on(GameEventNames.GameCinematicTutorialDone, this.HandleOnCinematicTutorialDone);
    }

    protected onDestroy(): void {
        GameEvents.off(GameEventNames.GameCinematicTutorialStart, this.HandleOnCinematicTutorialStart);
        GameEvents.off(GameEventNames.GameCinematicTutorialDone, this.HandleOnCinematicTutorialDone);
    }

    private HandleOnCinematicTutorialStart = () => {
        this.showBars();
    };

    private HandleOnCinematicTutorialDone = () => {
        this.hideBars();
    };

    showBars() {
        console.log("Show Bar");
        this.node.active = true;
        cc.tween(this.topBar)
            .to(this.duration, { position: cc.v2(this.topBar.position.x, 470) }, { easing: 'quadInOut' })
            .start();

        cc.tween(this.bottomBar)
            .to(this.duration, { position: cc.v2(this.bottomBar.position.x, -470) }, { easing: 'quadInOut' })
            .start();
    }

    hideBars() {
        cc.tween(this.topBar)
            .to(this.duration, { position: cc.v2(this.topBar.position.x, 470+this.topBar.height) }, { easing: 'quadInOut' })
            .start();

        cc.tween(this.bottomBar)
            .to(this.duration, { position: cc.v2(this.bottomBar.position.x, -470-this.bottomBar.height) }, { easing: 'quadInOut' })
            .call(() => {
                this.node.active = false;
            })
            .start();
    }
}
