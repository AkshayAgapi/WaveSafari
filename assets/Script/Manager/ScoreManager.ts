import { GenericSingleton } from "../Common/GenericSingleton";

const {ccclass, property} = cc._decorator;

@ccclass
export default class ScoreManager extends GenericSingleton<ScoreManager> {

    private score: number = 0;

    public addScore(value: number): void {
        this.score += value;
        console.log(`New Score: ${this.score}`);
        // Update UI or dispatch event if needed
    }

    public getScore(): number {
        return this.score;
    }
}
