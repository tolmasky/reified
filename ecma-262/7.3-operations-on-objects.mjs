// 7.3 Operations on Objects
// https://tc39.es/ecma262/#sec-operations-on-objects

import { given, fail } from "./utilities.mjs";
import
{
    IsNull,
    IsUndefined
} from "./6-ecmascript-data-types-and-values.mjs";
import { IsCallable } from "./7.2-testing-and-comparison-operations.mjs";


// 7.3.3 Get ( O, P )
// https://tc39.es/ecma262/#sec-get-o-p
// FIXME: Do we need to do anything here to make sure O is an object?
export const Get = (O, P) => O[P];


// 7.3.3 GetV ( V, P )
// https://tc39.es/ecma262/#sec-getv
export const GetV = (V, P) => V[P];


// 7.3.11 GetMethod ( V, P )
// https://tc39.es/ecma262/#sec-getmethod
export const GetMethod = (V, P) => given((
    value = GetV(V, P)) =>
    IsNull(value) || IsUndefined(value) ? void(0) :
    !IsCallable(value) ?
        fail.type(`${value} is not callable.`) :
        value);


// 7.3.12 HasProperty ( O, P )
// https://tc39.es/ecma262/#sec-hasproperty

// FIXME: Should this fail if O isn't an object or P isn't a key?
export const HasProperty = (O, P) => P in O;


// 7.3.13 HasOwnProperty ( O, P )
// https://tc39.es/ecma262/#sec-hasownproperty

// FIXME: Should this fail if O isn't an object or P isn't a key?
export const HasOwnProperty = given((
    ObjectHasOwn = Object.hasOwn) =>
        (O, P) => I `Object.hasOwn` (O, P));
