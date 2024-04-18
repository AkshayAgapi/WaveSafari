const {ccclass, property} = cc._decorator;

interface SegmentItem {
    type: string;
    position: { x: number, y: number };
    scale?: { x: number, y: number }; 
    rotation?: number; 
    anchor? : {x:number, y:number };
    size : {width:number, height:number};
}

interface SegmentData {
    id: number;
    items: SegmentItem[];
}

@ccclass
export default class SegmentManager extends cc.Component {
    @property(cc.Prefab)
    segmentPrefab: cc.Prefab = null;

    @property(cc.Prefab)
    island1Prefab: cc.Prefab = null;

    @property(cc.Prefab)
    island2Prefab: cc.Prefab = null;

    @property(cc.Prefab)
    obstaclePrefab: cc.Prefab = null;

    @property(cc.Prefab)
    gemPrefab: cc.Prefab = null;

    @property(cc.Prefab)
    fuelCanPrefab: cc.Prefab = null;

    @property(cc.Prefab)
    finishLinePrefab: cc.Prefab = null;

    @property(cc.Node)
    target: cc.Node = null;

    @property(cc.Node)
    segmentParent: cc.Node = null;

    @property
    initialSegmentsCount: number = 5;

    @property
    segmentHeight: number = 200;

    private currentSegments: cc.Node[] = [];
    private segmentData: { segments: SegmentData[] } = { segments: [] };

    onLoad() {
        this.currentSegments = [];
        this.loadSegmentData();
    }

    loadSegmentData() {
        cc.loader.loadRes("Data/SegmentData", cc.JsonAsset, (err, data: cc.JsonAsset) => {
            if (err) {
                cc.error(err);
                return;
            }

            this.segmentData = data.json;
            console.log("Segment Data : "+this.segmentData.segments.length);
            this.createInitialSegments();
        });
    }

    createInitialSegments(): void {
        let startPosY: number = 0;
        for (let i = 0; i < this.initialSegmentsCount; i++) {
            this.addSegment(startPosY, i);
            startPosY += this.segmentHeight;
        }
    }

    addSegment(yPosition: number, segmentIndex: number): void {
        const segmentInfo: SegmentData = this.segmentData.segments[segmentIndex % this.segmentData.segments.length];
        const newSegment: cc.Node = cc.instantiate(this.segmentPrefab);
        newSegment.setParent(this.segmentParent);
        newSegment.setPosition(cc.v2(0, yPosition));
    
        segmentInfo.items.forEach((item: SegmentItem) => {
            const prefab: cc.Prefab = this.getPrefabForItemType(item.type);
     
            if (prefab) {
                const newItem: cc.Node = cc.instantiate(prefab);
                newItem.name = item.type.toString();
                newItem.setParent(newSegment);
                newItem.setPosition(cc.v2(item.position.x, item.position.y));
    
                // Set scale if it's defined
                if (item.scale) {
                    newItem.setScale(item.scale.x, item.scale.y);
                } else {
                    // Optionally set a default scale, or do nothing to keep prefab's original scale
                    newItem.setScale(1, 1); // Default scale, adjust as needed
                }

                if (item.anchor) {
                    newItem.setAnchorPoint(item.anchor.x, item.anchor.y);
                } else {
                    // Optionally set a default scale, or do nothing to keep prefab's original scale
                    newItem.setAnchorPoint(0.5, 0.5);
                }

                if (item.size) {
                    newItem.setContentSize(new cc.Size(item.size.width, item.size.height));
                } else {
                    // Optionally set a default scale, or do nothing to keep prefab's original scale
                    newItem.setContentSize(new cc.Size(400, 400));
                }

    
                // Set rotation if it's defined
                if (typeof item.rotation !== 'undefined') {
                    newItem.angle = item.rotation;
                } else {
                    // Optionally set a default rotation, or do nothing to keep prefab's original rotation
                    newItem.angle = 0; // Default rotation, adjust as needed
                }
            }
        });
    
        this.currentSegments.push(newSegment);
    }

    resetSegments(): void {
        this.currentSegments.forEach(segment => segment.destroy());
        this.currentSegments = [];
        let startPosY: number = 0;
        for (let i = 0; i < this.initialSegmentsCount; i++) {
            this.addSegment(startPosY, i);
            startPosY += this.segmentHeight;
        }
    }

    resetBoatPosition(): void {
        // Assuming 'target' is your boat and you have a specific start position
        this.target.setPosition(0, 0); // Set to the desired start position
    }
    

    getPrefabForItemType(type: string): cc.Prefab {
        switch (type) {
            case 'island1':
                return this.island1Prefab;
            case 'island2':
                return this.island2Prefab;
            case 'obstacle':
                return this.obstaclePrefab;
            case 'gem':
                return this.gemPrefab;
            case 'fuelCan':
                return this.fuelCanPrefab;
            case 'finishLine':
                return this.finishLinePrefab;
            default:
                return null;
        }
    }

    update(dt: number): void {

        if (this.currentSegments.length > 0) {
            let cameraPosY: number = this.target.position.y; // or this.target.position.y for player's Y position
            let lastSegment = this.currentSegments[this.currentSegments.length - 1];
            let halfwayY = lastSegment.position.y;
        
            // If the camera's Y position is greater than halfwayY, it's time to recycle the first segment
            if (cameraPosY > halfwayY) {
                let newPosY = lastSegment.position.y + this.segmentHeight; // Position for the recycled segment
                let segmentToRecycle = this.currentSegments.shift(); // Remove the first segment
                segmentToRecycle.setPosition(0, newPosY); // Reposition it to the top
                this.currentSegments.push(segmentToRecycle); // Add it back to the array as the last element
            }
        } else {
            // Handle the case where there are no segments (e.g., log a warning or initialize segments)
            console.warn("No segments available in currentSegments array.");
        }       
    }
}
