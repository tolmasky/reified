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
    IsConstructor,
    HasOwnProperty,
} = require("@reified/ecma-262");

const fail = require("./fail");
const Θ = require("./theta");

const { IsTaggedCall, ToResolvedString } =
    require("@reified/core/function-objects");

const mismatch = (T, value, reference) => fail.type (
    `Type mismatch${reference ? ` in ${reference}` : ""}:\n` +
    `    Expected: ${toTypeDescription(T)}\n` +
    `    Found: ${value}`);

const toTypeDescription = T =>
    // FIXME: We'll want something like [[Description]] here, for Dependent
    // types.
    T instanceof type ? `instance of type ${T.name}` :
    IsConstructor(T) ? `instance of class ${T.name}` :
    "blah";

const IsTypeOrConstructor = T => T instanceof type || IsConstructor(T);

const IsAnnotation = args => IsTaggedCall(args);

const annotate = args => given((
    annotation = ToResolvedString(args)) =>
        annotation === "=" ? value => value :
        annotation === "()=" ? value => value :
        annotation === "const" ? value => value :
        annotation === "const()" ? value => value :
        annotation === "where" ? value => value :
        fail.syntax(`Unrecgonized type annotation: "${annotation}"`));


module.exports = Θ
({
    name: { value: "type" },

    [Θ.Call]: (type, _, [{ binding, hasInstance = false, construct }]) => Θ
    ({
        [Θ.Call]: (T, thisArg, args) => (console.log(args),
            IsAnnotation(args) ? annotate(args) :
            construct ? construct(T, thisArg, args) :
            fail.type(`${binding} is not a constructor.`)),

        [Θ.Prototype]: type.prototype,

        name: { value: binding },
        [I `Symbol.hasInstance`]: hasInstance && { value: hasInstance }
    }),


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
            type =>
            ({
                value: type({ binding, hasInstance }),
                enumerable: true
            })
        ])),

    check:
    {
        value: (T, value, reference) =>
            !IsTypeOrConstructor(T) ?
                mismatch(type, T, "type.check") :
            !(value instanceof T) ?
                mismatch(T, value, reference) :
                value
    }
});
