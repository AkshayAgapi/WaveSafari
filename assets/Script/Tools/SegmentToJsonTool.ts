const { ccclass, property } = cc._decorator;

@ccclass
export default class SegmentsToJsonTool extends cc.Component {
    @property([cc.Node])
    segmentNodes: cc.Node[] = []; // Array of segment nodes

    protected start() {
        this.generateSegmentsJSON();
    }

    private generateSegmentsJSON() {
        let segmentsData = {
            segments: []
        };

        this.segmentNodes.forEach((segmentNode, index) => {
            let segmentData = {
                id: index + 1, // Assuming ID is index + 1 for uniqueness
                items: []
            };

            segmentNode.children.forEach(child => {
                // Determine the type based on the node name or tag
                let type = this.determineType(child.name);
                if (type) {
                    segmentData.items.push({
                        type: type,
                        position: { x: child.position.x, y: child.position.y },
                        scale: { x: child.scaleX, y: child.scaleY },
                        rotation: child.angle,
                        anchor: child.getAnchorPoint(),
                        size: { width: child.width, height: child.height }
                    });
                }
            });

            segmentsData.segments.push(segmentData);
        });

        // Log or export the JSON string
        console.log(JSON.stringify(segmentsData, null, 4)); // Pretty print JSON
    }

    private determineType(name: string): string | null {
        if (name.includes("Obstacle")) return "obstacle";
        if (name.includes("Gem")) return "gem";
        if (name.includes("Island1")) return "island1";
        if (name.includes("Island2")) return "island2";
        if (name.includes("FuelCan")) return "fuelCan";
        if (name.includes("FinishLine")) return "finishLine";
        return null;
    }
}
