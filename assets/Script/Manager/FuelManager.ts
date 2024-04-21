import { GameConst } from "../Common/GameConstant";
import GameEvents, { GameEventNames } from "../Common/GameEvents";
import PlayerData from "../Data/PlayerData";
import HUDManager from "./HudManager";

const { ccclass, property } = cc._decorator;

@ccclass
export default class FuelController extends cc.Component {
    @property
    maxFuel: number = 100;  // Maximum fuel capacity

    fuelConsumptionRate: number = 0;  // Fuel consumption rate per second
    currentFuel: number = 100;
    isEngineRunning: boolean = true;

    override onLoad() {
        this.currentFuel = this.maxFuel;  // Start with full fuel
        this.startEngine();
    }

    protected start(): void {
        var currentBoatSetting = PlayerData.getCurrentBoatSetting();
        this.fuelConsumptionRate = GameConst.FUEL_CONSUMPTION_RATE * currentBoatSetting.fuelConsumption;
    }

    startEngine() {
        this.isEngineRunning = true;
    }

    stopEngine() {
        this.isEngineRunning = false;
    }

    consumeFuel(dt: number, joystickIntensity: number) {
        // Reduce the fuel consumption rate based on joystick intensity (0 to 1 scale)
        const consumptionModifier = Math.max(0.1, joystickIntensity);  // Ensure there's always some consumption
        const fuelUsed = this.fuelConsumptionRate * consumptionModifier * dt;
        
        if (this.currentFuel > 0) {
            this.currentFuel -= fuelUsed;
            this.currentFuel = Math.max(this.currentFuel, 0);  // Prevent fuel from going below zero
            HUDManager.getInstance().setFuel(this.currentFuel);
            if (this.currentFuel === 0) {
                GameEvents.dispatchEvent(GameEventNames.FuelDepleted);
                this.stopEngine();  // Automatically stop the engine when fuel is depleted
            } else if (this.currentFuel <= this.maxFuel * 0.1) {
                GameEvents.dispatchEvent(GameEventNames.FuelLow);
            }
        }
    }

    refuel(amount: number) {
        this.currentFuel += amount;
        this.currentFuel = Math.min(this.currentFuel, this.maxFuel);  // Prevent fuel from exceeding max capacity
        HUDManager.getInstance().setFuel(this.currentFuel);
        GameEvents.dispatchEvent(GameEventNames.FuelRefueled);
        this.startEngine();
    }
}
