"use strict";
cc._RF.push(module, '55d538X035Bsq9J+iTANxGZ', 'CameraController');
// Script/CameraController.ts

"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
const WaterBoundarySetting_1 = require("../Data/WaterBoundarySetting");
const { ccclass, property } = cc._decorator;
let CameraController = class CameraController extends cc.Component {
    constructor() {
        super(...arguments);
        this.target = null;
        this.offsetX = 1000; // Adjust as needed for left and right boundaries
        this.waterBoundarySetting = null;
    }
    update(dt) {
        if (!this.target)
            return;
        // Calculate the camera's horizontal boundaries with offsets
        let boundaryRect = this.waterBoundarySetting.boundaryRect;
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
};
__decorate([
    property(cc.Node)
], CameraController.prototype, "target", void 0);
__decorate([
    property
], CameraController.prototype, "offsetX", void 0);
__decorate([
    property(WaterBoundarySetting_1.default)
], CameraController.prototype, "waterBoundarySetting", void 0);
CameraController = __decorate([
    ccclass
], CameraController);
exports.default = CameraController;

cc._RF.pop();