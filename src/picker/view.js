"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var rete_1 = require("rete");
var utils_1 = require("../utils");
var PickerView = /** @class */ (function () {
    function PickerView(emitter, editorView) {
        this.emitter = emitter;
        this.editorView = editorView;
        this.el = document.createElement('div');
        this.el.style.position = 'absolute';
        this.editorView.area.appendChild(this.el);
    }
    PickerView.prototype.updatePseudoConnection = function (io) {
        if (io !== null) {
            this.renderConnection(io);
        }
        else if (this.el.parentElement) {
            this.el.innerHTML = '';
        }
    };
    PickerView.prototype.getPoints = function (io) {
        var mouse = this.editorView.area.mouse;
        if (!io.node)
            throw new Error('Node in output/input not found');
        var node = this.editorView.nodes.get(io.node);
        if (!node)
            throw new Error('Node view not found');
        var _a = node.getSocketPosition(io), x1 = _a[0], y1 = _a[1];
        return io instanceof rete_1.Output
            ? [x1, y1, mouse.x, mouse.y]
            : [mouse.x, mouse.y, x1, y1];
    };
    PickerView.prototype.updateConnection = function (io) {
        var d = utils_1.renderPathData(this.emitter, this.getPoints(io));
        utils_1.updateConnection({ el: this.el, d: d });
    };
    PickerView.prototype.renderConnection = function (io) {
        var d = utils_1.renderPathData(this.emitter, this.getPoints(io));
        utils_1.renderConnection({ el: this.el, d: d });
    };
    return PickerView;
}());
exports.PickerView = PickerView;
