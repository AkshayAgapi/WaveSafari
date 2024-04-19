export class BoatUpgrade {
    constructor(public id: number, public name: string, public speedMultiplier: number, public stability: number, public fuelConsumption: number, public cost: number, public unlocked: boolean = false) {}
}

export const BoatUpgradeData: BoatUpgrade[] = [
    new BoatUpgrade(1, "Basic Model", 1.0, 20, 1, 0, true),  // Default, already unlocked
    new BoatUpgrade(2, "Advanced Model", 1.5, 40, 0.8, 2000, false),
    new BoatUpgrade(3, "Pro Model", 2.0, 500, 0.6, 10000, false)
];
