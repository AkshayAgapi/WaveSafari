const { ccclass, property } = cc._decorator;

interface ICollectable {
    collect(): void;
}

@ccclass
export abstract class Collectable extends cc.Component implements ICollectable {
    private camera: cc.Camera = null;

    protected start(): void {
        this.camera = cc.Camera.main;
    }

    abstract collect(): void;

    protected showCollectableAnimation() : void
    {
        let viewportTopLeft = this.camera.getScreenToWorldPoint(cc.v2(0, cc.winSize.height));
        let endPos = this.node.parent.convertToNodeSpaceAR(viewportTopLeft);

        // Move the coin using a tween to the calculated position
        cc.tween(this.node)
            .to(1, { position: endPos }, { easing: 'sineInOut' })
            .call(() => {
                this.node.destroy(); 
            })
            .start();
        }
}