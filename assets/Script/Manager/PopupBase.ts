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
        this.hidePopupTween();
    }

    initPopup() {
        this.popupCard.scale = 0;
        this.background.opacity = 0; 
        this.showPopupTween();
    }

    showPopupTween() {
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

    hidePopupTween() {
        // Tween for the popup card scale animation
        cc.tween(this.popupCard)
            .to(0.05, { scale: 1.1 }, { easing: 'quadIn' }) // Slightly scale up before hiding
            .to(0.1, { scale: 0 }, { easing: 'quadIn' })   // Scale down to 0
            .call(() => {
                this.node.active = false;
                this.onAnimationComplete(); // Call the callback function here
            })
            .start();
    
        // Tween for the background fade-out
        cc.tween(this.background)
            .to(0.1, { opacity: 0 }) // Fade out the background
            .start();
    }

    onAnimationComplete() {
        this.node.active = false; 
    }
}