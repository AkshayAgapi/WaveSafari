import GameConfig from "./Common/GameConfig";

const {ccclass, property} = cc._decorator;

@ccclass
export default class CameraController extends cc.Component {
    @property(cc.Node)
    target: cc.Node = null;

    @property
    offsetX: number = 1000; // Adjust as needed for left and right boundaries

    gameConfig: GameConfig = null;

    protected onLoad(): void {
        this.gameConfig = GameConfig.Instance();
    }

    update(dt: number): void {
        if (!this.target) return;
        if (this.gameConfig == null) return;

        // Calculate the camera's horizontal boundaries with offsets
        let boundaryRect = this.gameConfig.boundaryRect;
        if(boundaryRect == null) console.log("Boundary rect is null");
        let minX = boundaryRect.xMin + this.offsetX;
        let maxX = boundaryRect.xMax - this.offsetX;

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
