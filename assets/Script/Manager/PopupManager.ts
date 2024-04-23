import { PopupBase } from "./PopupBase";

const {ccclass, property} = cc._decorator;

@ccclass
export default class PopupManager extends cc.Component {

    @property([PopupBase])
    popupPrefabs: PopupBase[] = [];

    private _popups: Map<string, PopupBase> = new Map();
    private static instance: PopupManager;

    public static getInstance(): PopupManager {
        if (!PopupManager.instance) {
            PopupManager.instance = new PopupManager();
        }
        return PopupManager.instance;
    }

    onLoad() {
        if (PopupManager.instance) {
            this.node.destroy();
        } else {
            PopupManager.instance = this;
            cc.game.addPersistRootNode(this.node); // Make this node persistent
            this.registerAllPopups();
        }
    }

    private registerAllPopups() {
        this.popupPrefabs.forEach(prefab => {
            this._popups.set(prefab.name, prefab);
            prefab.node.active = false; // Initially deactivate
        });
    }

    public showPopup<T extends PopupBase>(ctor: { new(): T }, params?: any[]): void {
        const popup = this.getPopupByConstructor(ctor);
        if (popup) {
            this._popups.forEach(p => {
                if (p !== popup) {
                    p.onHide();
                }
            });
            popup.onShow(params);
        } else {
            console.warn(`PopupManager: Popup not found.`);
        }
    }

    public hidePopup<T extends PopupBase>(ctor: { new(): T }): void {
        const popup = this.getPopupByConstructor(ctor);
        if (popup) {
            popup.onHide();
        } else {
            console.warn(`PopupManager: Popup not found.`);
        }
    }

    private getPopupByConstructor<T extends PopupBase>(ctor: { new(): T }): PopupBase | undefined {
        for (let [key, popup] of this._popups) {
            if (popup instanceof ctor) {
                return popup;
            }
        }
        return undefined;
    }
}
