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
        GameEvents.on(GameEventNames.GameSplashZoomStart, this.HandleOnGameSplashZoomStart);
    }

    protected onDestroy(): void {
        GameEvents.off(GameEventNames.GameCinematicTutorialStart, this.HandleOnCinematicTutorialStart);
        GameEvents.off(GameEventNames.GameCinematicTutorialDone, this.HandleOnCinematicTutorialEnd);
        GameEvents.on(GameEventNames.GameSplashZoomStart, this.HandleOnGameSplashZoomStart);
    }

    private HandleOnCinematicTutorialStart = () => {
        console.log("Zoom Started");
        this.zoomOut();
    };

    private HandleOnCinematicTutorialEnd = () => {
        this.zoomIn();
    };

    private HandleOnGameSplashZoomStart = () => {
        this.zoomOutSlowly();
    };

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
        cc.tween(this.cameraComponent)
        .to(1, { zoomRatio: 0.7 })
        .call(() => console.log("Zoom in completed"))
        .start();
    }

    private zoomOut(): void {
        cc.tween(this.cameraComponent)
        .to(1, { zoomRatio: 0.6 })
        .call(() => console.log("Zoom in completed"))
        .start();
    }

    private zoomOutSlowly(): void {
        cc.tween(this.cameraComponent)
        .to(6, { zoomRatio: 0.6 }, { easing: 'quadInOut' })
        .call(() => console.log("Zoom in completed"))
        .start();
    }
}
