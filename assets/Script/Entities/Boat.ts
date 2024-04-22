import { Collectable } from "../Collectables/Collectable";
import { ObstacleCollider, ObstacleColliderType } from "../Collectables/ObstacleCollider";
import GameEvents, { GameEventNames } from "../Common/GameEvents";
import BoatInputController from "../Controller/BoatInputController";
import DamageController from "../Controller/DamageController";
import PopupManager from "../Manager/PopupManager";
import { ResultState } from "../UI/ResultPopup";
const { ccclass, property } = cc._decorator;

@ccclass
export default class Boat extends cc.Component {

    @property(cc.Node)
    idleRippleEffect: cc.Node = null;

    @property(BoatInputController)
    inputController: BoatInputController = null;

    onLoad() {

        let physics_manager = cc.director.getPhysicsManager()
        physics_manager.enabled = true;
        physics_manager.gravity = cc.v2 (0, 0);

        // Register collision event listener
        cc.director.getCollisionManager().enabled = true; // Enable collision detection
        //cc.director.getCollisionManager().enabledDebugDraw = true; // Enable debug draw to visualize collisions

        // Listen for collision events
        cc.director.getCollisionManager().on('collision-enter', this.onCollisionEnter, this);
        cc.director.getCollisionManager().on('collision-exit', this.onCollisionExit, this);
    }

    update(dt: number) {
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

    onCollisionEnter(other: cc.Collider, self: cc.Collider) {
        console.log("collision : "+other.name);
        let collectable = other.getComponent(Collectable);
    
        if (collectable) {
            collectable.collect();
        } else {
            let obstacleCollider = other.getComponent(ObstacleCollider);
            if(obstacleCollider) {
                switch(obstacleCollider.GetObstacleColliderType()) {
                    case ObstacleColliderType.FinsihLine:
                        GameEvents.dispatchEvent(GameEventNames.GameSplashZoomStart);
                        PopupManager.getInstance().showResultPopup(ResultState.FirstSafariDone);
                        break;
                    case ObstacleColliderType.Island:
                        this.getComponent(DamageController).applyDamage();
                        break;
                }
            }
        }
    }

    onCollisionExit(event: cc.Event.EventCustom) {
        
    }

    onDestroy() {
        // Unregister collision event listener
        cc.director.getCollisionManager().off('collision-enter', this.onCollisionEnter, this);
        cc.director.getCollisionManager().off('collision-exit', this.onCollisionExit, this);
    }
}
