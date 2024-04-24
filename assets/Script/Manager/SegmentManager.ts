import { Collectable } from "../Collectables/Collectable";
import PlayerData from "../Data/PlayerData";

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
    segmentHeight: number = 200;

    private _initialSegmentsCount: number = 3;
    private _index : number = 0;
    private _currentSegments: cc.Node[] = [];
    private _segmentData: { segments: SegmentData[] } = { segments: [] };

    onLoad() {
        this._currentSegments = [];
        this.loadSegmentData();
    }

    private loadSegmentData() {

        var jsonPath = "";
        if(!PlayerData.isFirstTime()){
            jsonPath = "Data/FirstTimeSegmentData";
        }else{
            jsonPath = "Data/SegmentData";
        }

        cc.loader.loadRes(jsonPath, cc.JsonAsset, (err, data: cc.JsonAsset) => {
            if (err) {
                cc.error(err);
                return;
            }

            this._segmentData = data.json;
            this.createInitialSegments();
        });
    }

    private createInitialSegments(): void {
        let startPosY: number = 0;
        for (let i = 0; i < this._initialSegmentsCount; i++) {
            this.addSegment(startPosY, i);
            startPosY += this.segmentHeight;
        }
        this._index = this._initialSegmentsCount;
    }

    private addSegment(yPosition: number, segmentIndex: number): void {
        const segmentInfo: SegmentData = this._segmentData.segments[segmentIndex % this._segmentData.segments.length];
        const newSegment: cc.Node = cc.instantiate(this.segmentPrefab);
        newSegment.setParent(this.segmentParent);
        newSegment.setPosition(cc.v2(0, yPosition));
        newSegment.setSiblingIndex(0);

        this.addObstablesAndCollectables(segmentInfo, newSegment);
        this._currentSegments.push(newSegment);
    }


    private addObstablesAndCollectables(segmentInfo: SegmentData, parent: cc.Node){
        segmentInfo.items.forEach((item: SegmentItem) => {
            const prefab: cc.Prefab = this.getPrefabForItemType(item.type);
     
            if (prefab) {
                const newItem: cc.Node = cc.instantiate(prefab);
                newItem.name = item.type.toString();
                newItem.setParent(parent);
                newItem.setPosition(cc.v3(item.position.x, item.position.y));

                var collectable = newItem.getComponent(Collectable);
                if(collectable){
                    newItem.zIndex = 2;
                }
                    
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
    }
        

    private getPrefabForItemType(type: string): cc.Prefab {
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

    protected update(dt: number): void {

        if (this._currentSegments.length > 0) {
            let cameraPosY: number = this.target.position.y; 
            let lastSegment = this._currentSegments[this._currentSegments.length - 1];
            let halfwayY = lastSegment.position.y;
        
            // If the camera's Y position is greater than halfwayY, it's time to recycle the first segment
            if (cameraPosY > halfwayY) {
                let newPosY = lastSegment.position.y + this.segmentHeight; // Position for the recycled segment
                let segmentToRecycle = this._currentSegments.shift(); // Remove the first segment
                this.clearSegmentExceptWaves(segmentToRecycle); // Clear all children except for the Waves node

                segmentToRecycle.setPosition(0, newPosY); // Reposition it to the top
                const segmentInfo: SegmentData = this._segmentData.segments[this._index % this._segmentData.segments.length];
                this.addObstablesAndCollectables(segmentInfo, segmentToRecycle);
                segmentToRecycle.setSiblingIndex(0);
                this._currentSegments.push(segmentToRecycle); // Add it back to the array as the last element
                this._index++;
            }
        } else {
            // Handle the case where there are no segments (e.g., log a warning or initialize segments)
            console.warn("No segments available in currentSegments array.");
        }       
    }

    private clearSegmentExceptWaves(segment: cc.Node): void {
        // Iterate through all children and remove them except for the 'Waves' node
        let children = segment.children.slice(); // Create a copy of the children array to modify it while iterating
        for (let child of children) {
            if (child.name !== "Waves") {
                child.destroy(); // Destroy the child node if it is not the 'Waves' node
            }
        }
    }

    public resetSegments(): void {
        this._currentSegments.forEach(segment => segment.destroy());
        this._currentSegments = [];
        let startPosY: number = 0;
        this.loadSegmentData();
    }
}
