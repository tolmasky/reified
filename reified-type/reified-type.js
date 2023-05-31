const given = f => f();

const
{
    I,
    HasOwnProperty,
    IsUndefined,
    IsNull,
    IsBoolean,
    IsString,
    IsSymbol,
    IsNumeric,
    IsNumber,
    IsBigInt,
    IsIntegralNumber,
    IsFunctionObject,
    IsPropertyKey,
    GetOwnPropertyDescriptorEntries
} = require("@reified/ecma-262");
const fail = require("@reified/core/fail");
const
{
    IsTaggedCall,
    ToResolvedString
} = require("@reified/core/function-objects");

const { Symbols, Type0 } = require("./type-0");

const { ø } = require("@reified/object");

const DataHasInhabitant = (T, V) => V instanceof T;


module.exports = function type(...args)
{
    return IsTaggedCall(args) ?
        declaration => type(ToResolvedString(args), declaration) :
        Type0
        ({
            [Symbols.Name]: args[0],
            [Symbols.Constructors]: [],
            [Symbols.Exports]: [],
            [Symbols.Methods]: [],
            [Symbols.HasInhabitant]: DataHasInhabitant,
            [Symbols.UnannotatedCall]: () => console.log("hi")
        });
}
