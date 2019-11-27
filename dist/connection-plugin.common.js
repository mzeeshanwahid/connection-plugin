/*!
* rete-connection-plugin v0.9.0 
* (c) 2019 Vitaliy Stoliarov 
* Released under the MIT license.
*/
'use strict';



function ___$insertStyle(css) {
  if (!css) {
    return;
  }
  if (typeof window === 'undefined') {
    return;
  }

  var style = document.createElement('style');

  style.setAttribute('type', 'text/css');
  style.innerHTML = css;
  document.head.appendChild(style);
  return css;
}

Object.defineProperty(exports, '__esModule', { value: true });

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var rete = _interopDefault(require('rete'));

var commonjsGlobal = typeof globalThis !== 'undefined' ? globalThis : typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};

function unwrapExports (x) {
	return x && x.__esModule && Object.prototype.hasOwnProperty.call(x, 'default') ? x['default'] : x;
}

function createCommonjsModule(fn, module) {
	return module = { exports: {} }, fn(module, module.exports), module.exports;
}

var utils = createCommonjsModule(function (module, exports) {

  var __spreadArrays = commonjsGlobal && commonjsGlobal.__spreadArrays || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) {
      s += arguments[i].length;
    }

    for (var r = Array(s), k = 0, i = 0; i < il; i++) {
      for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++) {
        r[k] = a[j];
      }
    }

    return r;
  };

  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  function toTrainCase(str) {
    return str.toLowerCase().replace(/ /g, '-');
  }

  function getMapItemRecursively(map, el) {
    return map.get(el) || (el.parentElement ? getMapItemRecursively(map, el.parentElement) : null);
  }

  exports.getMapItemRecursively = getMapItemRecursively;

  function defaultPath(points, curvature) {
    var x1 = points[0],
        y1 = points[1],
        x2 = points[2],
        y2 = points[3];
    var hx1 = x1 + Math.abs(x2 - x1) * curvature;
    var hx2 = x2 - Math.abs(x2 - x1) * curvature;
    return "M " + x1 + " " + y1 + " C " + hx1 + " " + y1 + " " + hx2 + " " + y2 + " " + x2 + " " + y2;
  }

  exports.defaultPath = defaultPath;

  function renderPathData(emitter, points, connection) {
    var data = {
      points: points,
      connection: connection,
      d: ''
    };
    emitter.trigger('connectionpath', data);
    return data.d || defaultPath(points, 0.4);
  }

  exports.renderPathData = renderPathData;

  function updateConnection(_a) {
    var el = _a.el,
        d = _a.d;
    var path = el.querySelector('.connection path');
    if (!path) throw new Error('Path of connection was broken');
    path.setAttribute('d', d);
  }

  exports.updateConnection = updateConnection;

  function renderConnection(_a) {
    var _b;

    var el = _a.el,
        d = _a.d,
        connection = _a.connection;
    var classed = !connection ? [] : ['input-' + toTrainCase(connection.input.name), 'output-' + toTrainCase(connection.output.name), 'socket-input-' + toTrainCase(connection.input.socket.name), 'socket-output-' + toTrainCase(connection.output.socket.name)];
    var svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    var path = document.createElementNS('http://www.w3.org/2000/svg', 'path');

    (_b = svg.classList).add.apply(_b, __spreadArrays(['connection'], classed));

    path.classList.add('main-path');
    path.setAttribute('d', d);
    svg.appendChild(path);
    el.appendChild(svg);
    updateConnection({
      el: el,
      d: d
    });
  }

  exports.renderConnection = renderConnection;
});
unwrapExports(utils);
var utils_1 = utils.getMapItemRecursively;
var utils_2 = utils.defaultPath;
var utils_3 = utils.renderPathData;
var utils_4 = utils.updateConnection;
var utils_5 = utils.renderConnection;

var view = createCommonjsModule(function (module, exports) {

  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  var PickerView =
  /** @class */
  function () {
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
      } else if (this.el.parentElement) {
        this.el.innerHTML = '';
      }
    };

    PickerView.prototype.getPoints = function (io) {
      var mouse = this.editorView.area.mouse;
      if (!io.node) throw new Error('Node in output/input not found');
      var node = this.editorView.nodes.get(io.node);
      if (!node) throw new Error('Node view not found');

      var _a = node.getSocketPosition(io),
          x1 = _a[0],
          y1 = _a[1];

      return io instanceof rete.Output ? [x1, y1, mouse.x, mouse.y] : [mouse.x, mouse.y, x1, y1];
    };

    PickerView.prototype.updateConnection = function (io) {
      var d = utils.renderPathData(this.emitter, this.getPoints(io));
      utils.updateConnection({
        el: this.el,
        d: d
      });
    };

    PickerView.prototype.renderConnection = function (io) {
      var d = utils.renderPathData(this.emitter, this.getPoints(io));
      utils.renderConnection({
        el: this.el,
        d: d
      });
    };

    return PickerView;
  }();

  exports.PickerView = PickerView;
});
unwrapExports(view);
var view_1 = view.PickerView;

