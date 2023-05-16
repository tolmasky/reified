// 10.2 ECMAScript Function Objects
// https://tc39.es/ecma262/#sec-ecmascript-function-objects

const { I } = require("./intrinsics");


// 10.2.3 OrdinaryFunctionCreate ( functionPrototype, sourceText, ParameterList, Body, thisMode, env, privateEnv )
// https://tc39.es/ecma262/#sec-ecmascript-function-objects
const OrdinaryFunctionCreate = (functionPrototype, sourceText, ParameterList, Body) =>
    I `Object.setPrototypeOf`(function F(...args)
    {
        return Body [I `::Function.prototype.call`] (this, F, ...args);
    }, functionPrototype);

exports.OrdinaryFunctionCreate = OrdinaryFunctionCreate;
