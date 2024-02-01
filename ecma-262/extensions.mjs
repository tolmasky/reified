import
{
    GetV,
    GetOwnPropertyKeys,
    IsCallable,
    IsNull,
    IsUndefined
} from "./ecma-262.mjs";


export const GetOwnValues = (O, type) =>
    GetOwnPropertyKeys(O, type)
        [I `::Array.prototype.map`] (key => O[key]);

export const HasMethod = (V, P) => given((
    value = GetV(V, P)) =>
    IsNull(value) || IsUndefined(value) ? false :
    !IsCallable(value) ?
        fail.type(`${value} is not callable.`) :
        true);
