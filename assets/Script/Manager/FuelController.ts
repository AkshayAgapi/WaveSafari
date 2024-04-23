import { GameConst } from "../Common/GameConstant";
import GameEvents, { GameEventNames } from "../Common/GameEvents";
import PlayerData from "../Data/PlayerData";
import HUDManager from "./HudManager";

const { ccclass, property } = cc._decorator;

@ccclass
export default class FuelController extends cc.Component {
    @property
    maxFuel: number = 100;  // Maximum fuel capacity

    private _fuelConsumptionRate: number = 0;  // Fuel consumption rate per second
    private _currentFuel: number = 100;
    public isEngineRunning: boolean = true;

    protected override onLoad() {
        this._currentFuel = this.maxFuel; 
        this.startEngine();
    }

    protected start(): void {
        var currentBoatSetting = PlayerData.getCurrentBoatSetting();
        this._fuelConsumptionRate = GameConst.FUEL_CONSUMPTION_RATE * currentBoatSetting.fuelConsumption;
    }

    public startEngine() {
        this.isEngineRunning = true;
    }

    public stopEngine() {
        this.isEngineRunning = false;
    }

    public consumeFuel(dt: number, joystickIntensity: number) {
        // Reduce the fuel consumption rate based on joystick intensity (0 to 1 scale)
        const consumptionModifier = Math.max(0.1, joystickIntensity);  // Ensure there's always some consumption
        const fuelUsed = this._fuelConsumptionRate * consumptionModifier * dt;
        
        if (this._currentFuel > 0) {
            this._currentFuel -= fuelUsed;
            this._currentFuel = Math.max(this._currentFuel, 0);  // Prevent fuel from going below zero
            HUDManager.getInstance().setFuel(this._currentFuel);
            if (this._currentFuel === 0) {
                GameEvents.dispatchEvent(GameEventNames.FuelDepleted);
            } else if (this._currentFuel <= this.maxFuel * 0.1) {
                GameEvents.dispatchEvent(GameEventNames.FuelLow);
            }
        }
    }

    public refuel(amount: number) {
        this._currentFuel += amount;
        this._currentFuel = Math.min(this._currentFuel, this.maxFuel);  // Prevent fuel from exceeding max capacity
        HUDManager.getInstance().setFuel(this._currentFuel);
        GameEvents.dispatchEvent(GameEventNames.FuelRefueled);
        this.startEngine();
    }
}
