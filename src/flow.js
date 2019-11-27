"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Flow = /** @class */ (function () {
    function Flow(picker) {
        this.picker = picker;
        this.target = null;
    }
    Flow.prototype.act = function (_a) {
        var input = _a.input, output = _a.output;
        if (this.unlock(input || output))
            return;
        if (input)
            this.picker.pickInput(input);
        else if (output)
            this.picker.pickOutput(output);
        else
            this.picker.reset();
    };
    Flow.prototype.start = function (params, io) {
        this.act(params);
        this.target = io;
    };
    Flow.prototype.complete = function (params) {
        if (params === void 0) { params = {}; }
        this.act(params);
    };
    Flow.prototype.hasTarget = function () {
        return Boolean(this.target);
    };
    Flow.prototype.unlock = function (io) {
        var target = this.target;
        this.target = null;
        return target && target === io;
    };
    return Flow;
}());
exports.Flow = Flow;
