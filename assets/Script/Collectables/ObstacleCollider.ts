const {ccclass, property} = cc._decorator;

export enum ObstacleColliderType
{
    Default,
    FinsihLine,
    Island,
    Stone
}

@ccclass
export class ObstacleCollider extends cc.Component {

    @property({type: cc.Enum(ObstacleColliderType)})
    obstacleColliderType: ObstacleColliderType = ObstacleColliderType.Default;

    public GetObstacleColliderType() : ObstacleColliderType {
        return this.obstacleColliderType;
    }

}