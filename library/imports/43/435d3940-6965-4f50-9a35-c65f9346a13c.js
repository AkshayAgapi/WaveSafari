"use strict";
cc._RF.push(module, '435d3lAaWVPUJo1xl+TRqE8', 'AtoZLetterData');
// Data/AtoZLetterData.ts

"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var _a = cc._decorator, ccclass = _a.ccclass, property = _a.property;
// Define a custom class for your data structure
var CustomItem = /** @class */ (function () {
    function CustomItem(name, sprite) {
        this.name = name;
        this.sprite = sprite;
    }
    return CustomItem;
}());
var AtoZLetterData = /** @class */ (function (_super) {
    __extends(AtoZLetterData, _super);
    function AtoZLetterData() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.letter = [];
        _this.letterSprite = [];
        _this.customItems = [];
        return _this;
    }
    AtoZLetterData.prototype.onLoad = function () {
        var _this = this;
        this.customItems = this.letterSprite.map(function (sprite, index) { return new CustomItem(_this.letter[index], sprite); });
    };
    __decorate([
        property({
            type: [cc.String],
            tooltip: 'Names for custom items'
        })
    ], AtoZLetterData.prototype, "letter", void 0);
    __decorate([
        property({
            type: [cc.SpriteFrame],
            tooltip: 'Sprites for custom items'
        })
    ], AtoZLetterData.prototype, "letterSprite", void 0);
    __decorate([
        property({
            tooltip: 'Array of custom items'
        })
    ], AtoZLetterData.prototype, "customItems", void 0);
    AtoZLetterData = __decorate([
        ccclass
    ], AtoZLetterData);
    return AtoZLetterData;
}(cc.Component));
exports.default = AtoZLetterData;

cc._RF.pop();