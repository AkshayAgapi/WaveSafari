window.__require = function t(e, o, r) {
function n(c, s) {
if (!o[c]) {
if (!e[c]) {
var a = c.split("/");
a = a[a.length - 1];
if (!e[a]) {
var l = "function" == typeof __require && __require;
if (!s && l) return l(a, !0);
if (i) return i(a, !0);
throw new Error("Cannot find module '" + c + "'");
}
}
var p = o[c] = {
exports: {}
};
e[c][0].call(p.exports, function(t) {
return n(e[c][1][t] || t);
}, p, p.exports, t, e, o, r);
}
return o[c].exports;
}
for (var i = "function" == typeof __require && __require, c = 0; c < r.length; c++) n(r[c]);
return n;
}({
AtoZLetterData: [ function(t, e, o) {
"use strict";
cc._RF.push(e, "435d3lAaWVPUJo1xl+TRqE8", "AtoZLetterData");
var r = this && this.__extends || function() {
var t = function(e, o) {
return (t = Object.setPrototypeOf || {
__proto__: []
} instanceof Array && function(t, e) {
t.__proto__ = e;
} || function(t, e) {
for (var o in e) e.hasOwnProperty(o) && (t[o] = e[o]);
})(e, o);
};
return function(e, o) {
t(e, o);
function r() {
this.constructor = e;
}
e.prototype = null === o ? Object.create(o) : (r.prototype = o.prototype, new r());
};
}(), n = this && this.__decorate || function(t, e, o, r) {
var n, i = arguments.length, c = i < 3 ? e : null === r ? r = Object.getOwnPropertyDescriptor(e, o) : r;
if ("object" == typeof Reflect && "function" == typeof Reflect.decorate) c = Reflect.decorate(t, e, o, r); else for (var s = t.length - 1; s >= 0; s--) (n = t[s]) && (c = (i < 3 ? n(c) : i > 3 ? n(e, o, c) : n(e, o)) || c);
return i > 3 && c && Object.defineProperty(e, o, c), c;
};
Object.defineProperty(o, "__esModule", {
value: !0
});
var i = cc._decorator, c = i.ccclass, s = i.property, a = function() {
return function(t, e) {
this.name = t;
this.sprite = e;
};
}(), l = function(t) {
r(e, t);
function e() {
var e = null !== t && t.apply(this, arguments) || this;
e.letter = [];
e.letterSprite = [];
e.customItems = [];
return e;
}
e.prototype.onLoad = function() {
var t = this;
this.customItems = this.letterSprite.map(function(e, o) {
return new a(t.letter[o], e);
});
};
n([ s({
type: [ cc.String ],
tooltip: "Names for custom items"
}) ], e.prototype, "letter", void 0);
n([ s({
type: [ cc.SpriteFrame ],
tooltip: "Sprites for custom items"
}) ], e.prototype, "letterSprite", void 0);
n([ s({
tooltip: "Array of custom items"
}) ], e.prototype, "customItems", void 0);
return e = n([ c ], e);
}(cc.Component);
o.default = l;
cc._RF.pop();
}, {} ],
BoatInputController: [ function(t, e, o) {
"use strict";
cc._RF.push(e, "a73c7TlYldBQ4sp2fCG1Bhw", "BoatInputController");
var r = this && this.__decorate || function(t, e, o, r) {
var n, i = arguments.length, c = i < 3 ? e : null === r ? r = Object.getOwnPropertyDescriptor(e, o) : r;
if ("object" == typeof Reflect && "function" == typeof Reflect.decorate) c = Reflect.decorate(t, e, o, r); else for (var s = t.length - 1; s >= 0; s--) (n = t[s]) && (c = (i < 3 ? n(c) : i > 3 ? n(e, o, c) : n(e, o)) || c);
return i > 3 && c && Object.defineProperty(e, o, c), c;
};
Object.defineProperty(o, "__esModule", {
value: !0
});
const n = t("../Data/WaterBoundarySetting"), i = t("./Joystick/Joystick"), {ccclass: c, property: s} = cc._decorator;
let a = class extends cc.Component {
constructor() {
super(...arguments);
this.waterBoundarySetting = null;
this.joystick = null;
this.movementSpeed = 230;
this.rotationSpeed = 150;
this.currentVelocity = cc.Vec3.ZERO;
this.targetRotation = 0;
this.decelerationFactor = .993;
this.idleTime = 0;
this.isIdle = !1;
this.rippleMagnitude = .05;
this.rippleFrequency = 1;
}
update(t) {
if (this.joystick && this.joystick.Joystick_Vector.mag() > 0) {
this.currentVelocity = this.joystick.Joystick_Vector.normalize().mul(this.movementSpeed);
this.idleTime = 0;
this.isIdle = !1;
} else {
this.currentVelocity.mulSelf(this.decelerationFactor);
this.idleTime += t;
this.idleTime > 2 && (this.isIdle = !0);
}
this.handleMovementAndInertia(t);
this.handleRotation(t);
this.isIdle && this.applyIdleRippleEffect(t);
}
applyIdleRippleEffect(t) {
const e = Math.sin(this.idleTime * Math.PI * this.rippleFrequency) * this.rippleMagnitude, o = Math.cos(this.idleTime * Math.PI * this.rippleFrequency) * this.rippleMagnitude;
this.node.position = this.node.position.add(cc.v2(e, e));
this.node.angle += o;
}
handleMovementAndInertia(t) {
this.joystick && this.joystick.Joystick_Vector.mag() > 0 ? this.currentVelocity = this.joystick.Joystick_Vector.normalize().mul(this.movementSpeed) : this.currentVelocity.mulSelf(this.decelerationFactor);
const e = cc.v2(this.node.position.x + this.currentVelocity.x * t, this.node.position.y + this.currentVelocity.y * t);
this.waterBoundarySetting && this.waterBoundarySetting.boundaryRect.contains(e) && (this.node.position = e);
}
handleRotation(t) {
this.joystick && this.joystick.Joystick_Vector.mag() > 0 && this.calculateTargetRotation(this.joystick.Joystick_Vector);
this.smoothRotation(t);
}
calculateTargetRotation(t) {
const e = t.signAngle(cc.Vec2.RIGHT);
this.targetRotation = -cc.misc.radiansToDegrees(e);
}
smoothRotation(t) {
const e = this.normalizeAngle(this.targetRotation - this.node.angle), o = Math.min(Math.abs(e), this.rotationSpeed * t) * this.sign(e);
this.node.angle += o;
}
normalizeAngle(t) {
return (t %= 360) < -180 ? t + 360 : t > 180 ? t - 360 : t;
}
sign(t) {
return t < 0 ? -1 : t > 0 ? 1 : 0;
}
};
r([ s(n.default) ], a.prototype, "waterBoundarySetting", void 0);
r([ s(i.default) ], a.prototype, "joystick", void 0);
a = r([ c ], a);
o.default = a;
cc._RF.pop();
}, {
"../Data/WaterBoundarySetting": "WaterBoundarySetting",
"./Joystick/Joystick": "Joystick"
} ],
Boat: [ function(t, e, o) {
"use strict";
cc._RF.push(e, "148f1Eo8UtPOJ9w5HN9uM9X", "Boat");
var r = this && this.__decorate || function(t, e, o, r) {
var n, i = arguments.length, c = i < 3 ? e : null === r ? r = Object.getOwnPropertyDescriptor(e, o) : r;
if ("object" == typeof Reflect && "function" == typeof Reflect.decorate) c = Reflect.decorate(t, e, o, r); else for (var s = t.length - 1; s >= 0; s--) (n = t[s]) && (c = (i < 3 ? n(c) : i > 3 ? n(e, o, c) : n(e, o)) || c);
return i > 3 && c && Object.defineProperty(e, o, c), c;
};
Object.defineProperty(o, "__esModule", {
value: !0
});
const n = t("./BoatInputController"), i = t("./PathHub"), {ccclass: c, property: s} = cc._decorator;
let a = class extends cc.Component {
constructor() {
super(...arguments);
this.idleRippleEffect = null;
this.inputController = null;
this.currentWord = "APPLE";
this.currentLetterIndex = 0;
}
onLoad() {
cc.director.getCollisionManager().enabled = !0;
cc.director.getCollisionManager().on("collision-enter", this.onCollisionEnter, this);
cc.director.getCollisionManager().on("collision-exit", this.onCollisionExit, this);
}
update(t) {
this.inputController.isIdle ? this.idleRippleEffect.active || (this.idleRippleEffect.active = !0) : this.idleRippleEffect.active && (this.idleRippleEffect.active = !1);
}
onCollisionEnter(t, e) {
console.log("Object entered the trigger area:", t.node.name);
const o = this.currentWord[this.currentLetterIndex], r = t.node.getComponent(i.default);
console.log(r);
if (null != r) {
console.log("true");
if (o == r.getData()) {
t.node.destroy();
this.currentLetterIndex++;
}
}
}
onCollisionExit(t) {}
onDestroy() {
cc.director.getCollisionManager().off("collision-enter", this.onCollisionEnter, this);
cc.director.getCollisionManager().off("collision-exit", this.onCollisionExit, this);
}
};
r([ s(cc.Node) ], a.prototype, "idleRippleEffect", void 0);
r([ s(n.default) ], a.prototype, "inputController", void 0);
a = r([ c ], a);
o.default = a;
cc._RF.pop();
}, {
"./BoatInputController": "BoatInputController",
"./PathHub": "PathHub"
} ],
CameraController: [ function(t, e, o) {
"use strict";
cc._RF.push(e, "55d538X035Bsq9J+iTANxGZ", "CameraController");
var r = this && this.__extends || function() {
var t = function(e, o) {
return (t = Object.setPrototypeOf || {
__proto__: []
} instanceof Array && function(t, e) {
t.__proto__ = e;
} || function(t, e) {
for (var o in e) e.hasOwnProperty(o) && (t[o] = e[o]);
})(e, o);
};
return function(e, o) {
t(e, o);
function r() {
this.constructor = e;
}
e.prototype = null === o ? Object.create(o) : (r.prototype = o.prototype, new r());
};
}(), n = this && this.__decorate || function(t, e, o, r) {
var n, i = arguments.length, c = i < 3 ? e : null === r ? r = Object.getOwnPropertyDescriptor(e, o) : r;
if ("object" == typeof Reflect && "function" == typeof Reflect.decorate) c = Reflect.decorate(t, e, o, r); else for (var s = t.length - 1; s >= 0; s--) (n = t[s]) && (c = (i < 3 ? n(c) : i > 3 ? n(e, o, c) : n(e, o)) || c);
return i > 3 && c && Object.defineProperty(e, o, c), c;
};
Object.defineProperty(o, "__esModule", {
value: !0
});
var i = cc._decorator, c = i.ccclass, s = i.property, a = function(t) {
r(e, t);
function e() {
var e = null !== t && t.apply(this, arguments) || this;
e.target = null;
e.offset = cc.Vec2.ZERO;
e.panning = !1;
e.elapsedTime = 0;
e.panDuration = 1;
e.panSpeed = 1e3;
return e;
}
e.prototype.update = function(t) {
if (!this.panning && this.target) {
this.elapsedTime += t;
this.elapsedTime >= this.panDuration && (this.panning = !0);
}
if (this.panning && this.target) {
var e = this.target.parent.convertToWorldSpaceAR(this.target.position), o = this.node.parent.convertToNodeSpaceAR(e), r = this.node.position, n = o.sub(r), i = n.mag();
if (i > 0) {
var c = this.panSpeed * t;
c < i && n.normalizeSelf().mulSelf(c);
this.node.position = r.add(n);
}
}
};
n([ s(cc.Node) ], e.prototype, "target", void 0);
n([ s(cc.Vec2) ], e.prototype, "offset", void 0);
return e = n([ c ], e);
}(cc.Component);
o.default = a;
cc._RF.pop();
}, {} ],
Joystick: [ function(t, e, o) {
"use strict";
cc._RF.push(e, "6fe3fDAk/1PLYf2SQ0n7dta", "Joystick");
var r = this && this.__decorate || function(t, e, o, r) {
var n, i = arguments.length, c = i < 3 ? e : null === r ? r = Object.getOwnPropertyDescriptor(e, o) : r;
if ("object" == typeof Reflect && "function" == typeof Reflect.decorate) c = Reflect.decorate(t, e, o, r); else for (var s = t.length - 1; s >= 0; s--) (n = t[s]) && (c = (i < 3 ? n(c) : i > 3 ? n(e, o, c) : n(e, o)) || c);
return i > 3 && c && Object.defineProperty(e, o, c), c;
};
Object.defineProperty(o, "__esModule", {
value: !0
});
const {ccclass: n, property: i} = cc._decorator;
let c = class extends cc.Component {
constructor() {
super(...arguments);
this.JoystickNode = null;
this.Joystick_Ball = null;
this.Joystick_Vector = cc.v3();
this.Joystick_Max = 100;
}
onLoad() {
this.node.on(cc.Node.EventType.TOUCH_START, this.Joystick_Touch_Start, this);
this.node.on(cc.Node.EventType.TOUCH_MOVE, this.Joystick_Touch_Move, this);
this.node.on(cc.Node.EventType.TOUCH_END, this.Joystick_Touch_End, this);
this.node.on(cc.Node.EventType.TOUCH_CANCEL, this.Joystick_Touch_End, this);
this.JoystickNode.active = !1;
}
Joystick_Touch_Start(t) {
let e = t.getLocation(), o = this.node.convertToNodeSpaceAR(e);
this.JoystickNode.setPosition(o);
this.JoystickNode.active = !0;
}
Joystick_Touch_Move(t) {
let e = t.getTouches()[0].getLocation(), o = this.JoystickNode.convertToNodeSpaceAR(e), r = this.Limit_joystick_Vector(o);
this.Set_Joystick_Ball_Position(r);
this.Joystick_Vector = r;
}
Joystick_Touch_End() {
this.Joystick_Vector = cc.Vec3.ZERO;
this.Set_Joystick_Ball_Position(cc.Vec3.ZERO);
this.JoystickNode.active = !1;
}
Set_Joystick_Ball_Position(t) {
this.Joystick_Ball.setPosition(t);
}
Limit_joystick_Vector(t) {
return t.mag() > this.Joystick_Max ? t.normalize().mul(this.Joystick_Max) : t;
}
};
r([ i(cc.Node) ], c.prototype, "JoystickNode", void 0);
r([ i(cc.Node) ], c.prototype, "Joystick_Ball", void 0);
r([ i ], c.prototype, "Joystick_Vector", void 0);
r([ i ], c.prototype, "Joystick_Max", void 0);
c = r([ n ], c);
o.default = c;
cc._RF.pop();
}, {} ],
LetterGenerator: [ function(t, e, o) {
"use strict";
cc._RF.push(e, "a53caH5pFRNlI+rUCZZSPHa", "LetterGenerator");
Object.defineProperty(o, "__esModule", {
value: !0
});
var r = t("./PathHub"), n = cc._decorator, i = (n.ccclass, n.property, function() {
function t(t, e, o, r) {
this.prefab = t;
this.boundaryRect = e;
this.letterWidth = o;
this.letterHeight = r;
}
t.prototype.generateLetters = function(t) {
for (var e = 0; e < t.length; e++) {
var o = this.getRandomPosition();
if (!this.isColliding(o)) {
var n = cc.instantiate(this.prefab);
n.getComponent(r.default).setData(t[e]);
cc.Canvas.instance.node.addChild(n);
n.position = o;
}
this.letterWidth;
}
};
t.prototype.getRandomPosition = function() {
var t = this.getRandomRange(this.boundaryRect.xMin, this.boundaryRect.xMax), e = this.getRandomRange(this.boundaryRect.yMin, this.boundaryRect.yMax);
return new cc.Vec2(t, e);
};
t.prototype.isColliding = function(t) {
return !1;
};
t.prototype.getRandomRange = function(t, e) {
return Math.floor(Math.random() * (e - t + 1)) + t;
};
return t;
}());
o.default = i;
cc._RF.pop();
}, {
"./PathHub": "PathHub"
} ],
LetterHubGenerator: [ function(t, e, o) {
"use strict";
cc._RF.push(e, "6adafNTCTxJUZocD2SEcSq5", "LetterHubGenerator");
var r = this && this.__extends || function() {
var t = function(e, o) {
return (t = Object.setPrototypeOf || {
__proto__: []
} instanceof Array && function(t, e) {
t.__proto__ = e;
} || function(t, e) {
for (var o in e) e.hasOwnProperty(o) && (t[o] = e[o]);
})(e, o);
};
return function(e, o) {
t(e, o);
function r() {
this.constructor = e;
}
e.prototype = null === o ? Object.create(o) : (r.prototype = o.prototype, new r());
};
}(), n = this && this.__decorate || function(t, e, o, r) {
var n, i = arguments.length, c = i < 3 ? e : null === r ? r = Object.getOwnPropertyDescriptor(e, o) : r;
if ("object" == typeof Reflect && "function" == typeof Reflect.decorate) c = Reflect.decorate(t, e, o, r); else for (var s = t.length - 1; s >= 0; s--) (n = t[s]) && (c = (i < 3 ? n(c) : i > 3 ? n(e, o, c) : n(e, o)) || c);
return i > 3 && c && Object.defineProperty(e, o, c), c;
};
Object.defineProperty(o, "__esModule", {
value: !0
});
var i = t("../Data/WaterBoundarySetting"), c = t("./LetterGenerator"), s = cc._decorator, a = s.ccclass, l = s.property, p = function(t) {
r(e, t);
function e() {
var e = null !== t && t.apply(this, arguments) || this;
e.letterPrefab = null;
e.waterBoundarySetting = null;
return e;
}
e.prototype.onLoad = function() {
var t = this.waterBoundarySetting.boundaryRect;
new c.default(this.letterPrefab, t, 200, 200).generateLetters("APPLE");
};
n([ l(cc.Prefab) ], e.prototype, "letterPrefab", void 0);
n([ l(i.default) ], e.prototype, "waterBoundarySetting", void 0);
return e = n([ a ], e);
}(cc.Component);
o.default = p;
cc._RF.pop();
}, {
"../Data/WaterBoundarySetting": "WaterBoundarySetting",
"./LetterGenerator": "LetterGenerator"
} ],
LetterPathGenerator: [ function(t, e, o) {
"use strict";
cc._RF.push(e, "b9e494sf55MOaYtbUIFrqDX", "LetterPathGenerator");
var r = this && this.__extends || function() {
var t = function(e, o) {
return (t = Object.setPrototypeOf || {
__proto__: []
} instanceof Array && function(t, e) {
t.__proto__ = e;
} || function(t, e) {
for (var o in e) e.hasOwnProperty(o) && (t[o] = e[o]);
})(e, o);
};
return function(e, o) {
t(e, o);
function r() {
this.constructor = e;
}
e.prototype = null === o ? Object.create(o) : (r.prototype = o.prototype, new r());
};
}(), n = this && this.__decorate || function(t, e, o, r) {
var n, i = arguments.length, c = i < 3 ? e : null === r ? r = Object.getOwnPropertyDescriptor(e, o) : r;
if ("object" == typeof Reflect && "function" == typeof Reflect.decorate) c = Reflect.decorate(t, e, o, r); else for (var s = t.length - 1; s >= 0; s--) (n = t[s]) && (c = (i < 3 ? n(c) : i > 3 ? n(e, o, c) : n(e, o)) || c);
return i > 3 && c && Object.defineProperty(e, o, c), c;
};
Object.defineProperty(o, "__esModule", {
value: !0
});
var i = cc._decorator, c = i.ccclass, s = (i.property, function(t) {
r(e, t);
function e() {
return null !== t && t.apply(this, arguments) || this;
}
return e = n([ c ], e);
}(cc.Component));
o.default = s;
cc._RF.pop();
}, {} ],
LevelData: [ function(t, e, o) {
"use strict";
cc._RF.push(e, "7c637MHjT5BlLw9+KcYZooX", "LevelData");
var r = this && this.__extends || function() {
var t = function(e, o) {
return (t = Object.setPrototypeOf || {
__proto__: []
} instanceof Array && function(t, e) {
t.__proto__ = e;
} || function(t, e) {
for (var o in e) e.hasOwnProperty(o) && (t[o] = e[o]);
})(e, o);
};
return function(e, o) {
t(e, o);
function r() {
this.constructor = e;
}
e.prototype = null === o ? Object.create(o) : (r.prototype = o.prototype, new r());
};
}(), n = this && this.__decorate || function(t, e, o, r) {
var n, i = arguments.length, c = i < 3 ? e : null === r ? r = Object.getOwnPropertyDescriptor(e, o) : r;
if ("object" == typeof Reflect && "function" == typeof Reflect.decorate) c = Reflect.decorate(t, e, o, r); else for (var s = t.length - 1; s >= 0; s--) (n = t[s]) && (c = (i < 3 ? n(c) : i > 3 ? n(e, o, c) : n(e, o)) || c);
return i > 3 && c && Object.defineProperty(e, o, c), c;
};
Object.defineProperty(o, "__esModule", {
value: !0
});
var i = cc._decorator, c = i.ccclass, s = i.property, a = function(t) {
r(e, t);
function e() {
var e = null !== t && t.apply(this, arguments) || this;
e.letter = [];
return e;
}
n([ s({
type: [ cc.String ],
tooltip: "Words"
}) ], e.prototype, "letter", void 0);
return e = n([ c ], e);
}(cc.Component);
o.default = a;
cc._RF.pop();
}, {} ],
PathHub: [ function(t, e, o) {
"use strict";
cc._RF.push(e, "6d137W1PZpNianCUlgZ/rU7", "PathHub");
var r = this && this.__extends || function() {
var t = function(e, o) {
return (t = Object.setPrototypeOf || {
__proto__: []
} instanceof Array && function(t, e) {
t.__proto__ = e;
} || function(t, e) {
for (var o in e) e.hasOwnProperty(o) && (t[o] = e[o]);
})(e, o);
};
return function(e, o) {
t(e, o);
function r() {
this.constructor = e;
}
e.prototype = null === o ? Object.create(o) : (r.prototype = o.prototype, new r());
};
}(), n = this && this.__decorate || function(t, e, o, r) {
var n, i = arguments.length, c = i < 3 ? e : null === r ? r = Object.getOwnPropertyDescriptor(e, o) : r;
if ("object" == typeof Reflect && "function" == typeof Reflect.decorate) c = Reflect.decorate(t, e, o, r); else for (var s = t.length - 1; s >= 0; s--) (n = t[s]) && (c = (i < 3 ? n(c) : i > 3 ? n(e, o, c) : n(e, o)) || c);
return i > 3 && c && Object.defineProperty(e, o, c), c;
};
Object.defineProperty(o, "__esModule", {
value: !0
});
var i = cc._decorator, c = i.ccclass, s = i.property, a = function(t) {
r(e, t);
function e() {
var e = null !== t && t.apply(this, arguments) || this;
e.label = null;
return e;
}
e.prototype.setData = function(t) {
this.label.string = t;
};
e.prototype.getData = function() {
return this.label.string;
};
n([ s(cc.Label) ], e.prototype, "label", void 0);
return e = n([ c ], e);
}(cc.Component);
o.default = a;
cc._RF.pop();
}, {} ],
WaterBoundarySetting: [ function(t, e, o) {
"use strict";
cc._RF.push(e, "994c24MbeVLQIMurLUZfULF", "WaterBoundarySetting");
var r = this && this.__extends || function() {
var t = function(e, o) {
return (t = Object.setPrototypeOf || {
__proto__: []
} instanceof Array && function(t, e) {
t.__proto__ = e;
} || function(t, e) {
for (var o in e) e.hasOwnProperty(o) && (t[o] = e[o]);
})(e, o);
};
return function(e, o) {
t(e, o);
function r() {
this.constructor = e;
}
e.prototype = null === o ? Object.create(o) : (r.prototype = o.prototype, new r());
};
}(), n = this && this.__decorate || function(t, e, o, r) {
var n, i = arguments.length, c = i < 3 ? e : null === r ? r = Object.getOwnPropertyDescriptor(e, o) : r;
if ("object" == typeof Reflect && "function" == typeof Reflect.decorate) c = Reflect.decorate(t, e, o, r); else for (var s = t.length - 1; s >= 0; s--) (n = t[s]) && (c = (i < 3 ? n(c) : i > 3 ? n(e, o, c) : n(e, o)) || c);
return i > 3 && c && Object.defineProperty(e, o, c), c;
};
Object.defineProperty(o, "__esModule", {
value: !0
});
var i = cc._decorator, c = i.ccclass, s = i.property, a = function(t) {
r(e, t);
function e() {
var e = null !== t && t.apply(this, arguments) || this;
e.boundaryRect = new cc.Rect(-500, -500, 1e3, 1e3);
e.debugBoundary = null;
e.graphics = null;
return e;
}
e.prototype.onLoad = function() {
this.graphics = this.node.getComponent(cc.Graphics);
this.graphics || (this.graphics = this.node.addComponent(cc.Graphics));
this.drawDottedRect(this.boundaryRect, 150);
this.debugBoundary && (this.debugBoundary.active = !1);
};
e.prototype.drawDottedRect = function(t, e) {
if (this.graphics) {
this.graphics.lineWidth = 2;
this.graphics.strokeColor = cc.Color.WHITE;
for (var o = t.xMin - e; o < t.xMax + e; o += 80) {
this.graphics.moveTo(o, t.yMin - e);
this.graphics.lineTo(o + 40, t.yMin - e);
}
for (o = t.yMin - e; o < t.yMax + e; o += 80) {
this.graphics.moveTo(t.xMax + e, o);
this.graphics.lineTo(t.xMax + e, o + 40);
}
for (o = t.xMax + e; o > t.xMin - e; o -= 80) {
this.graphics.moveTo(o, t.yMax + e);
this.graphics.lineTo(o - 40, t.yMax + e);
}
for (o = t.yMax + e; o > t.yMin - e; o -= 80) {
this.graphics.moveTo(t.xMin - e, o);
this.graphics.lineTo(t.xMin - e, o - 40);
}
this.graphics.stroke();
}
};
n([ s(cc.Rect) ], e.prototype, "boundaryRect", void 0);
n([ s(cc.Node) ], e.prototype, "debugBoundary", void 0);
return e = n([ c ], e);
}(cc.Component);
o.default = a;
cc._RF.pop();
}, {} ],
Waves: [ function(t, e, o) {
"use strict";
cc._RF.push(e, "1e712nV9wZERLfJZnEgFNKI", "Waves");
cc.Class({
extends: cc.Component,
properties: {
speed: .1
},
start() {
this.time = 0;
this.material = this.getComponent(cc.Sprite).getMaterial(0);
},
update(t) {
this.time += t * this.speed;
this.material.setProperty("time", this.time);
}
});
cc._RF.pop();
}, {} ]
}, {}, [ "AtoZLetterData", "LevelData", "WaterBoundarySetting", "Boat", "BoatInputController", "CameraController", "Joystick", "LetterGenerator", "LetterHubGenerator", "LetterPathGenerator", "PathHub", "Waves" ]);