const given = f => f();

const I = require("./intrinsics");


// https://tc39.es/ecma262/#sec-getownpropertykeys
// But we also return BOTH names AND symbols when type is left out.
const GetOwnPropertyKeys = (O, type) =>
    type === "string" ? I `Object.getOwnPropertyNames` (O) :
    type === "symbol" ? I `Object.getOwnPropertySymbols` (O) :
    fail("oh no...");

exports.GetOwnPropertyKeys = GetOwnPropertyKeys;


// Convenience method.
const GetOwnPropertyDescriptorEntries = O =>
    GetOwnPropertyKeys(O, "string")
        [I `::Array.prototype.concat`] (GetOwnPropertyKeys(O, "symbol"))
        [I `::Array.prototype.map`] (key =>
            [key, I `Object.getOwnPropertyDescriptor` (O, key)]);

exports.GetOwnPropertyDescriptorEntries = GetOwnPropertyDescriptorEntries;
