"use strict";
cc._RF.push(module, 'a73c7TlYldBQ4sp2fCG1Bhw', 'BoatInputController');
// Script/BoatInputController.ts

"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
const WaterBoundarySetting_1 = require("../Data/WaterBoundarySetting");
const Joystick_1 = require("./Joystick/Joystick");
const { ccclass, property } = cc._decorator;
let BoatInputController = class BoatInputController extends cc.Component {
    constructor() {
        super(...arguments);
        this.waterBoundarySetting = null;
        this.joystick = null;
        this.movementSpeed = 230.0; // Units per second
        this.rotationSpeed = 200; // Degrees per second, adjusted for smoother transition
        this.currentVelocity = cc.Vec3.ZERO; // Tracking current velocity for inertia
        this.targetRotation = 0;
        this.decelerationFactor = 0.993; // Factor to decrease velocity each frame when joystick is released
        this.idleTime = 0; // Time since last joystick input
        // New properties for the ripple effect
        this.isIdle = false; // Is the boat idle?
        this.rippleMagnitude = 0.05; // Magnitude of the ripple effect
        this.rippleFrequency = 1; // Frequency of the ripple effect
    }
    update(dt) {
        if (this.joystick && this.joystick.Joystick_Vector.mag() > 0) {
            this.currentVelocity = this.joystick.Joystick_Vector.normalize().mul(this.movementSpeed);
            this.idleTime = 0; // Reset idle time
            this.isIdle = false;
        }
        else {
            this.currentVelocity.mulSelf(this.decelerationFactor);
            this.idleTime += dt;
            if (this.idleTime > 2) { // Wait for 1 second of inactivity to consider the boat idle
                this.isIdle = true;
            }
        }
        this.handleMovementAndInertia(dt);
        this.handleRotation(dt);
        if (this.isIdle) {
            this.applyIdleRippleEffect(dt);
        }
    }
    applyIdleRippleEffect(dt) {
        // Apply a slight oscillation in position and rotation to simulate water ripples
        const rippleOffset = Math.sin(this.idleTime * Math.PI * this.rippleFrequency) * this.rippleMagnitude;
        const rippleRotation = Math.cos(this.idleTime * Math.PI * this.rippleFrequency) * this.rippleMagnitude;
        this.node.position = this.node.position.add(cc.v2(rippleOffset, rippleOffset));
        this.node.angle += rippleRotation;
    }
    handleMovementAndInertia(dt) {
        if (this.joystick && this.joystick.Joystick_Vector.mag() > 0) {
            // Update velocity based on joystick input
            this.currentVelocity = this.joystick.Joystick_Vector.normalize().mul(this.movementSpeed);
        }
        else {
            // Apply inertia when the joystick is released
            this.currentVelocity.mulSelf(this.decelerationFactor);
        }
        // Calculate the new position based on the current velocity
        const newPosition = cc.v2(this.node.position.x + this.currentVelocity.x * dt, this.node.position.y + this.currentVelocity.y * dt);
        //if (this.waterBoundarySetting && this.waterBoundarySetting.boundaryRect.contains(newPosition)) {
        this.node.position = newPosition;
        //}
    }
    handleRotation(dt) {
        if (this.joystick && this.joystick.Joystick_Vector.mag() > 0) {
            // Calculate the target rotation based on joystick input
            this.calculateTargetRotation(this.joystick.Joystick_Vector);
        }
        // Smoothly interpolate the boat's current rotation towards the target rotation
        const currentAngle = this.node.angle;
        const targetAngle = this.targetRotation;
        // Determine the shortest direction to rotate
        const angleDifference = this.normalizeAngle(targetAngle - currentAngle);
        const rotationDirection = angleDifference > 0 ? 1 : -1;
        // Calculate rotation amount based on rotation speed and deltaTime
        let rotationAmount = this.rotationSpeed * dt;
        // If the absolute difference is less than what we would rotate this frame, clamp it
        if (Math.abs(angleDifference) < rotationAmount) {
            rotationAmount = Math.abs(angleDifference);
        }
        // Apply rotation
        this.node.angle += rotationAmount * rotationDirection;
    }
    calculateTargetRotation(direction) {
        const angle = direction.signAngle(cc.Vec2.RIGHT);
        this.targetRotation = -cc.misc.radiansToDegrees(angle);
    }
    smoothRotation(dt) {
        const difference = this.normalizeAngle(this.targetRotation - this.node.angle);
        const step = Math.min(Math.abs(difference), this.rotationSpeed * dt) * this.sign(difference);
        this.node.angle += step;
    }
    normalizeAngle(angle) {
        angle %= 360;
        if (angle < -180)
            return angle + 360;
        if (angle > 180)
            return angle - 360;
        return angle;
    }
    sign(x) {
        return x < 0 ? -1 : x > 0 ? 1 : 0;
    }
};
__decorate([
    property(WaterBoundarySetting_1.default)
], BoatInputController.prototype, "waterBoundarySetting", void 0);
__decorate([
    property(Joystick_1.default)
], BoatInputController.prototype, "joystick", void 0);
BoatInputController = __decorate([
    ccclass
], BoatInputController);
exports.default = BoatInputController;

cc._RF.pop();