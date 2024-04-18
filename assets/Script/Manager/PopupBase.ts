const { ccclass, property } = cc._decorator;

@ccclass
export abstract class PopupBase extends cc.Component {

    @property(cc.Node)
    popupCard: cc.Node = null;

    @property(cc.Node)
    background: cc.Node = null; 

    public OnShow(): void {
        this.node.active = true; 
        this.initPopup();
    }

    public OnHide(): void {
        this.node.active = false; 
    }

    initPopup() {
        this.popupCard.scale = 0;
        this.background.opacity = 0; 
        this.showPopup();
    }

    showPopup() {
        // Tween for the background fade-in
        cc.tween(this.background)
            .to(0.3, { opacity: 148 })
            .start();

        // Tween for the popup card scale animation
        cc.tween(this.popupCard)
            .to(0.3, { scale: 1.1 }, { easing: 'quadOut' }) 
            .to(0.2, { scale: 1 }, { easing: 'quadOut' })
            .start();
    }
}