cc.Class({
    extends: cc.Component,

    properties: {
        speed: 0.1, // Control the speed of the movement
    },

    start() {
        this.time = 0;
        this.material = this.getComponent(cc.Sprite).getMaterial(0); // Assuming the sprite component uses this shader
    },

    update(dt) {
        this.time += dt * this.speed;
        this.material.setProperty('time', this.time);
    },
});
