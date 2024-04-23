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

    private boundaryRect: cc.Rect = null;

    protected onLoad(): void {
        GameEvents.on(GameEventNames.GameCinematicTutorialStart, this.HandleOnCinematicTutorialStart);
        GameEvents.on(GameEventNames.GameCinematicTutorialDone, this.HandleOnCinematicTutorialEnd);
        GameEvents.on(GameEventNames.GameSplashZoomFirstTimeStart, this.HandleOnGameSplashZoomFirstTimeStart);
        GameEvents.on(GameEventNames.GameSplashZoomStart, this.HandleOnGameSplashZoomStart);
    }

    protected onDestroy(): void {
        GameEvents.off(GameEventNames.GameCinematicTutorialStart, this.HandleOnCinematicTutorialStart);
        GameEvents.off(GameEventNames.GameCinematicTutorialDone, this.HandleOnCinematicTutorialEnd);
        GameEvents.off(GameEventNames.GameSplashZoomFirstTimeStart, this.HandleOnGameSplashZoomFirstTimeStart);
        GameEvents.off(GameEventNames.GameSplashZoomStart, this.HandleOnGameSplashZoomStart);
    }

    private HandleOnCinematicTutorialStart = () => {
        this.zoomOut();
    };

    private HandleOnCinematicTutorialEnd = () => {
        this.zoomIn();
    };

    private HandleOnGameSplashZoomFirstTimeStart = () => {
        this.zoomOutSlowly(6, 0.6);
    };

    HandleOnGameSplashZoomStart = () => {
        this.zoomOutSlowly(3, 0.7);
    }

    protected start(): void {
        this.boundaryRect = GameConst.BOUNDARY_RECT;
    }

    update(dt: number): void {
        if (!this.target) return;

        // Calculate the camera's horizontal boundaries with offsets
        let minX = this.boundaryRect.xMin + this.offsetX;
        let maxX = this.boundaryRect.xMax - this.offsetX;

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
        console.log("zoomIn");

        cc.tween(this.cameraComponent)
        .to(1, { zoomRatio: 0.7 })
        .start();
    }

    private zoomOut(): void {
        console.log("zoomOut");

        cc.tween(this.cameraComponent)
        .to(1, { zoomRatio: 0.6 })
        .start();
    }

    private zoomOutSlowly(time: number, zoomRatio: number): void {
        console.log("zoomOutSlowly");
        cc.tween(this.cameraComponent)
        .to(time, { zoomRatio: zoomRatio }, { easing: 'quadInOut' })
        .start();
    }
}
