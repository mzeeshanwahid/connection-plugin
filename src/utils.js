"use strict";
var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
Object.defineProperty(exports, "__esModule", { value: true });
function toTrainCase(str) {
    return str.toLowerCase().replace(/ /g, '-');
}
function getMapItemRecursively(map, el) {
    return map.get(el) || (el.parentElement ? getMapItemRecursively(map, el.parentElement) : null);
}
exports.getMapItemRecursively = getMapItemRecursively;
function defaultPath(points, curvature) {
    var x1 = points[0], y1 = points[1], x2 = points[2], y2 = points[3];
    var hx1 = x1 + Math.abs(x2 - x1) * curvature;
    var hx2 = x2 - Math.abs(x2 - x1) * curvature;
    return "M " + x1 + " " + y1 + " C " + hx1 + " " + y1 + " " + hx2 + " " + y2 + " " + x2 + " " + y2;
}
exports.defaultPath = defaultPath;
function renderPathData(emitter, points, connection) {
    var data = { points: points, connection: connection, d: '' };
    emitter.trigger('connectionpath', data);
    return data.d || defaultPath(points, 0.4);
}
exports.renderPathData = renderPathData;
function updateConnection(_a) {
    var el = _a.el, d = _a.d;
    var path = el.querySelector('.connection path');
    if (!path)
        throw new Error('Path of connection was broken');
    path.setAttribute('d', d);
}
exports.updateConnection = updateConnection;
function renderConnection(_a) {
    var _b;
    var el = _a.el, d = _a.d, connection = _a.connection;
    var classed = !connection ? [] : [
        'input-' + toTrainCase(connection.input.name),
        'output-' + toTrainCase(connection.output.name),
        'socket-input-' + toTrainCase(connection.input.socket.name),
        'socket-output-' + toTrainCase(connection.output.socket.name)
    ];
    var svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    var path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    (_b = svg.classList).add.apply(_b, __spreadArrays(['connection'], classed));
    path.classList.add('main-path');
    path.setAttribute('d', d);
    svg.appendChild(path);
    el.appendChild(svg);
    updateConnection({ el: el, d: d });
}
exports.renderConnection = renderConnection;
