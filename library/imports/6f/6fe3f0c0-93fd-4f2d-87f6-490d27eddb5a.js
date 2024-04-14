"use strict";
cc._RF.push(module, '6fe3fDAk/1PLYf2SQ0n7dta', 'Joystick');
// Script/Joystick/Joystick.ts

"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
const { ccclass, property } = cc._decorator;
let Joystick = class Joystick extends cc.Component {
    constructor() {
        super(...arguments);
        this.JoystickNode = null;
        this.Joystick_Ball = null;
        this.Joystick_Vector = cc.v3();
        this.Joystick_Max = 100;
    }
    onLoad() {
        this.node.on(cc.Node.EventType.TOUCH_START, this.Joystick_Touch_Start, this);
        this.node.on(cc.Node.EventType.TOUCH_MOVE, this.Joystick_Touch_Move, this);
        this.node.on(cc.Node.EventType.TOUCH_END, this.Joystick_Touch_End, this);
        this.node.on(cc.Node.EventType.TOUCH_CANCEL, this.Joystick_Touch_End, this);
        // Initially hide or position the joystick off-screen
        // this.node.setPosition(offScreenPosition);
        // OR
        this.JoystickNode.active = false;
    }
    Joystick_Touch_Start(event) {
        let touch_pos = event.getLocation();
        let world_pos = this.node.convertToNodeSpaceAR(touch_pos);
        // Assuming 'this.joystickNode' refers to your actual joystick node
        this.JoystickNode.setPosition(world_pos);
        this.JoystickNode.active = true;
    }
    Joystick_Touch_Move(event) {
        let touch = event.getTouches()[0];
        let touch_pos = touch.getLocation();
        // Convert the touch position to the JoystickNode's local space
        let local_touch_pos = this.JoystickNode.convertToNodeSpaceAR(touch_pos);
        // Limit the joystick vector based on the joystick's max radius
        let limitedVector = this.Limit_joystick_Vector(local_touch_pos);
        this.Set_Joystick_Ball_Position(limitedVector); // Pass the limited vector for setting position
        this.Joystick_Vector = limitedVector;
    }
    Joystick_Touch_End() {
        this.Joystick_Vector = cc.Vec3.ZERO;
        this.Set_Joystick_Ball_Position(cc.Vec3.ZERO);
        // Optionally hide or move the joystick off-screen
        // this.node.setPosition(offScreenPosition);
        // OR
        this.JoystickNode.active = false; // Make the whole joystick disappear after lifting the finger
    }
    Set_Joystick_Ball_Position(pos) {
        this.Joystick_Ball.setPosition(pos);
    }
    Limit_joystick_Vector(joystick_vector) {
        let input_mag = joystick_vector.mag();
        if (input_mag > this.Joystick_Max) {
            // Create a new limited vector without modifying the original joystick_vector
            return joystick_vector.normalize().mul(this.Joystick_Max);
        }
        return joystick_vector;
    }
};
__decorate([
    property(cc.Node)
], Joystick.prototype, "JoystickNode", void 0);
__decorate([
    property(cc.Node)
], Joystick.prototype, "Joystick_Ball", void 0);
__decorate([
    property
], Joystick.prototype, "Joystick_Vector", void 0);
__decorate([
    property
], Joystick.prototype, "Joystick_Max", void 0);
Joystick = __decorate([
    ccclass
], Joystick);
exports.default = Joystick;

cc._RF.pop();