import HUDManager from "./HudManager";

const {ccclass, property} = cc._decorator;

@ccclass
export default class ScoreManager extends cc.Component  {

    private score: number = 0;
    
    private static instance: ScoreManager;

    public static getInstance(): ScoreManager {
        if (!ScoreManager.instance) {
            return ScoreManager.instance;
            
        }
        return ScoreManager.instance;
    }

    protected onLoad(): void {
        if (ScoreManager.instance) {
            this.node.destroy(); 
        } else {
            ScoreManager.instance = this;
            cc.game.addPersistRootNode(this.node);
        }
    }

    public addScore(value: number): void {
        this.score += value;
        HUDManager.getInstance().setCoins(this.score);
    }

    public getScore(): number {
        return this.score;
    }
}
