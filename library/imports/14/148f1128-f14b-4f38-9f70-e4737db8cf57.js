"use strict";
cc._RF.push(module, '148f1Eo8UtPOJ9w5HN9uM9X', 'Boat');
// Script/Boat.ts

"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
const BoatInputController_1 = require("./BoatInputController");
const PathHub_1 = require("./PathHub");
const { ccclass, property } = cc._decorator;
let TriggerHandler = class TriggerHandler extends cc.Component {
    constructor() {
        super(...arguments);
        this.idleRippleEffect = null;
        this.inputController = null;
        this.currentWord = "APPLE";
        this.currentLetterIndex = 0;
    }
    onLoad() {
        let physics_manager = cc.director.getPhysicsManager();
        physics_manager.enabled = true;
        physics_manager.gravity = cc.v2(0, 0);
        // Register collision event listener
        cc.director.getCollisionManager().enabled = true; // Enable collision detection
        //cc.director.getCollisionManager().enabledDebugDraw = true; // Enable debug draw to visualize collisions
        // Listen for collision events
        cc.director.getCollisionManager().on('collision-enter', this.onCollisionEnter, this);
        cc.director.getCollisionManager().on('collision-exit', this.onCollisionExit, this);
    }
    update(dt) {
        // Assuming 'currentVelocity' is updated elsewhere in your code
        // Check if velocity is approximately zero
        if (this.inputController.isIdle) {
            // Velocity is near zero, enable the idle ripple effect
            if (!this.idleRippleEffect.active) {
                this.idleRippleEffect.active = true;
            }
        }
        else {
            // Velocity is not zero, ensure the ripple effect is disabled
            if (this.idleRippleEffect.active) {
                this.idleRippleEffect.active = false;
            }
        }
    }
    onCollisionEnter(other, self) {
        console.log('Object entered the trigger area:', other.node.name);
        const supposeLetter = this.currentWord[this.currentLetterIndex];
        const hub = other.node.getComponent(PathHub_1.default);
        console.log(hub);
        if (hub != null) {
            console.log("true");
            const hubData = hub.getData();
            if (supposeLetter == hubData) {
                //perfect collision
                other.node.destroy();
                this.currentLetterIndex++;
            }
            else {
                //do nothing as of now
            }
        }
    }
    onCollisionExit(event) {
    }
    onDestroy() {
        // Unregister collision event listener
        cc.director.getCollisionManager().off('collision-enter', this.onCollisionEnter, this);
        cc.director.getCollisionManager().off('collision-exit', this.onCollisionExit, this);
    }
};
__decorate([
    property(cc.Node)
], TriggerHandler.prototype, "idleRippleEffect", void 0);
__decorate([
    property(BoatInputController_1.default)
], TriggerHandler.prototype, "inputController", void 0);
TriggerHandler = __decorate([
    ccclass
], TriggerHandler);
exports.default = TriggerHandler;
//        const newPosition = cc.v2(this.boatSprite.node.position.x + this.currentVelocity.x * dt, this.boatSprite.node.position.y + this.currentVelocity.y * dt);

cc._RF.pop();