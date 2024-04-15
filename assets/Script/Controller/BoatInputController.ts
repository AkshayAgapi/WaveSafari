import GameConfig from "../Common/GameConfig";
import Joystick from "../Joystick/Joystick";

const { ccclass, property } = cc._decorator;

@ccclass
export default class BoatInputController extends cc.Component {

    @property(Joystick)
    joystick: Joystick = null;

    movementSpeed: number = 230.0; // Units per second
    rotationSpeed: number = 200; // Degrees per second, adjusted for smoother transition
    public currentVelocity: cc.Vec3 = cc.Vec3.ZERO; // Tracking current velocity for inertia
    private targetRotation: number = 0;
    private decelerationFactor: number = 0.993; // Factor to decrease velocity each frame when joystick is released
    private idleTime: number = 0; // Time since last joystick input

    // New properties for the ripple effect
    public isIdle: boolean = false; // Is the boat idle?
    private rippleMagnitude: number = 0.05; // Magnitude of the ripple effect
    private rippleFrequency: number = 1; // Frequency of the ripple effect
    private gameConfig: GameConfig = null;

    protected onLoad(): void {
        this.gameConfig = GameConfig.Instance();
    }
    
    update(dt: number): void {
        if (this.joystick && this.joystick.Joystick_Vector.mag() > 0) {
            this.currentVelocity = this.joystick.Joystick_Vector.normalize().mul(this.movementSpeed);
            this.idleTime = 0; // Reset idle time
            this.isIdle = false;
        } else {
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

    private applyIdleRippleEffect(dt: number): void {
        // Apply a slight oscillation in position and rotation to simulate water ripples
        const rippleOffset = Math.sin(this.idleTime * Math.PI * this.rippleFrequency) * this.rippleMagnitude;
        const rippleRotation = Math.cos(this.idleTime * Math.PI * this.rippleFrequency) * this.rippleMagnitude;

        this.node.position = this.node.position.add(cc.v2(rippleOffset, rippleOffset));
        this.node.angle += rippleRotation;
    }

    private handleMovementAndInertia(dt: number): void {
        if (this.joystick && this.joystick.Joystick_Vector.mag() > 0) {
            // Update velocity based on joystick input
            this.currentVelocity = this.joystick.Joystick_Vector.normalize().mul(this.movementSpeed);
        } else {
            // Apply inertia when the joystick is released
            this.currentVelocity.mulSelf(this.decelerationFactor);
        }
        
        // Calculate the new position based on the current velocity
        const newPosition = cc.v2(this.node.position.x + this.currentVelocity.x * dt, this.node.position.y + this.currentVelocity.y * dt);
        //if (this.waterBoundarySetting && this.waterBoundarySetting.boundaryRect.contains(newPosition)) {
            this.node.position = newPosition;
        //}
    }
    
    private handleRotation(dt: number): void {
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
    

    private calculateTargetRotation(direction: cc.Vec3): void {
        const angle = direction.signAngle(cc.Vec2.RIGHT);
        this.targetRotation = -cc.misc.radiansToDegrees(angle);
    }
    
    private smoothRotation(dt: number): void {
        const difference = this.normalizeAngle(this.targetRotation - this.node.angle);
        const step = Math.min(Math.abs(difference), this.rotationSpeed * dt) * this.sign(difference);
        this.node.angle += step;
    }

    private normalizeAngle(angle: number): number {
        angle %= 360;
        if (angle < -180) return angle + 360;
        if (angle > 180) return angle - 360;
        return angle;
    }

    private sign(x: number): number {
        return x < 0 ? -1 : x > 0 ? 1 : 0;
    }
}
