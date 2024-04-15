const { ccclass, property } = cc._decorator;

@ccclass
export default class FuelManager extends cc.Component {
    @property
    maxFuel: number = 100;  // Maximum fuel capacity

    @property
    fuelConsumptionRate: number = 1;  // Fuel consumption rate per second

    currentFuel: number;
    isEngineRunning: boolean = false;

    // Event dispatcher for fuel-related events
    private eventTarget: cc.EventTarget = new cc.EventTarget();

    onLoad() {
        this.currentFuel = this.maxFuel;  // Start with full fuel
    }

    startEngine() {
        this.isEngineRunning = true;
    }

    stopEngine() {
        this.isEngineRunning = false;
    }

    update(dt: number) {
        if (this.isEngineRunning) {
            this.consumeFuel(dt);
        }
    }

    consumeFuel(dt: number) {
        if (this.currentFuel > 0) {
            this.currentFuel -= this.fuelConsumptionRate * dt;
            this.currentFuel = Math.max(this.currentFuel, 0);  // Prevent fuel from going below zero

            if (this.currentFuel === 0) {
                this.eventTarget.emit('fuel-depleted');
                this.stopEngine();  // Automatically stop the engine when fuel is depleted
            } else if (this.currentFuel <= this.maxFuel * 0.1) {
                this.eventTarget.emit('fuel-low');
            }
        }
    }

    refuel(amount: number) {
        this.currentFuel += amount;
        this.currentFuel = Math.min(this.currentFuel, this.maxFuel);  // Prevent fuel from exceeding max capacity
        this.eventTarget.emit('fuel-refueled');
    }

    on(eventName: string, callback: Function, target?: any) {
        this.eventTarget.on(eventName, callback, target);
    }

    off(eventName: string, callback: Function, target?: any) {
        this.eventTarget.off(eventName, callback, target);
    }
}
