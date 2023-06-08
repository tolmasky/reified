const given = f => f();

const I = require("./intrinsics");
const { IsNull, IsUndefined, IsFunctionObject } = require("./types-and-values");

// FIXME: Avoid circular dependencies...
const fail = { type: message => { throw TypeError(message) } };//require("@reified/core/fail");


// https://tc39.es/ecma262/#sec-getv
const GetV = (V, P) => V[P];

exports.GetV = GetV;

// https://tc39.es/ecma262/#sec-getmethod
const GetMethod = (V, P) => given((
    value = GetV(V, P)) =>
    IsNull(value) || IsUndefined(value) ? void(0) :
    !IsFunctionObject(value) ?
        fail.type(`${value} is not callable.`) :
        value);

exports.GetMethod = GetMethod;

const HasMethod = (V, P) => given((
    value = GetV(V, P)) =>
    IsNull(value) || IsUndefined(value) ? false :
    !IsFunctionObject(value) ?
        fail.type(`${value} is not callable.`) :
        true);

exports.HasMethod = HasMethod;

// 7.3.12 HasProperty ( O, P )
// https://tc39.es/ecma262/#sec-hasproperty

// FIXME: Should this fail if O isn't an object or P isn't a key?
const HasProperty = (O, P) => P in O;

exports.HasProperty = HasProperty;

// 7.3.13 HasOwnProperty ( O, P )
// https://tc39.es/ecma262/#sec-hasownproperty

// FIXME: Should this fail if O isn't an object or P isn't a key?
const HasOwnProperty = (O, P) => I `Object.hasOwn` (O, P);

exports.HasOwnProperty = HasOwnProperty
