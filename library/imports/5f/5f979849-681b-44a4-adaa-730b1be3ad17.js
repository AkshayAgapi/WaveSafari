"use strict";
cc._RF.push(module, '5f979hJaBtEpK2qcwsb460X', 'SegmentToJsonTool');
// Script/SegmentToJsonTool.ts

"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
const { ccclass, property } = cc._decorator;
let SegmentToJsonTool = class SegmentToJsonTool extends cc.Component {
    constructor() {
        super(...arguments);
        this.segmentNode = null; // Assign your segment prefab instance here
    }
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
            }
            else if (child.name.indexOf("Gem") === 0) {
                type = "gem";
            }
            else if (child.name.indexOf("Island1") === 0) {
                type = "island1";
            }
            else if (child.name.indexOf("Island2") === 0) {
                type = "island2";
            }
            else if (child.name.indexOf("FuelCan") === 0) {
                type = "fuelCan";
            }
            // Add item to segment data with position, scale, and rotation
            if (type) {
                segmentData.items.push({
                    type: type,
                    position: { x: child.position.x, y: child.position.y },
                    scale: { x: child.scaleX, y: child.scaleY },
                    rotation: child.angle,
                    anchor: child.getAnchorPoint(),
                    size: child.getContentSize()
                });
            }
        });
        // Log or export the JSON string
        console.log(JSON.stringify(segmentData, null, 4)); // Pretty print JSON
    }
};
__decorate([
    property(cc.Node)
], SegmentToJsonTool.prototype, "segmentNode", void 0);
SegmentToJsonTool = __decorate([
    ccclass
], SegmentToJsonTool);
exports.default = SegmentToJsonTool;

cc._RF.pop();