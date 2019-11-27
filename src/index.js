"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var utils_1 = require("./utils");
var picker_1 = require("./picker");
var flow_1 = require("./flow");
require("./events");
require("./index.sass");
function install(editor) {
    editor.bind('connectionpath');
    editor.bind('connectiondrop');
    editor.bind('connectionpick');
    editor.bind('resetconnection');
    var picker = new picker_1.Picker(editor);
    var flow = new flow_1.Flow(picker);
    var socketsParams = new WeakMap();
    function pointerDown(e) {
        var flowParams = socketsParams.get(this);
        if (flowParams) {
            var input = flowParams.input, output = flowParams.output;
            editor.view.container.dispatchEvent(new PointerEvent('pointermove', e));
            e.preventDefault();
            e.stopPropagation();
            flow.start({ input: input, output: output }, input || output);
        }
    }
    function pointerUp(e) {
        var flowEl = document.elementFromPoint(e.clientX, e.clientY);
        if (picker.io) {
            editor.trigger('connectiondrop', picker.io);
        }
        if (flowEl) {
            flow.complete(utils_1.getMapItemRecursively(socketsParams, flowEl) || {});
        }
    }
    editor.on('resetconnection', function () { return flow.complete(); });
    editor.on('rendersocket', function (_a) {
        var el = _a.el, input = _a.input, output = _a.output;
        socketsParams.set(el, { input: input, output: output });
        el.removeEventListener('pointerdown', pointerDown);
        el.addEventListener('pointerdown', pointerDown);
    });
    window.addEventListener('pointerup', pointerUp);
    editor.on('renderconnection', function (_a) {
        var el = _a.el, connection = _a.connection, points = _a.points;
        var d = utils_1.renderPathData(editor, points, connection);
        utils_1.renderConnection({ el: el, d: d, connection: connection });
    });
    editor.on('updateconnection', function (_a) {
        var el = _a.el, connection = _a.connection, points = _a.points;
        var d = utils_1.renderPathData(editor, points, connection);
        utils_1.updateConnection({ el: el, d: d });
    });
    editor.on('destroy', function () {
        window.removeEventListener('pointerup', pointerUp);
    });
}
exports.default = {
    name: 'connection',
    install: install
};
var utils_2 = require("./utils");
exports.defaultPath = utils_2.defaultPath;
