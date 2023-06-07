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
    IsPlainObject,
    GetOwnPropertyDescriptorEntries
} = require("@reified/ecma-262");
const fail = require("@reified/core/fail");
const
{
    IsTaggedCall,
    ToResolvedString
} = require("@reified/core/function-objects");

const { Symbols, Type0: Type } = require("./type-0");

const { ø, Ø, M } = require("@reified/core");


module.exports = function type(...args)
{
    return IsTaggedCall(args) ?
        declaration => type(ToResolvedString(args), declaration) :
        IsPlainObject(args[1]) ? Type.Data.parse(...args) :
        fail.syntax("Unrecognized type definition");
}
