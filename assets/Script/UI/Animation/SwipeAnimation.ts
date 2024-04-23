const {ccclass, property} = cc._decorator;

@ccclass
export default class SwipeAnimation extends cc.Component {

    @property(cc.Node)
    fingerSprite: cc.Node = null; // Assign your finger sprite in the editor

    @property
    moveDistance: number = 100; // The distance the finger should move upwards

    @property
    duration: number = 1; // The duration of the swipe animation

    onLoad() {
        this.startSwipeAnimation();
    }

    startSwipeAnimation() {
        const originalPosition = this.fingerSprite.position;
        const targetPosition = originalPosition.add(cc.v2(0, this.moveDistance)); // Calculate the target position
        
        // Create the tween
        const swipeTween = cc.tween(this.fingerSprite)
            .to(this.duration, { position: targetPosition }) // Move up
            .call(() => this.fingerSprite.position = originalPosition) // Reset position
            .delay(0.5); // Delay before repeating the animation
        
        // Repeat the tween indefinitely
        cc.tween(this.fingerSprite)
            .repeatForever(swipeTween)
            .start();
    }

    onDestroy() {
        this.fingerSprite.stopAllActions();
    }
}
