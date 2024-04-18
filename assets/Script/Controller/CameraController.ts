import GameConfig from "../Common/GameConfig";
const {ccclass, property} = cc._decorator;

@ccclass
export default class CameraController extends cc.Component {
    @property(cc.Node)
    target: cc.Node = null;

    @property
    offsetX: number = 1000; // Adjust as needed for left and right boundaries

    private gameConfig: GameConfig = null;
    private boundaryRect: cc.Rect = null;

    protected onLoad(): void {
    }

    protected start(): void {
        this.gameConfig = GameConfig.getInstance();
        this.boundaryRect = this.gameConfig.BoundaryRect;
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
}
