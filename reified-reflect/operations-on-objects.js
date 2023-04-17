const given = f => f();

const fail = require("@reified/fail");
const I = require("@reified/intrinsics");

const { IsNull, IsUndefined, IsFunctionObject } = require("./types-and-values");


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

const GetKeyedMethod = P => V => GetMethod(V, P);

exports.GetKeyedMethod;
