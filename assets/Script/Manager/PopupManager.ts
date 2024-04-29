import { GenericSingleton } from "../Common/GenericSingleton";
import { PopupBase } from "../UI/Base/PopupBase";

const {ccclass, property} = cc._decorator;

@ccclass
export default class PopupManager extends GenericSingleton<PopupManager> {

    @property([PopupBase])
    popupPrefabs: PopupBase[] = [];

    private _popups: Map<string, PopupBase> = new Map();

    protected onLoad() {
        super.onLoad();
        this.registerAllPopups();
    }

    private registerAllPopups() {
        this.popupPrefabs.forEach(prefab => {
            this._popups.set(prefab.name, prefab);
            prefab.node.active = false;
        });
    }

    public showPopup<T extends PopupBase>(ctor: { new(): T }, params?: any[]): void {
        const popup = this.getPopupByConstructor(ctor);
        if (popup) {
            // this._popups.forEach(p => {
            //     if (p !== popup) {
            //         p.onHide();
            //     }
            // });
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
