const { ccclass, property } = cc._decorator;

@ccclass
export default class SegmentToJsonTool extends cc.Component {

    @property(cc.Node)
    segmentNode: cc.Node = null; // Assign your segment prefab instance here

    start() {
        this.generateSegmentJSON();
    }

    generateSegmentJSON() {
        let segmentData = {
            items: []
        };

        this.segmentNode.children.forEach(child => {
            // Determine the type based on the node name or tag
            let type = "";
            if (child.name.indexOf("Obstacle") === 0) {
                type = "obstacle";
            } else if (child.name.indexOf("Gem") === 0) {
                type = "gem";
            } else if (child.name.indexOf("Island1") === 0) {
                type = "island1";
            } else if (child.name.indexOf("Island2") === 0) {
                type = "island2";
            } else if (child.name.indexOf("FuelCan") === 0) {
                type = "fuelCan";
            } else if (child.name.indexOf("FinishLine") === 0) {
                type = "finishLine";
            }

            // Add item to segment data with position, scale, and rotation
            if (type) {
                segmentData.items.push({
                    type: type,
                    position: { x: child.position.x, y: child.position.y },
                    scale: { x: child.scaleX, y: child.scaleY },
                    rotation: child.angle, // For Cocos Creator 3.x, use child.angle for 2D rotation
                    anchor: child.getAnchorPoint(),
                    size: child.getContentSize()
                });
            }
        });

        // Log or export the JSON string
        console.log(JSON.stringify(segmentData, null, 4)); // Pretty print JSON
    }
}
