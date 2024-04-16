const { ccclass, property } = cc._decorator;

interface ICollectable {
    collect(): void;
}

@ccclass
export abstract class Collectable extends cc.Component implements ICollectable {
    abstract collect(): void;
}