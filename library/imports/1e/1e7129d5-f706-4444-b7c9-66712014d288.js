"use strict";
cc._RF.push(module, '1e712nV9wZERLfJZnEgFNKI', 'Waves');
// Shader/Waves.ts

cc.Class({
    extends: cc.Component,
    properties: {
        speed: 0.1,
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

cc._RF.pop();