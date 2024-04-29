import AudioManager, { SoundClipType } from "../Manager/AudioManager";
import { PopupBase } from "./Base/PopupBase";

const {ccclass, property} = cc._decorator;

@ccclass
export default class CommonPopup extends PopupBase {
    
    @property(cc.Button)
    okButton: cc.Button = null;

    @property(cc.Label)
    mainText: cc.Label = null;

    @property(cc.Label)
    btnText: cc.Label = null;

    private _btnActionCallback: () => void = null;

    protected onLoad() {
        if (this.okButton) {
            this.okButton.node.on('click', this.onOkButtonCliked, this);
        }
    }

    protected onDestroy() {
        if (this.okButton) {
            this.okButton.node.off('click', this.onOkButtonCliked, this);
        }
    }

    protected setupPopup(params?: any[]): void {
        if(params.length == 3){
            if (typeof params[0] === 'string') {
                this.mainText.string = params[0];
            }
            if (typeof params[1] === 'string') {
                this.btnText.string = params[1];
            } 
            if (typeof params[2] === 'function') {
                this._btnActionCallback = params[2];
            }
        }    
    }

    public onShow(params?: any[]): void {
        super.onShow(params);
    }

    public onHide(): void {
        super.onHide();
    }

    private onOkButtonCliked(): void {
        AudioManager.Instance().playSfx(SoundClipType.BUTTON_CLICK_SFX);
        this._btnActionCallback();
        this.onHide();
    }
}
