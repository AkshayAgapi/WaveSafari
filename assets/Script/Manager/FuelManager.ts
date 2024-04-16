import GameEvents, { GameEventNames } from "../Common/GameEvents";
import { GenericSingleton } from "../Common/GenericSingleton";

const { ccclass, property } = cc._decorator;

@ccclass
export default class FuelManager extends GenericSingleton<FuelManager> {
    @property
    maxFuel: number = 100;  // Maximum fuel capacity

    fuelConsumptionRate: number = 6;  // Fuel consumption rate per second
    currentFuel: number = 100;
    isEngineRunning: boolean = true;

    override onLoad() {
        this.currentFuel = this.maxFuel;  // Start with full fuel
        this.startEngine();
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
            console.log("currentfuel : "+this.currentFuel);
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
        GameEvents.dispatchEvent(GameEventNames.FuelRefueled);
        this.startEngine();
    }
}
