import I from "@reified/host/intrinsics.mjs";

import
{
    IsArray,
    IsCallable,
    IsString,
    IsSymbol,
    HasProperty,
    HasOwnProperty,
    OrdinaryFunctionCreate
} from "@reified/ecma-262";

import
{
    GetOwnPropertyDescriptorEntries,
    GetOwnValues,
    IsTaggedCall,
    ToResolvedString
} from "@reified/ecma-262/extensions.mjs";


// ø ( ...sources )

export const ø = (...sources) => sources
    [I `::Array.prototype.reduce`] ((Oø, source) =>
        !source ?
            Oø :
        IsArray(source) ?
            I `Object.assign` (Oø, I `Object.fromEntries` (source)) :
            I `Object.defineProperties`
                (Oø, I `Object.getOwnPropertyDescriptors` (source)),
        I `Object.create` (null));


export const Ø = I `Object.assign` ((...args) =>
    IsTaggedCall(args) ? P(ToResolvedString(args)) :
    IsString(args[0]) ? P(args[0]) :
    IsSymbol(args[0]) ? P(args[0]) :
    IsCallable(args[0]) ? new RecursiveDefinition(args[0]) :
    CreateObjectFromDeclaration(args[0]),
    { /*Symbols*/ });

export default Ø;