var picker = createCommonjsModule(function (module, exports) {

  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  var Picker =
  /** @class */
  function () {
    function Picker(editor) {
      var _this = this;

      this._io = null;
      this.editor = editor;
      this.view = new view.PickerView(editor, editor.view);
      editor.on('mousemove', function () {
        return _this.io && _this.view.updateConnection(_this.io);
      });
    }

    Object.defineProperty(Picker.prototype, "io", {
      get: function get() {
        return this._io;
      },
      set: function set(io) {
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
      if (!this.editor.trigger('connectionpick', output)) return;

      if (this.io instanceof rete.Input) {
        if (!output.multipleConnections && output.hasConnection()) this.editor.removeConnection(output.connections[0]);
        this.editor.connect(output, this.io);
        this.reset();
        return;
      }

      if (this.io) this.reset();
      this.io = output;
    };

    Picker.prototype.pickInput = function (input) {
      var _this = this;

      if (!this.editor.trigger('connectionpick', input)) return;

      if (this.io === null) {
        if (input.hasConnection()) {
          this.io = input.connections[0].output;
          this.editor.removeConnection(input.connections[0]);
        } else {
          this.io = input;
        }

        return true;
      }

      if (!input.multipleConnections && input.hasConnection()) this.editor.removeConnection(input.connections[0]);
      if (!this.io.multipleConnections && this.io.hasConnection()) this.editor.removeConnection(this.io.connections[0]);

      if (this.io instanceof rete.Output && this.io.connectedTo(input)) {
        var connection = input.connections.find(function (c) {
          return c.output === _this.io;
        });

        if (connection) {
          this.editor.removeConnection(connection);
        }
      }

      if (this.io instanceof rete.Output) {
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
  }();

  exports.Picker = Picker;
});
unwrapExports(picker);
var picker_1 = picker.Picker;

var flow = createCommonjsModule(function (module, exports) {

  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  var Flow =
  /** @class */
  function () {
    function Flow(picker) {
      this.picker = picker;
      this.target = null;
    }

    Flow.prototype.act = function (_a) {
      var input = _a.input,
          output = _a.output;
      if (this.unlock(input || output)) return;
      if (input) this.picker.pickInput(input);else if (output) this.picker.pickOutput(output);else this.picker.reset();
    };

    Flow.prototype.start = function (params, io) {
      this.act(params);
      this.target = io;
    };

    Flow.prototype.complete = function (params) {
      if (params === void 0) {
        params = {};
      }

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
  }();

  exports.Flow = Flow;
});
unwrapExports(flow);
var flow_1 = flow.Flow;

var events = createCommonjsModule(function (module, exports) {

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
});
unwrapExports(events);

___$insertStyle(".connection {\n  overflow: visible !important;\n  position: absolute;\n  z-index: -1;\n  pointer-events: none;\n}\n.connection > * {\n  pointer-events: all;\n}\n.connection .main-path {\n  fill: none;\n  stroke-width: 5px;\n  stroke: steelblue;\n}\n.connection .main-path:after {\n  content: url(\"./assets/chevron_right-24px.svg\");\n}");

function install(editor) {
  editor.bind('connectionpath');
  editor.bind('connectiondrop');
  editor.bind('connectionpick');
  editor.bind('resetconnection');
  var picker = new picker_1(editor);
  var flow = new flow_1(picker);
  var socketsParams = new WeakMap();

  function pointerDown(e) {
    var flowParams = socketsParams.get(this);

    if (flowParams) {
      var input = flowParams.input,
          output = flowParams.output;
      editor.view.container.dispatchEvent(new PointerEvent('pointermove', e));
      e.preventDefault();
      e.stopPropagation();
      flow.start({
        input: input,
        output: output
      }, input || output);
    }
  }

  function pointerUp(e) {
    var flowEl = document.elementFromPoint(e.clientX, e.clientY);

    if (picker.io) {
      editor.trigger('connectiondrop', picker.io);
    }

    if (flowEl) {
      flow.complete(utils_1(socketsParams, flowEl) || {});
    }
  }

  editor.on('resetconnection', function () {
    return flow.complete();
  });
  editor.on('rendersocket', function (_ref) {
    var el = _ref.el,
        input = _ref.input,
        output = _ref.output;
    socketsParams.set(el, {
      input: input,
      output: output
    });
    el.removeEventListener('pointerdown', pointerDown);
    el.addEventListener('pointerdown', pointerDown);
  });
  window.addEventListener('pointerup', pointerUp);
  editor.on('renderconnection', function (_ref2) {
    var el = _ref2.el,
        connection = _ref2.connection,
        points = _ref2.points;
    var d = utils_3(editor, points, connection);
    utils_5({
      el: el,
      d: d,
      connection: connection
    });
  });
  editor.on('updateconnection', function (_ref3) {
    var el = _ref3.el,
        connection = _ref3.connection,
        points = _ref3.points;
    var d = utils_3(editor, points, connection);
    utils_4({
      el: el,
      d: d
    });
  });
  editor.on('destroy', function () {
    window.removeEventListener('pointerup', pointerUp);
  });
}

var index = {
  name: 'connection',
  install: install
};

exports.default = index;
exports.defaultPath = utils_2;
//# sourceMappingURL=connection-plugin.common.js.map
