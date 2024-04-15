const {ccclass, property} = cc._decorator;

@ccclass
export abstract class GenericSingleton<T> extends cc.Component {

    @property
    private destroryOnLoad = true;

    private static instances: Map<string, cc.Component> = new Map();

    public static Instance<T extends cc.Component>(this: new () => T): T {
        let className = cc.js.getClassName(this);
        // let className = this.prototype.constructor.name;

        if (!GenericSingleton.instances[className]) {
            let newNode = new cc.Node(className);
            let newComponent = newNode.addComponent(this);
            GenericSingleton.instances[className] = newComponent;
            console.log("Generic Singleton new " + className);
        }
 
        return GenericSingleton.instances[className] as T;
    }

    public static IsExist<T extends cc.Component>(this: new () => T): boolean {
        return GenericSingleton.instances.hasOwnProperty(this.prototype.constructor.name);
    }

    protected onLoad(): void {
        let className = cc.js.getClassName(this);
        // let className = this.constructor.name;
        console.log("onLoad GenericSingleton " +GenericSingleton.instances[className]);

        if(GenericSingleton.instances[className] && this.destroryOnLoad)
        {
            let existingInstance = GenericSingleton.instances[className];
            if(existingInstance && existingInstance.node)
            {
                GenericSingleton.instances.delete(className);
                existingInstance.node.destroy();
            }
            
        }

        if (GenericSingleton.instances[className] && GenericSingleton.instances[className] !== this && !this.destroryOnLoad) {
            
            this.node.destroy();
            return;
        }

        GenericSingleton.instances[className] = this;
    }
}