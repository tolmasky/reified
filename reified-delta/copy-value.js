const given = f => f();
const { I, Call } = require("@reified/intrinsics");
const T = require("@reified/reflect/types-and-values");
const { GetMethod } = require("@reified/reflect/operations-on-objects");

const PredicateMap = require("@reified/reflect/predicate-map");

const SymbolEnum = require("@reified/object/symbol-enum");

const S = SymbolEnum("copy");

const PrimitiveCopy = V => V;

const FunctionObjectCopy = F => F;

const PrototypelessObjectCopy = V => V;

const PlainObjectCopy = V => V;

const GetCopyMethod = PredicateMap (map =>
[
    [T.IsPrimitive, PrimitiveCopy],
    [V => GetMethod(S.copy, V), map(V => GetMethod(S.copy, V))],
    [T.IsFunctionObject, FunctionObjectCopy],
    [T.IsPrototypelessObject, PrototypelessObjectCopy],
    PlainObjectCopy
]);



module.exports = GetCopyMethod;


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