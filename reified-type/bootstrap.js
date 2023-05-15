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
    HasOwnProperty,
    GetOwnPropertyDescriptorEntries,
} = require("@reified/ecma-262");

const fail = require("./fail");
const { IsTaggedCall, ToResolvedString } =
    require("@reified/core/function-objects");

const ϕ = (O, fProperties) => I `Object.assign` (O, fProperties(O));
const ø = (...sources) => I `Object.assign` (I `Object.create` (null), ...sources);


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
    `Type mismatch${reference ? ` in ${reference}` : ""}:\n` +
    `    Expected: ${toTypeDescription(T)}\n` +
    `    Found: ${value}`);

const toTypeDescription = T =>
    // FIXME: We'll want something like [[Description]] here, for Dependent
    // types.
    T instanceof type ? T.name :
    IsFunctionObject(T) ? T.name :
    "blah";

const IsTypeOrConstructor = T =>
    T instanceof type || IsFunctionObject(T);

const type = ƒ ("type", I `Function`, type =>
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
            mismatch(type, T, "type.check") :
        !(value instanceof T) ?
            mismatch(T, value, reference) :
            value
}));

I `Object.setPrototypeOf` (type, type.prototype);

module.exports = type;

const GetConstructorOf = O =>
    I `Object.getPrototypeOf` (type.check(type.object, O, "GetConstructorOf"))
        .constructor;

const caseof = function caseof(...args)
{
/*    if (IsTaggedCall(args))
        return I `Object.create` (caseof.prototype,
        {
            binding: DataProperty(ToResolvedString(args), true),
            [toPrimitive]: MethodProperty(self => CaseofSymbols.toSymbol(self))
        });

    if (args.length === 1 && IsCaseofPropertyKey(args[0]))
        return CaseofSymbols.forSymbol(args[0]);
*/

    const [value, cases] = args;
    const { default: fallback } = cases;

    const C = GetConstructorOf(value);

//    const C = GetValueConstructorOf(value);
//    const { name, symbol } = GetValueConstructorDefinitionOf(C);
    const match =
//        cases[symbol] ||
        cases[C.name] ||
        cases.default;

    return !match ?
        fail.type (`No match for ${name} found in caseof statement`) :
        match(value);
}

const OrdinaryDataCreate = (constructor, fields, source) =>
    I `Object.assign` (
        I `Object.create` (constructor.prototype),
        fields [I `::Array.prototype.reduce`] (
            (values, field) => I `Object.assign` (values,
            {
                [field.binding]: extract(field, source, values)
            }), ø()));

const Data = ({ binding, fields }) => ƒ (binding, false, F =>
({
    target: (...args) =>
        annotate(...args) ||
        OrdinaryDataCreate(F, fields, ...args),

    prototypeOf: type.prototype,
}));

const Field = Data
({
    binding: "Field",
    fields:
    [
        { type, binding: "type" },
        { type: type.string, binding: "binding" }
    ]
});

module.exports.Field = Field;

/*
function Data()
{
}

function Field() { }

Field.fields =
[
    { type: type, binding: "type" },
    { type:
]



module.exports.OrdinaryDataCreate = OrdinaryDataCreate;*/

module.exports.Data = Data;

const extract = ({ type: T, binding, value }, source, values) =>
    HasOwnProperty(source, binding) ?
        type.check(T, source[binding], `in field ${binding}`) :
        fail.type (
                        `No value was provided for required field "${binding}".`)
/*

    caseof(value,
    {
        [Field.Value.Constant]: initialize(source, values),
        [Field.Value.Variable]: ({ default: fallback }) =>
            HasOwnProperty(source, binding) ?
                type.check(T, binding, `in field ${binding}`) :
                caseof(fallback,
                {
                    None: () => fail.type (
                        `No value was provided for required field "${binding}".`),
                    Just: initialize(source, values)
                })
    })

/*

Field({ type, binding, Constant(initializer), Variable(initializer) })

const initialize = (source, values) => initializer => caseof(initializer,
{
    [Initializer.Static]: value => value,
    // FIXME: ? In theory compute will be type-checked already, so we don't
    // need to do it manually...
    [Initializer.Computed]: compute => compute(values)
});

const extract = ({ type: T, binding, value }, source, values) =>
    caseof(value,
    {
        [Field.Value.Constant]: initialize(source, values),
        [Field.Value.Variable]: ({ default: fallback }) =>
            HasOwnProperty(source, binding) ?
                type.check(T, binding, `in field ${binding}`) :
                caseof(fallback,
                {
                    None: () => fail.type (
                        `No value was provided for required field "${binding}".`),
                    Just: initialize(source, values)
                })
    })

function Field()

    [caseof `Data`]:
    ({
        [Definition]    :of => Definition,

        [Call]: annotate or construct
    }),
*/
