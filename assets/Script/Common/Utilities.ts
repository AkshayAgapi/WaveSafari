const { ccclass, property } = cc._decorator;

@ccclass
export default class Utilities {
    
    /**
     * Converts degrees to radians.
     * @param degrees Number of degrees.
     */
    static degreesToRadians(degrees: number): number {
        return degrees * Math.PI / 180;
    }

}
