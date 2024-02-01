import I from "@reified/host/intrinsics.mjs";


export const ø = (...sources) => sources
    [I `::Array.prototype.reduce`] ((Oø, source) =>
        !source ?
            Oø :
        IsArray(source) ?
            I `Object.assign` (Oø, I `Object.fromEntries` (source)) :
            I `Object.defineProperties`
                (Oø, I `Object.getOwnPropertyDescriptors` (source)),
        I `Object.create` (null));

export default ø;
