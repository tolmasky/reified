const given = f => f();

const
{
    I,
    IsFunctionObject,
    GetOwnPropertyDescriptorEntries,
    OrdinaryObjectCreate,
    OrdinaryFunctionCreate
} = require("@reified/ecma-262");

const S = I `Object.fromEntries` (["Call", "Prototype"]
    [I `::Array.prototype.map`] (name => [name, Symbol(name)]));

const Θ = I `Object.assign` (properties => given((
    {
        [S.Call]: Call,
        [S.Prototype]: Prototype =
            Call ? I `Function.prototype` : I `Object.prototype`,
        ...rest
    } = properties,
    O = Call ?
        OrdinaryFunctionCreate(Prototype, false, false, Call) :
        OrdinaryObjectCreate(Prototype)) => I `Object.defineProperties` (O,
    I `Object.fromEntries` (GetOwnPropertyDescriptorEntries(rest)
        [I `::Array.prototype.filter`] (([, { value }]) => !!value)
        [I `::Array.prototype.map`] (([key, { value: descriptor }]) =>
        [
            key,
            IsFunctionObject(descriptor) ? descriptor(O) : descriptor
        ])))), S);

module.exports = I `Object.assign` (Θ, { Θ });
