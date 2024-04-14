"use strict";
cc._RF.push(module, '994c24MbeVLQIMurLUZfULF', 'WaterBoundarySetting');
// Data/WaterBoundarySetting.ts

"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
const { ccclass, property } = cc._decorator;
let NewClass = class NewClass extends cc.Component {
    constructor() {
        super(...arguments);
        this.boundaryRect = new cc.Rect(-500, -500, 1000, 1000);
        this.graphics = null;
    }
    onLoad() {
        // Ensure debugGraphics is initialized
        this.graphics = this.node.getComponent(cc.Graphics);
        if (!this.graphics) {
            this.graphics = this.node.addComponent(cc.Graphics);
        }
        // Draw dotted line around the boundaryRect
        this.drawDottedRect(this.boundaryRect, 150);
    }
    drawDottedRect(rect, offset) {
        if (!this.graphics)
            return;
        const segmentLength = 50; // Length of each segment
        // Set line style for semi-transparent strokes
        this.graphics.lineWidth = 8;
        this.graphics.strokeColor = new cc.Color(0, 0, 0, 50); // Semi-transparent black
        // Draw top side
        for (let i = rect.xMin - offset; i < rect.xMax + offset; i += segmentLength * 2) {
            this.graphics.moveTo(i, rect.yMin - offset);
            this.graphics.lineTo(i + segmentLength, rect.yMin - offset);
        }
        // Draw right side
        for (let i = rect.yMin - offset; i < rect.yMax + offset; i += segmentLength * 2) {
            this.graphics.moveTo(rect.xMax + offset, i);
            this.graphics.lineTo(rect.xMax + offset, i + segmentLength);
        }
        // Draw bottom side
        for (let i = rect.xMax + offset; i > rect.xMin - offset; i -= segmentLength * 2) {
            this.graphics.moveTo(i, rect.yMax + offset);
            this.graphics.lineTo(i - segmentLength, rect.yMax + offset);
        }
        // Draw left side
        for (let i = rect.yMax + offset; i > rect.yMin - offset; i -= segmentLength * 2) {
            this.graphics.moveTo(rect.xMin - offset, i);
            this.graphics.lineTo(rect.xMin - offset, i - segmentLength);
        }
        // Stroke path
        this.graphics.stroke();
    }
};
__decorate([
    property(cc.Rect)
], NewClass.prototype, "boundaryRect", void 0);
NewClass = __decorate([
    ccclass
], NewClass);
exports.default = NewClass;

cc._RF.pop();