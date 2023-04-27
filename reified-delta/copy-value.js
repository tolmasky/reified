const given = f => f();
const { I, Call } = require("@reified/intrinsics");

const { α } = require("@reified/object");

const T = require("@reified/core/types-and-values");
const { GetMethod } = require("@reified/core/operations-on-objects");

const PredicateMap = require("@reified/core/predicate-map");
const SymbolEnum = require("@reified/core/symbol-enum");

const S = SymbolEnum("copy");

const PrimitiveCopy = V => V;

const FunctionObjectCopy = F => F;

const PrototypelessObjectCopy = V => V;

const PlainObjectCopy = V =>
    α(I `Object.create` (I `Object.getPrototypeOf` (V)), V);

const ArrayObjectCopy = V => given((
    copy = I `Array.from` (V),
    prototype = I `Object.getPrototypeOf` (V)) =>
    (I `Object.setPrototypeOf`(copy, prototype), α(copy, V)));


const GetCopyMethod = PredicateMap (map =>
[
    [T.IsPrimitive, PrimitiveCopy],
    [V => !!GetMethod(V, S.copy), map(V => GetMethod(V, S.copy))],
    [T.IsFunctionObject, FunctionObjectCopy],
    [T.IsPrototypelessObject, PrototypelessObjectCopy],
    [T.IsArray, ArrayObjectCopy],
    PlainObjectCopy
]);

const CopyValue = V => GetCopyMethod(V)(V);

module.exports = CopyValue;

module.exports.CopyValue = CopyValue;
module.exports.CopyValue.copy = S.copy;


/*const FunctionCopy = f => 

const CopyObject = O =>
    (GetMethod(V, S.copy) || GetDefaultCopyMethod(V))(O);


const GetDefaultCopyMethod = O =>
    

{ f, ...d }


Copy() -> assign -> assign

update() means we need to keep creating copies

OR
just accumulate the delta and apply all at once?


no matter what, we always need CopyFrom()


function() { call -> call() }


function { target: blah }
*/