const
{
    IsArray,
    IsUndefined,
    IsNull,
    IsBoolean,
    IsString,
    IsSymbol,
    IsNumber,
    IsBigInt,
    IsObject,
    IsFunctionObject
} = require("@reified/ecma-262");

const { ø } = require("@reified/core/object");
const ToCallForm = F => (target, thisArg, args) => F(...args);
const ToHasInhabitant = F => (T, V) => F(V);


module.exports = ø
([
    ["undefined", [() => void(0), IsUndefined]],
    ["null", [() => null, IsNull]],
    ["boolean", [V => !!V, IsBoolean]],
    ["string", [V => String(V), IsString]],
    ["symbol", [V => Symbol(V), IsSymbol]],
    ["number", [V => Number(V), IsNumber]],
    ["bigint", [V => BigInt(V), IsBigInt]],
    ["function", [V => V, IsFunctionObject]],
    ["object", [V => Object(V), IsObject]],
].map(([name, [UnannotatedCall, HasInhabitant]]) =>
[
    name,
    [
        ToCallForm(UnannotatedCall),
        ToHasInhabitant(HasInhabitant)]
]));
