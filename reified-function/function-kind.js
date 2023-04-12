const given = f => f();
const I = require("@reified/intrinsics");
const fail = require("@reified/fail");

const FunctionKindNormal            = 0;
const FunctionKindGenerator         = 1 << 0;
const FunctionKindAsync             = 1 << 1;
const FunctionKindAsyncGenerator    = FunctionKindGenerator | FunctionKindAsync;

const FunctionKind =
{
    Normal: FunctionKindNormal,
    Generator: FunctionKindGenerator,
    Async: FunctionKindAsync,
    AsyncGenerator: FunctionKindAsyncGenerator
};

const GetFunctionKind = given((
    predicates = I `@reified/array-chain` (I `Object.entries`
    ({
        AsyncGeneratorFunction: FunctionKindAsyncGenerator,
        AsyncFunction: FunctionKindAsync,
        GeneratorFunction: FunctionKindGenerator,
        Function: FunctionKindNormal
    }),
        { map: ([name, kind]) => I[name] && [I[name], kind] },
        { filter: entry => !!entry },
        { map: ([FC, kind]) => I `Object.assign` (O => O instanceof FC, { kind }) },
        { concat: O => fail(`${typeof O} is not a function`) })) =>
    O => I `.Array.prototype.find` (predicates, f => f(O)).kind);

module.exports =
{
    FunctionKind,
    FunctionKinds: I `Object.values` (FunctionKind),
    FunctionKindNormal,
    FunctionKindGenerator,
    FunctionKindAsync,
    FunctionKindAsyncGenerator,
    GetFunctionKind
};

