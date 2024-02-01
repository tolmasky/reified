import
{
    "Array.from" as ArrayFrom,
    "Array.prototype.concat" as ArrayPrototypeConcat,
    "Array.prototype.join" as ArrayPrototypeJoin,
    "Array.prototype.map" as ArrayPrototypeMap,
    GetV,
    GetOwnPropertyKeys,
    IsArray,
    IsCallable,
    IsNull,
    IsString,
    IsUndefined,
    "Object.hasOwn" as ObjectHasOwn
} from "./ecma-262.mjs";

import { given, ƒCall } from "./utilities.mjs";


export const GetOwnValues = (O, type) => ƒCall(
    ArrayPrototypeMap,
    GetOwnPropertyKeys(O, type),
    key => O[key]);

export const HasMethod = (V, P) => given((
    value = GetV(V, P)) =>
    IsNull(value) || IsUndefined(value) ? false :
    !IsCallable(value) ?
        fail.type(`${value} is not callable.`) :
        true);

// IsTaggedCall ( arguments )
//
// Pass arguments from a function to determine if it was (likely) called using
// tagging template syntax.
//
// Given F = (...args) => ...
//
// IsTaggedCall (args) return true if F was called with a tagged template
// syntax.

export const IsTaggedCall = fArguments =>
    IsArray (fArguments) &&
    IsArray (fArguments[0]) &&
    ObjectHasOwn (fArguments[0], "raw");


// IsTagCoercibleCall ( arguments )
//
// Slightly less strict version of IsTaggedCall that determines if a call can be
// treated *as if* it were have been called using a tagged template syntax. This
// is useful if you want to allow users to immitate tagged calls. For example,
// doing `F(["string"])` instead of F `${"string"}`.

export const IsTagCoercibleCall = fArguments =>
    IsArray (fArguments) &&
    fArguments.length === 1 &&
    IsString(fArguments[0]);


// ToResolvedString ( arguments )

export const ToResolvedString = given((
    flattened = array => ƒCall(ArrayPrototypeConcat, [], ...array)) =>
    ([strings, ...values]) => ƒCall(
        ArrayPrototypeJoin,
        flattened(ArrayFrom(
            strings,
            (string, index) => [string, values[index]])),
        ""));
