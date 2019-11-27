"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var rete_1 = require("rete");
var view_1 = require("./view");
var Picker = /** @class */ (function () {
    function Picker(editor) {
        var _this = this;
        this._io = null;
        this.editor = editor;
        this.view = new view_1.PickerView(editor, editor.view);
        editor.on('mousemove', function () { return _this.io && _this.view.updateConnection(_this.io); });
    }
    Object.defineProperty(Picker.prototype, "io", {
        get: function () {
            return this._io;
        },
        set: function (io) {
            this._io = io;
            this.view.updatePseudoConnection(io);
        },
        enumerable: true,
        configurable: true
    });
    Picker.prototype.reset = function () {
        this.io = null;
    };
    Picker.prototype.pickOutput = function (output) {
        if (!this.editor.trigger('connectionpick', output))
            return;
        if (this.io instanceof rete_1.Input) {
            if (!output.multipleConnections && output.hasConnection())
                this.editor.removeConnection(output.connections[0]);
            this.editor.connect(output, this.io);
            this.reset();
            return;
        }
        if (this.io)
            this.reset();
        this.io = output;
    };
    Picker.prototype.pickInput = function (input) {
        var _this = this;
        if (!this.editor.trigger('connectionpick', input))
            return;
        if (this.io === null) {
            if (input.hasConnection()) {
                this.io = input.connections[0].output;
                this.editor.removeConnection(input.connections[0]);
            }
            else {
                this.io = input;
            }
            return true;
        }
        if (!input.multipleConnections && input.hasConnection())
            this.editor.removeConnection(input.connections[0]);
        if (!this.io.multipleConnections && this.io.hasConnection())
            this.editor.removeConnection(this.io.connections[0]);
        if (this.io instanceof rete_1.Output && this.io.connectedTo(input)) {
            var connection = input.connections.find(function (c) { return c.output === _this.io; });
            if (connection) {
                this.editor.removeConnection(connection);
            }
        }
        if (this.io instanceof rete_1.Output) {
            this.editor.connect(this.io, input);
            this.reset();
        }
    };
    Picker.prototype.pickConnection = function (connection) {
        var output = connection.output;
        this.editor.removeConnection(connection);
        this.io = output;
    };
    return Picker;
}());
exports.Picker = Picker;
