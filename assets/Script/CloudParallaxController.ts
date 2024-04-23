const {ccclass, property} = cc._decorator;

@ccclass
export default class CloudParallaxController extends cc.Component {
    @property(cc.Node)
    boat: cc.Node = null;

    @property([cc.Node])
    clouds: cc.Node[] = []; 

    @property
    parallaxFactor: number = 0.05;

    private _lastBoatY: number = 0;

    protected onLoad() {
        this._lastBoatY = this.boat.position.y;
    }

    protected update(dt: number) {
        let deltaY = this.boat.position.y - this._lastBoatY;
        
        // Apply the parallax effect to each cloud
        this.clouds.forEach(cloud => {
            cloud.y -= deltaY * this.parallaxFactor;
        });

        this._lastBoatY = this.boat.position.y;
    }
}
