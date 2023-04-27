// 10.4.2 Array Exotic Objects
// https://tc39.es/ecma262/#sec-array-exotic-objects

const given = f => f();

const { ToUint32, ToString } = require("./type-conversion");

// 𝔽(2^32 - 1)
const MAX_UINT32 = -1 >>> 0;

// NOTE in 10.4.2 Array Exotic Objects
//
// 1. https://tc39.es/ecma262/#sec-array-exotic-objects
// 2. https://tc39.es/ecma262/#array-index
const IsArrayIndex = P => given((
    Uint32Value = ToUint32(P)) =>
        ToString(Uint32Value) === P && Uint32Value !== MAX_UINT32);

module.exports.IsArrayIndex = IsArrayIndex;
