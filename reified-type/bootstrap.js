const given = f => f();

const
{
    I,
    IsUndefined,
    IsNull,
    IsBoolean,
    IsString,
    IsSymbol,
    IsNumber,
    IsBigInt,
    IsObject,
    IsFunctionObject,
    GetOwnPropertyDescriptorEntries,
} = require("@reified/ecma-262");    

const fail = require("./fail");
const { IsTaggedCall, ToResolvedString } =
    require("@reified/core/function-objects");

const ϕ = (O, fProperties) => I `Object.assign` (O, fProperties(O));

const annotate = (...args) => IsTaggedCall(args) && given((
    annotation = ToResolvedString(args)) =>
        annotation === "=" ? value => value :
        annotation === "()=" ? value => value :
        annotation === "const" ? value => value :
        annotation === "const()" ? value => value :
        annotation === "where" ? value => value :
        fail.syntax(`Unrecgonized type annotation: "${annotation}"`));

const ƒ = (binding, extending, definition) => given((
    F = ϕ(function () { return target(...arguments); }, F =>
        extending && I `Object.create` (
            extending.prototype, { constructor: { value: F } })),
    {
        target,
        prototypeOf = I `Function.prototype`,
        ...properties
    } = IsFunctionObject(definition) ? definition(F) : definition) =>
    I `Object.defineProperties` (
        I `Object.setPrototypeOf` (F, prototypeOf),
        {
            name: { value: binding },
            binding: { value: binding },
            ...I `Object.fromEntries` (
                GetOwnPropertyDescriptorEntries (properties)
                    [I `::Array.prototype.map`] (([key, { value }]) =>
                        [key, { value, enumerable: IsString(key) }])),
        }));

const mismatch = (T, value, reference) => fail.type (
    `Type mismatch${reference ? `in ${reference}` : ""}:\n` +
    `    Expected: ${toTypeDescription(T)}\n` +
    `    But found: ${value}`);

const toTypeDescription = T =>
    // FIXME: We'll want something like [[Description]] here, for Dependent
    // types.
    T instanceof type ? T.name :
    IsFunctionObject(T) ? T.name :
    "blah";

const IsTypeOrConstructor = T =>
    T instanceof type || IsFunctionObject(T);

//const toType = T => T instanceof type ? T : 

module.exports = ƒ ("type", I `Function`, type =>
({
    target: (...args) => annotate(args) || fail.type("oops"),

    ...I `Object.fromEntries`
    ([
        ["undefined", IsUndefined],
        ["null", IsNull],
        ["boolean", IsBoolean],
        ["string", IsString],
        ["symbol", IsSymbol],
        ["number", IsNumber],
        ["bigint", IsBigInt],
        ["object", IsObject]
    ]
        [I `::Array.prototype.map`] (([binding, hasInstance]) =>
        [
            binding,
            ƒ (binding, false,
            {
                target: (...args) =>
                    annotate(...args) ||
                    fail.type (`${binding} is a type, not a constructor.`),
                prototypeOf: type.prototype,

                [Symbol.hasInstance]: hasInstance
            })
        ])),

    check: (T, value, reference) => 
        !IsTypeOrConstructor(T) ?
            mismatch(type, T, "in type.check") :
        !(value instanceof T) ?
            mismatch(T, value, reference) :
            value
}));
