import Joystick from "../../Module/Joystick/Joystick/Joystick";
import GameEvents, { GameEventNames } from "../Common/GameEvents";
import FuelManager from "../Manager/FuelManager";

const { ccclass, property } = cc._decorator;

@ccclass
export default class BoatInputController extends cc.Component {

    @property(Joystick)
    joystick: Joystick = null;

    movementSpeed: number = 230.0; // Units per second
    rotationSpeed: number = 200; // Degrees per second, adjusted for smoother transition
    public currentVelocity: cc.Vec3 = cc.Vec3.ZERO; // Tracking current velocity for inertia
    private targetRotation: number = 90;
    private decelerationFactor: number = 0.993; // Factor to decrease velocity each frame when joystick is released
    private idleTime: number = 0; // Time since last joystick input

    public isIdle: boolean = false; // Is the boat idle?
    private rippleMagnitude: number = 0.05; // Magnitude of the ripple effect
    private rippleFrequency: number = 1; // Frequency of the ripple effect

    private fuelManager: FuelManager = null;

    protected onLoad(): void {
        GameEvents.on(GameEventNames.FuelLow, this.HandleOnFuelLow);
        GameEvents.on(GameEventNames.FuelDepleted, this.HandleOnFuelDepleted);
        GameEvents.on(GameEventNames.FuelRefueled, this.HandleOnFuelRefuled);
    }

    protected start(): void {
        this.fuelManager = FuelManager.getInstance();
    }

    protected onDestroy(): void {
        GameEvents.off(GameEventNames.FuelLow, this.HandleOnFuelLow);
        GameEvents.off(GameEventNames.FuelDepleted, this.HandleOnFuelDepleted);
        GameEvents.off(GameEventNames.FuelRefueled, this.HandleOnFuelRefuled);
    }
    
    update(dt: number): void {
        if (this.joystick && this.joystick.Joystick_Vector.mag() > 0 && this.fuelManager.isEngineRunning) {
            let joystickIntensity = this.joystick.Joystick_Vector.mag() / this.joystick.Joystick_Max;
            this.currentVelocity = this.joystick.Joystick_Vector.normalize().mul(this.movementSpeed);
            this.idleTime = 0; // Reset idle time
            this.isIdle = false;
            this.fuelManager.consumeFuel(dt, joystickIntensity);
        } else {
            this.currentVelocity.mulSelf(this.decelerationFactor);
            this.idleTime += dt;
            if (this.idleTime > 2) { // Wait for 2 second of inactivity to consider the boat idle
                this.isIdle = true;
            }
        }

        this.handleMovement(dt);
        this.handleRotation(dt);

        if (this.isIdle) {
            this.applyIdleRippleEffect(dt);
        }
    }

    private HandleOnFuelLow = () => {
    };

    private HandleOnFuelDepleted = () => {
        this.fuelManager.stopEngine();
    };

    private HandleOnFuelRefuled = () => {
    };

    private applyIdleRippleEffect(dt: number): void {
        // Apply a slight oscillation in position and rotation to simulate water ripples
        const rippleOffset = Math.sin(this.idleTime * Math.PI * this.rippleFrequency) * this.rippleMagnitude;
        const rippleRotation = Math.cos(this.idleTime * Math.PI * this.rippleFrequency) * this.rippleMagnitude;

        this.node.position = this.node.position.add(cc.v2(rippleOffset, rippleOffset));
        this.node.angle += rippleRotation;
    }

    private handleMovement(dt: number): void {        
        const newPosition = cc.v2(this.node.position.x + this.currentVelocity.x * dt, this.node.position.y + this.currentVelocity.y * dt);
        this.node.position = newPosition;
    }
    
    private handleRotation(dt: number): void {
        if (this.joystick && this.joystick.Joystick_Vector.mag() > 0 && this.fuelManager.isEngineRunning) {
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
    

    private calculateTargetRotation(direction: cc.Vec3): void {
        const angle = direction.signAngle(cc.Vec2.RIGHT);
        this.targetRotation = -cc.misc.radiansToDegrees(angle);
    }

    private normalizeAngle(angle: number): number {
        angle %= 360;
        if (angle < -180) return angle + 360;
        if (angle > 180) return angle - 360;
        return angle;
    }

}
