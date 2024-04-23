import GameEvents, { GameEventNames } from "../Common/GameEvents";
import PlayerData from "../Data/PlayerData";
import HUDManager from "./HudManager";

const {ccclass, property} = cc._decorator;

@ccclass
export default class ScoreManager extends cc.Component  {

    private _score: number = 0;
    
    private static _instance: ScoreManager;

    public static getInstance(): ScoreManager {
        if (!ScoreManager._instance) {
            return ScoreManager._instance;
            
        }
        return ScoreManager._instance;
    }

    protected onLoad(): void {
        if (ScoreManager._instance) {
            this.node.destroy(); 
        } else {
            ScoreManager._instance = this;
            cc.game.addPersistRootNode(this.node);
        }

        GameEvents.on(GameEventNames.GameEnd, this.HandleOnGameEnd);
    }

    private HandleOnGameEnd = () => {
        PlayerData.saveTotalCoins(this._score);
    };

    public addScore(value: number): void {
        this._score += value;
        HUDManager.getInstance().setCoins(this._score);
    }

    public getScore(): number {
        return this._score;
    }

    public resetScore(): void{
        this._score = 0;
    }

    protected onDestroy(): void {
        GameEvents.off(GameEventNames.GameEnd, this.HandleOnGameEnd);
    }
}
