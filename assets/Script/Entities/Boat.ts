import { Collectable } from "../Collectables/Collectable";
import { ObstacleCollider, ObstacleColliderType } from "../Collectables/ObstacleCollider";
import GameEvents, { GameEventNames } from "../Common/GameEvents";
import BoatInputController from "../Controller/BoatInputController";
import DamageController from "../Controller/DamageController";
import PlayerData from "../Data/PlayerData";
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

        // Register collision event listener
        cc.director.getCollisionManager().enabled = true;
        //cc.director.getCollisionManager().enabledDebugDraw = true;

        cc.director.getCollisionManager().on('collision-enter', this.onCollisionEnter, this);
    }

    protected update(dt: number) {
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
                        PlayerData.firstTimeDone();
                        PopupManager.Instance().showPopup(ResultPopup, [ResultState.FirstSafariDone]);
                        GameEvents.dispatchEvent(GameEventNames.GameEnd);
                        break;
                    case ObstacleColliderType.Island:
                        this.getComponent(DamageController).applyDamage();
                        break;
                }
            }
        }
    }

    protected onDestroy() {
        // Unregister collision event listener
        cc.director.getCollisionManager().off('collision-enter', this.onCollisionEnter, this);
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
