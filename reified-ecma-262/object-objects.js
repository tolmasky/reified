const given = f => f();

const I = require("./intrinsics");


// 20.1.2.11.1 GetOwnPropertyKeys ( O, type )
// https://tc39.es/ecma262/#sec-getownpropertykeys
// But we also return BOTH names AND symbols when type is "every".
const GetOwnPropertyKeys = (O, type) =>
    type === "string" ? I `Object.getOwnPropertyNames` (O) :
    type === "symbol" ? I `Object.getOwnPropertySymbols` (O) :
    type === "every" ?
        GetOwnPropertyKeys(O, "string")
            [I `::Array.prototype.concat`] (GetOwnPropertyKeys(O, "symbol")) :
    fail("oh no...");

exports.GetOwnPropertyKeys = GetOwnPropertyKeys;


// Convenience method.
const GetOwnPropertyDescriptorEntries = O =>
    GetOwnPropertyKeys(O, "every")
        [I `::Array.prototype.map`] (key =>
            [key, I `Object.getOwnPropertyDescriptor` (O, key)]);

exports.GetOwnPropertyDescriptorEntries = GetOwnPropertyDescriptorEntries;


// Convenience method.
const GetOwnEntries = (O, type) =>
    GetOwnPropertyKeys(O, type)
        [I `::Array.prototype.map`] (key => [key, O[key]]);

exports.GetOwnEntries = GetOwnEntries;


// Convenience method.
const GetOwnValues = (O, type) =>
    GetOwnPropertyKeys(O, type)
        [I `::Array.prototype.map`] (key => O[key]);


exports.GetOwnValues = GetOwnValues;
