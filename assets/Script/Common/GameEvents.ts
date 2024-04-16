const { ccclass, property } = cc._decorator;

@ccclass
export default class GameEvents {
    private static listeners: Map<string, Function[]> = new Map();

    static on(eventName: string, callback: Function) {
        let callbacks = this.listeners.get(eventName);
        if (!callbacks) {
            callbacks = [];
            this.listeners.set(eventName, callbacks);
        }
        callbacks.push(callback);
        console.log(`Subscribed to ${eventName}`, callbacks);
    }
    
    static off(eventName: string, callback: Function) {
        const callbacks = this.listeners.get(eventName);
        if (callbacks) {
            const index = callbacks.indexOf(callback);
            if (index !== -1) {
                callbacks.splice(index, 1);
                console.log(`Unsubscribed from ${eventName}`, callback);
            }
        }
    }
    
    static dispatchEvent(eventName: string, ...args: any[]) {
        const callbacks = this.listeners.get(eventName);
        console.log(`Dispatching ${eventName} with args`, args);
        if (callbacks) {
            callbacks.forEach(callback => {
                callback(...args);
            });
        }
    }
    
}

// Event Names as constants
export const GameEventNames = {
    GameStateChange: 'GameStateChange',
    FuelDepleted: 'FuelDepleted',
    FuelLow: 'FuelLow',
    FuelRefueled: 'FuelRefueled',
    SimpleEvent: 'SimpleEvent'
};