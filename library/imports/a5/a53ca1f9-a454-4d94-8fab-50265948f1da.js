"use strict";
cc._RF.push(module, 'a53caH5pFRNlI+rUCZZSPHa', 'LetterGenerator');
// Script/LetterGenerator.ts

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var PathHub_1 = require("./PathHub");
var _a = cc._decorator, ccclass = _a.ccclass, property = _a.property;
var LetterGenerator = /** @class */ (function () {
    function LetterGenerator(prefab, boundaryRect, letterWidth, letterHeight) {
        this.prefab = prefab;
        this.boundaryRect = boundaryRect;
        this.letterWidth = letterWidth;
        this.letterHeight = letterHeight;
    }
    LetterGenerator.prototype.generateLetters = function (word) {
        var xOffset = 0;
        // Loop through each character in the word
        for (var i = 0; i < word.length; i++) {
            // Randomly select a position within the boundary
            var position = this.getRandomPosition();
            // Check for collision with existing letters
            if (!this.isColliding(position)) {
                // Instantiate the letter prefab at the position
                var letterNode = cc.instantiate(this.prefab);
                var pathHub = letterNode.getComponent(PathHub_1.default);
                pathHub.setData(word[i]);
                cc.Canvas.instance.node.addChild(letterNode);
                letterNode.position = position;
            }
            // Update x-offset for the next letter
            xOffset += this.letterWidth;
        }
    };
    LetterGenerator.prototype.getRandomPosition = function () {
        // Generate random x and y coordinates within the boundary
        var x = this.getRandomRange(this.boundaryRect.xMin, this.boundaryRect.xMax);
        var y = this.getRandomRange(this.boundaryRect.yMin, this.boundaryRect.yMax);
        return new cc.Vec2(x, y);
    };
    LetterGenerator.prototype.isColliding = function (position) {
        // Perform collision detection logic here
        // Check if the new position collides with existing letters
        // For demonstration purposes, always return false (no collision)
        return false;
    };
    LetterGenerator.prototype.getRandomRange = function (min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    };
    return LetterGenerator;
}());
exports.default = LetterGenerator;

cc._RF.pop();