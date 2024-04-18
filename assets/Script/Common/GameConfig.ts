const { ccclass, property } = cc._decorator;

@ccclass
export default class GameConfig extends cc.Component {

   @property(cc.Rect)
   boundaryRect: cc.Rect = new cc.Rect(-500, -500, 1000, 1000);

   private static instance: GameConfig;

   public static getInstance(): GameConfig {
       if (!GameConfig.instance) {
           return GameConfig.instance;
           
       }
       return GameConfig.instance;
   }

   override onLoad() {

       if (GameConfig.instance) {
           console.error("Another instance of ScoreManager already exists!");
           this.node.destroy(); // Optionally destroy the duplicate
       } else {
         GameConfig.instance = this;
           cc.game.addPersistRootNode(this.node); // Make node persistent across scenes
       }
   }

   get BoundaryRect(): cc.Rect {
      return this.boundaryRect;
  }
}
