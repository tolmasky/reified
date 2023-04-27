const given = f => f();
const I = require("@reified/intrinsics");

// https://tc39.es/ecma262/#sec-getownpropertykeys
// But we also return BOTH names AND symbols when type is left out.
const GetOwnPropertyKeys = (O, type) =>
    type === "string" ? I `Object.getOwnPropertyNames` (O) :
    type === "symbol" ? I `Object.getOwnPropertySymbols` (O) :
    I `Array.concat` (
        GetOwnPropertyKeys(O, "string"),
        GetOwnPropertyKeys(O, "symbol"));
