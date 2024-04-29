import Joystick from "../../Module/Joystick/Joystick/Joystick";
import { GameConst } from "../Common/GameConstant";
import GameEvents, { GameEventNames } from "../Common/GameEvents";
import { BoatUpgrade } from "../Data/BoatUpgradeData";
import PlayerData from "../Data/PlayerData";
import HUDManager from "../Manager/HudManager";
import PopupManager from "../Manager/PopupManager";
import ResultPopup, { ResultState } from "../UI/ResultPopup";
import FuelController from "./FuelController";

const { ccclass, property } = cc._decorator;

@ccclass
export default class BoatInputController extends cc.Component {

    @property(Joystick)
    joystick: Joystick = null;

    public isIdle: boolean = false; 

    private _movementSpeed: number = 0; // Units per second
    private _rotationSpeed: number = 200; // Degrees per second, adjusted for smoother transition
    public _currentVelocity: cc.Vec3 = cc.Vec3.ZERO; // Tracking current velocity for inertia
    private _targetRotation: number = 90;
    private _decelerationFactor: number = 0.993; // Factor to decrease velocity each frame when joystick is released
    private _idleTime: number = 0; // Time since last joystick input
    private _rippleMagnitude: number = 0.05; // Magnitude of the ripple effect
    private _rippleFrequency: number = 1; // Frequency of the ripple effect
    private _fuelController: FuelController = null;
    private _currentBoatSetting: BoatUpgrade;
    private _autoMoveDuration: number = 5; // Duration for automatic movement
    private _autoMoveTimer: number = 0; // Timer to track the automatic movement
    private _isAutoMoving: boolean = false; // Flag to control automatic movement
    private _waitForStop: boolean = false;
    public resetting: boolean = false;

    private readonly _currentVelocityVariation : number = 10;

    protected onLoad(): void {
        GameEvents.on(GameEventNames.FuelDepleted, this.handleOnFuelDepleted);
        GameEvents.on(GameEventNames.GameCinematicTutorialStart, this.handleOnCinematicTutorialStart);
    }

    protected start(): void {
        this._fuelController = this.node.getComponent(FuelController);
        this._currentBoatSetting = PlayerData.getCurrentBoatSetting();
        this._movementSpeed = GameConst.MOVEMENT_SPEED * this._currentBoatSetting.speedMultiplier;
    }

    protected onDestroy(): void {
        GameEvents.off(GameEventNames.FuelDepleted, this.handleOnFuelDepleted);
        GameEvents.off(GameEventNames.GameCinematicTutorialStart, this.handleOnCinematicTutorialStart);
    }

    public disableControl() {
        this.enabled = false; 
    }
    
    public enableControl() {
        this.resetting = false;
        this.enabled = true;
        this._currentVelocity = cc.Vec3.ZERO;
        this._targetRotation = this.node.angle;
    }

    
    protected update(dt: number): void {

        if (!this.enabled) return;

        // Automatic movement handling
        if (this._isAutoMoving) {
            this.handleAutomaticMovement(dt);
        } else {
            // Joystick input handling
            this.handleJoystickInput(dt);
        }

        if (!this._fuelController.isEngineRunning && this._waitForStop) {
            if (this._currentVelocity.fuzzyEquals(cc.Vec3.ZERO, this._currentVelocityVariation)) {
                PopupManager.Instance().showPopup(ResultPopup, [ResultState.FuelEmpty]);
                GameEvents.dispatchEvent(GameEventNames.GameEnd);
                this._waitForStop = false; 
            }
        }


        this.handleMovement(dt);
        this.handleRotation(dt);

        // Determine if the boat is idle based on velocity
        this.isIdle = this._currentVelocity.fuzzyEquals(cc.Vec3.ZERO, this._currentVelocityVariation);

        // Apply idle effects if necessary
        if (this.isIdle) {
            this.applyIdleRippleEffect(dt);
        }
    }

    private handleAutomaticMovement(dt: number): void {
        if (this._autoMoveTimer < this._autoMoveDuration) {
            this._autoMoveTimer += dt;
            this._currentVelocity = cc.v3(0, this._movementSpeed, 0); // Move forward
        } else {
            this._isAutoMoving = false;
            this._autoMoveTimer = 0;
            GameEvents.dispatchEvent(GameEventNames.GameCinematicTutorialDone);
        }
    }

    private handleJoystickInput(dt: number): void {
        if (this.joystick && this.joystick.Joystick_Vector.mag() > 0 && this._fuelController.isEngineRunning) {
            HUDManager.Instance().setVisibilityFingerTutorial(false);
            let joystickIntensity = this.joystick.Joystick_Vector.mag() / this.joystick.Joystick_Max;
            this._currentVelocity = this.joystick.Joystick_Vector.normalize().mul(this._movementSpeed);
            this._fuelController.consumeFuel(dt, joystickIntensity);
        } else {
            this._currentVelocity.mulSelf(this._decelerationFactor);
        }
    }

    private handleOnCinematicTutorialStart = () => {
        this._isAutoMoving = true;
    };

    private handleOnFuelDepleted = () => {
        this._fuelController.stopEngine();
        this._waitForStop = true; 
    };

    private applyIdleRippleEffect(dt: number): void {
        // Apply a slight oscillation in position and rotation to simulate water ripples
        const rippleOffset = Math.sin(this._idleTime * Math.PI * this._rippleFrequency) * this._rippleMagnitude;
        const rippleRotation = Math.cos(this._idleTime * Math.PI * this._rippleFrequency) * this._rippleMagnitude;

        this.node.position = this.node.position.add(cc.v2(rippleOffset, rippleOffset));
        this.node.angle += rippleRotation;
    }

    private handleMovement(dt: number): void {        
        const newPosition = cc.v2(this.node.position.x + this._currentVelocity.x * dt, this.node.position.y + this._currentVelocity.y * dt);
        this.node.position = newPosition;
    }

    private handleRotation(dt: number): void {
        if (this.joystick && this.joystick.Joystick_Vector.mag() > 0 && this._fuelController.isEngineRunning) {
            // Calculate the target rotation based on joystick input
            this.calculateTargetRotation(this.joystick.Joystick_Vector);
        }
    
        // Smoothly interpolate the boat's current rotation towards the target rotation
        const currentAngle = this.node.angle;
        const targetAngle = this._targetRotation;
    
        // Determine the shortest direction to rotate
        const angleDifference = this.normalizeAngle(targetAngle - currentAngle);
        const rotationDirection = angleDifference > 0 ? 1 : -1;
    
        let rotationAmount = this._rotationSpeed * dt;
        
        if (Math.abs(angleDifference) < rotationAmount) {
            rotationAmount = Math.abs(angleDifference);
        }
    
        this.node.angle += rotationAmount * rotationDirection;
    }
    
    private calculateTargetRotation(direction: cc.Vec3): void {
        const angle = direction.signAngle(cc.Vec2.RIGHT);
        this._targetRotation = -cc.misc.radiansToDegrees(angle);
    }

    private normalizeAngle(angle: number): number {
        angle %= 360;
        if (angle < -180) return angle + 360;
        if (angle > 180) return angle - 360;
        return angle;
    }
}
