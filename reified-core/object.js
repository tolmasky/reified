const given = f => f();

const
{
    I,
    IsFunctionObject,
    IsSymbol,
    GetOwnPropertyDescriptorEntries,
    OrdinaryObjectCreate,
    OrdinaryFunctionCreate
} = require("@reified/ecma-262");

const
{
    IsTaggedCall,
    ToResolvedString
} = require("@reified/core/function-objects");


const S = I `Object.fromEntries` (["Call", "Prototype"]
    [I `::Array.prototype.map`] (name => [name, Symbol(name)]));

const fromTag = tag =>
    tag === "..." ? Symbol("...") :
    false;

const Ø = I `Object.assign` ((...args) => IsTaggedCall(args) ?
    fromTag(ToResolvedString(args)) : given((
    {
        [S.Call]: Call,
        [S.Prototype]: Prototype =
            Call ? I `Function.prototype` : I `Object.prototype`,
        ...rest
    } = args[0],
    O = Call ?
        OrdinaryFunctionCreate(Prototype, false, false, Call) :
        OrdinaryObjectCreate(Prototype)) =>
    GetOwnPropertyDescriptorEntries(rest)
        [I `::Array.prototype.reduce`] ((O, [key, { value }]) => given((
            resolved = IsFunctionObject(value) ? value(O) : value) =>
            resolved === false ? O :
            IsSymbol(key) && key.description === "..." ?
                I `Object.defineProperties` (O, resolved) :    
            I `Object.defineProperty` (O, key, resolved)), O)), S);

module.exports = I `Object.assign` (Ø, { Ø });


