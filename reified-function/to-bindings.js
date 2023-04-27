const given = f => f();

const I = require("@reified/intrinsics");
const KeyPath = require("@reified/delta/key-path");
const { ToUint32 } = require("@reified/core/type-conversion");
const { IsArrayIndex } = require("@reified/core/array-exotic-objects");
const toParameterKeyPath = require("./to-parameter-key-path");


const toBindings = (target, shorthand) => new I `Map`(
    I `Array.from` (
        I `Object.entries`(shorthand),
        ([key, value]) => given((
            keyPath = IsArrayIndex(key) ?
                KeyPath(ToUint32(key)) :
                toParameterKeyPath(target, key)) =>
            [keyPath.toKeyID(), [keyPath, value]])));

module.exports = toBindings;
