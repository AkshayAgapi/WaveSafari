import { Collectable } from "../Collectables/Collectable";
import { ObstacleCollider, ObstacleColliderType } from "../Collectables/ObstacleCollider";
import GameEvents, { GameEventNames } from "../Common/GameEvents";
import BoatInputController from "../Controller/BoatInputController";
import DamageController from "../Controller/DamageController";
import PopupManager from "../Manager/PopupManager";
import ResultPopup, { ResultState } from "../UI/ResultPopup";
const { ccclass, property } = cc._decorator;

@ccclass
export default class Boat extends cc.Component {

    @property(cc.Node)
    private idleRippleEffect: cc.Node = null;

    @property(cc.Node)
    private wakeEffect: cc.Node = null;

    @property(BoatInputController)
    private inputController: BoatInputController = null;

    protected onLoad() {

        let physics_manager = cc.director.getPhysicsManager()
        physics_manager.enabled = true;
        physics_manager.gravity = cc.v2 (0, 0);

        console.log("initial Rotation : "+this.node.rotation);

        // Register collision event listener
        cc.director.getCollisionManager().enabled = true; // Enable collision detection
        //cc.director.getCollisionManager().enabledDebugDraw = true; // Enable debug draw to visualize collisions

        // Listen for collision events
        cc.director.getCollisionManager().on('collision-enter', this.onCollisionEnter, this);
        cc.director.getCollisionManager().on('collision-exit', this.onCollisionExit, this);
    }

    protected update(dt: number) {
        // Assuming 'currentVelocity' is updated elsewhere in your code
        // Check if velocity is approximately zero
        if (this.inputController.isIdle) {
            // Velocity is near zero, enable the idle ripple effect
            if (!this.idleRippleEffect.active) {
                this.idleRippleEffect.active = true;
            }
        } else {
            // Velocity is not zero, ensure the ripple effect is disabled
            if (this.idleRippleEffect.active) {
                this.idleRippleEffect.active = false;
            }
        }
    }

    protected onCollisionEnter(other: cc.Collider, self: cc.Collider) {
        let collectable = other.getComponent(Collectable);
    
        if (collectable) {
            collectable.collect();
        } else {
            let obstacleCollider = other.getComponent(ObstacleCollider);
            if(obstacleCollider) {
                switch(obstacleCollider.GetObstacleColliderType()) {
                    case ObstacleColliderType.FinsihLine:
                        PopupManager.getInstance().showPopup(ResultPopup, [ResultState.FirstSafariDone]);
                        break;
                    case ObstacleColliderType.Island:
                        this.getComponent(DamageController).applyDamage();
                        break;
                }
            }
        }
    }

    protected onCollisionExit(event: cc.Event.EventCustom) {
        
    }

    protected onDestroy() {
        // Unregister collision event listener
        cc.director.getCollisionManager().off('collision-enter', this.onCollisionEnter, this);
        cc.director.getCollisionManager().off('collision-exit', this.onCollisionExit, this);
    }

    private onWakeEffect() : void{
        this.wakeEffect.active = true;
    }

    private offWakeEffect() : void{
        this.wakeEffect.active = false;
    }

    public resetPoisition(): void{
        this.inputController.resetting = true;
        this.offWakeEffect();
        this.inputController.disableControl();
        this.node.setPosition(0, 0);
        this.node.angle = 90;
        this.onWakeEffect();
        this.scheduleOnce(() => {
            this.inputController.enableControl();
        }, 0.1);    
    }
}
