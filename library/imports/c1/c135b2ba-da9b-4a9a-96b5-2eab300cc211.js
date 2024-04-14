"use strict";
cc._RF.push(module, 'c135bK62ptKmpa1LqswDMIR', 'SegmentManager');
// Script/SegmentManager.ts

"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
const { ccclass, property } = cc._decorator;
let SegmentManager = class SegmentManager extends cc.Component {
    constructor() {
        super(...arguments);
        this.segmentPrefab = null;
        this.island1Prefab = null;
        this.island2Prefab = null;
        this.obstaclePrefab = null;
        this.gemPrefab = null;
        this.fuelCanPrefab = null;
        this.target = null;
        this.initialSegmentsCount = 5;
        this.segmentHeight = 200;
        this.currentSegments = [];
        this.segmentData = { segments: [] };
    }
    onLoad() {
        this.currentSegments = [];
        this.loadSegmentData();
    }
    loadSegmentData() {
        cc.loader.loadRes("Data/SegmentData", cc.JsonAsset, (err, data) => {
            if (err) {
                cc.error(err);
                return;
            }
            this.segmentData = data.json;
            this.createInitialSegments();
        });
    }
    createInitialSegments() {
        let startPosY = 0;
        for (let i = 0; i < this.initialSegmentsCount; i++) {
            this.addSegment(startPosY, i);
            startPosY += this.segmentHeight;
        }
    }
    addSegment(yPosition, segmentIndex) {
        const segmentInfo = this.segmentData.segments[segmentIndex % this.segmentData.segments.length];
        const newSegment = cc.instantiate(this.segmentPrefab);
        newSegment.setParent(this.node);
        newSegment.setPosition(cc.v2(0, yPosition));
        segmentInfo.items.forEach((item) => {
            const prefab = this.getPrefabForItemType(item.type);
            if (prefab) {
                const newItem = cc.instantiate(prefab);
                newItem.name = item.type.toString();
                newItem.setParent(newSegment);
                newItem.setPosition(cc.v2(item.position.x, item.position.y));
                // Set scale if it's defined
                if (item.scale) {
                    newItem.setScale(item.scale.x, item.scale.y);
                }
                else {
                    // Optionally set a default scale, or do nothing to keep prefab's original scale
                    newItem.setScale(1, 1); // Default scale, adjust as needed
                }
                if (item.anchor) {
                    newItem.setAnchorPoint(item.anchor.x, item.anchor.y);
                }
                else {
                    // Optionally set a default scale, or do nothing to keep prefab's original scale
                    newItem.setAnchorPoint(0.5, 0.5);
                }
                if (item.size) {
                    newItem.setContentSize(new cc.Size(item.size.width, item.size.height));
                }
                else {
                    // Optionally set a default scale, or do nothing to keep prefab's original scale
                    newItem.setContentSize(new cc.Size(400, 400));
                }
                // Set rotation if it's defined
                if (typeof item.rotation !== 'undefined') {
                    newItem.angle = item.rotation;
                }
                else {
                    // Optionally set a default rotation, or do nothing to keep prefab's original rotation
                    newItem.angle = 0; // Default rotation, adjust as needed
                }
            }
        });
        this.currentSegments.push(newSegment);
    }
    getPrefabForItemType(type) {
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
            default:
                return null;
        }
    }
    update(dt) {
        if (this.currentSegments.length > 0) {
            let cameraPosY = this.target.position.y; // or this.target.position.y for player's Y position
            let lastSegment = this.currentSegments[this.currentSegments.length - 1];
            let halfwayY = lastSegment.position.y;
            // If the camera's Y position is greater than halfwayY, it's time to recycle the first segment
            if (cameraPosY > halfwayY) {
                let newPosY = lastSegment.position.y + this.segmentHeight; // Position for the recycled segment
                let segmentToRecycle = this.currentSegments.shift(); // Remove the first segment
                segmentToRecycle.setPosition(0, newPosY); // Reposition it to the top
                this.currentSegments.push(segmentToRecycle); // Add it back to the array as the last element
            }
        }
        else {
            // Handle the case where there are no segments (e.g., log a warning or initialize segments)
            console.warn("No segments available in currentSegments array.");
        }
    }
};
__decorate([
    property(cc.Prefab)
], SegmentManager.prototype, "segmentPrefab", void 0);
__decorate([
    property(cc.Prefab)
], SegmentManager.prototype, "island1Prefab", void 0);
__decorate([
    property(cc.Prefab)
], SegmentManager.prototype, "island2Prefab", void 0);
__decorate([
    property(cc.Prefab)
], SegmentManager.prototype, "obstaclePrefab", void 0);
__decorate([
    property(cc.Prefab)
], SegmentManager.prototype, "gemPrefab", void 0);
__decorate([
    property(cc.Prefab)
], SegmentManager.prototype, "fuelCanPrefab", void 0);
__decorate([
    property(cc.Node)
], SegmentManager.prototype, "target", void 0);
__decorate([
    property
], SegmentManager.prototype, "initialSegmentsCount", void 0);
__decorate([
    property
], SegmentManager.prototype, "segmentHeight", void 0);
SegmentManager = __decorate([
    ccclass
], SegmentManager);
exports.default = SegmentManager;

cc._RF.pop();