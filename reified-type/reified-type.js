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

const DataHasInhabitant = (T, V) => V instanceof T;


module.exports = function type(...args)
{
    return IsTaggedCall(args) ?
        declaration => type(ToResolvedString(args), declaration) :
        IsPlainObject(args[1]) ? parseTypeData(...args) :
        fail.syntax("Unrecognized type definition");
}

const parseTypeData = (name, body) => Type
({
    [Symbols.Name]: name,
    [Symbols.Cases]: [Type.Case({ name })],
    [Symbols.Exports]: [],
    [Symbols.Methods]: [],
    [Symbols.HasInhabitant]: DataHasInhabitant,
    [Symbols.UnannotatedCall]: (T, _, args) => ConstructData(T, T[Symbols.Cases][0])
});

const toPrototypeM = M((T, C) => Ø
({
    [Ø.Call]: () => fail.type(`${C[Symbols.Name]} is not meant to be called`),

    [Ø `name`]: `${T.name}.${C.name}`,

    [Ø `prototype`]: Ø(({ prototype }) => Ø
    ({
        ...Ø.from(prototype),

        [Ø.Prototype]: T.prototype
    }))
}).prototype);


const ConstructData = given((
    ConstructVariableData = (T, C) => Ø({ [Ø.Prototype]: toPrototypeM(T, C) }),
    ConstructConstantData = M(ConstructVariableData)) =>
        (T, C) => C.isConstant ?
            ConstructConstantData(T, C) :
            ConstructVariableData(T, C));
