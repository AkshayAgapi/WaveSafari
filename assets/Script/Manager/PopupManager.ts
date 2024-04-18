import ResultPopup, { ResultState } from "../Popup/ResultPopup";
import { PopupBase } from "./PopupBase";

const { ccclass, property } = cc._decorator;

@ccclass
export default class PopupManager extends cc.Component {
    @property(PopupBase)
    mainPopup: PopupBase = null;

    @property(ResultPopup)
    resultPopup: ResultPopup = null;

    private static instance: PopupManager;

    public static getInstance(): PopupManager {
        if (!PopupManager.instance) {
            return PopupManager.instance;
            
        }
        return PopupManager.instance;
    }
 
    override onLoad() {
 
        if (PopupManager.instance) {
            this.node.destroy(); 
        } else {
            PopupManager.instance = this; 
        }
    }

    public showMainPopup(): void {
        this.mainPopup.OnShow();
    }

    public showResultPopup(state: ResultState): void {
        this.resultPopup.setState(state);
        this.resultPopup.OnShow();
    }

    public hideMainPopup(): void {
        this.mainPopup.OnHide();
    }

    public hideResultPopup(): void {
        this.resultPopup.OnHide();
    }
}