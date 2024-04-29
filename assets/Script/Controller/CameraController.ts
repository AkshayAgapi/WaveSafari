import { GameConst } from "../Common/GameConstant";
import GameEvents, { GameEventNames } from "../Common/GameEvents";
const {ccclass, property} = cc._decorator;

@ccclass
export default class CameraController extends cc.Component {
    @property(cc.Node)
    target: cc.Node = null;

    @property
    offsetX: number = 1000; // Adjust as needed for left and right boundaries

    @property(cc.Camera)
    cameraComponent: cc.Camera = null;

    private _boundaryRect: cc.Rect = null;

    protected onLoad(): void {
        GameEvents.on(GameEventNames.GameCinematicTutorialStart, this.handleOnCinematicTutorialStart);
        GameEvents.on(GameEventNames.GameCinematicTutorialDone, this.handleOnCinematicTutorialEnd);
        GameEvents.on(GameEventNames.GameSplashZoomFirstTimeStart, this.handleOnGameSplashZoomFirstTimeStart);
        GameEvents.on(GameEventNames.GameSplashZoomStart, this.handleOnGameSplashZoomStart);
    }

    protected onDestroy(): void {
        GameEvents.off(GameEventNames.GameCinematicTutorialStart, this.handleOnCinematicTutorialStart);
        GameEvents.off(GameEventNames.GameCinematicTutorialDone, this.handleOnCinematicTutorialEnd);
        GameEvents.off(GameEventNames.GameSplashZoomFirstTimeStart, this.handleOnGameSplashZoomFirstTimeStart);
        GameEvents.off(GameEventNames.GameSplashZoomStart, this.handleOnGameSplashZoomStart);
    }

    private handleOnCinematicTutorialStart = () => {
        this.zoomOut();
    };

    private handleOnCinematicTutorialEnd = () => {
        this.zoomIn();
    };

    private handleOnGameSplashZoomFirstTimeStart = () => {
        this.zoomOutSlowly(6, 0.4);
    };

    private handleOnGameSplashZoomStart = () => {
        this.zoomOutSlowly(3, 0.5);
    }

    protected start(): void {
        this._boundaryRect = GameConst.BOUNDARY_RECT;
    }

    protected update(dt: number): void {
        if (!this.target) return;

        const smoothTime = 0.2;  // Time to smooth camera movement
        let minX = this._boundaryRect.xMin + this.offsetX;
        let maxX = this._boundaryRect.xMax - this.offsetX;
    
        let targetWorldPos = this.target.convertToWorldSpaceAR(cc.Vec2.ZERO);
        let targetLocalPos = this.node.parent.convertToNodeSpaceAR(targetWorldPos);
    
        let clampedX = cc.misc.clampf(targetLocalPos.x, minX, maxX);
        let newY = targetLocalPos.y;
    
        // Smoothly interpolate the camera's position
        this.node.position = this.node.position.lerp(new cc.Vec2(clampedX, newY), dt / smoothTime);
    }

    private zoomIn(): void {
        cc.tween(this.cameraComponent)
        .to(1, { zoomRatio: 0.5})
        .start();
    }

    private zoomOut(): void {
        cc.tween(this.cameraComponent)
        .to(1, { zoomRatio: 0.4 })
        .start();
    }

    private zoomOutSlowly(time: number, zoomRatio: number): void {
        cc.tween(this.cameraComponent)
        .to(time, { zoomRatio: zoomRatio }, { easing: 'quadInOut' })
        .start();
    }
}
