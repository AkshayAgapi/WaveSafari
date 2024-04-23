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
        this.zoomOutSlowly(6, 0.6);
    };

    private handleOnGameSplashZoomStart = () => {
        this.zoomOutSlowly(3, 0.7);
    }

    protected start(): void {
        this._boundaryRect = GameConst.BOUNDARY_RECT;
    }

    protected update(dt: number): void {
        if (!this.target) return;

        // Calculate the camera's horizontal boundaries with offsets
        let minX = this._boundaryRect.xMin + this.offsetX;
        let maxX = this._boundaryRect.xMax - this.offsetX;

        // Get the target's position in the world space
        let targetWorldPos = this.target.convertToWorldSpaceAR(cc.Vec2.ZERO);
        // Convert target's world position to the node (camera's parent) local space
        let targetLocalPos = this.node.parent.convertToNodeSpaceAR(targetWorldPos);

        // Clamp target's X position to keep within horizontal boundaries
        let clampedX = cc.misc.clampf(targetLocalPos.x, minX, maxX);

        // Y position follows the target directly, allowing free vertical movement
        let newY = targetLocalPos.y;

        // Update the camera's position
        this.node.position = new cc.Vec2(clampedX, newY);
    }

    private zoomIn(): void {
        cc.tween(this.cameraComponent)
        .to(1, { zoomRatio: 0.7 })
        .start();
    }

    private zoomOut(): void {
        cc.tween(this.cameraComponent)
        .to(1, { zoomRatio: 0.6 })
        .start();
    }

    private zoomOutSlowly(time: number, zoomRatio: number): void {
        cc.tween(this.cameraComponent)
        .to(time, { zoomRatio: zoomRatio }, { easing: 'quadInOut' })
        .start();
    }
}
