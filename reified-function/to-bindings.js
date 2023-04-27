const given = f => f();

const I = require("@reified/intrinsics");
const KeyPath = require("@reified/delta/key-path");
const { ToUint32 } = require("@reified/core/type-conversion");
const { IsArrayIndex } = require("@reified/core/array-exotic-objects");


const toBindings = shorthand =>  new I `Map`(
    I `Array.from` (
        I `Object.entries`(shorthand),
        ([key, value]) => given((
            keyPath = KeyPath(IsArrayIndex(key) ? ToUint32(key) : key)) =>
            [keyPath.toKeyID(), [keyPath, value]])));

module.exports = toBindings;
