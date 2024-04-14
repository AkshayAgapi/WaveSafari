"use strict";
cc._RF.push(module, '6adafNTCTxJUZocD2SEcSq5', 'LetterHubGenerator');
// Script/LetterHubGenerator.ts

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
var WaterBoundarySetting_1 = require("../Data/WaterBoundarySetting");
var LetterGenerator_1 = require("./LetterGenerator");
var _a = cc._decorator, ccclass = _a.ccclass, property = _a.property;
var LetterHubGenerator = /** @class */ (function (_super) {
    __extends(LetterHubGenerator, _super);
    function LetterHubGenerator() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.letterPrefab = null;
        _this.waterBoundarySetting = null;
        return _this;
    }
    LetterHubGenerator.prototype.onLoad = function () {
        var boundaryRect = this.waterBoundarySetting.boundaryRect;
        var letterWidth = 200; // Example width of the letter prefab
        var letterHeight = 200; // Example height of the letter prefab
        var letterGenerator = new LetterGenerator_1.default(this.letterPrefab, boundaryRect, letterWidth, letterHeight);
        // Generate letters for the word "APPLE"
        letterGenerator.generateLetters('APPLE');
    };
    __decorate([
        property(cc.Prefab)
    ], LetterHubGenerator.prototype, "letterPrefab", void 0);
    __decorate([
        property(WaterBoundarySetting_1.default)
    ], LetterHubGenerator.prototype, "waterBoundarySetting", void 0);
    LetterHubGenerator = __decorate([
        ccclass
    ], LetterHubGenerator);
    return LetterHubGenerator;
}(cc.Component));
exports.default = LetterHubGenerator;

cc._RF.pop();