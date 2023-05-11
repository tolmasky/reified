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
    IsPropertyKey
} = require("@reified/ecma-262");
const fail = require("@reified/core/fail");
const { ø } = require("@reified/object");

const
{
    ƒnamed,
    ƒextending,
    IsTaggedCall,
    ToResolvedString
} = require("@reified/core/function-objects");

const BasicFactory = require("./basic-factory");
const Declaration = require("./declaration");
const { FieldValueDefinition } = require("./field");
const { ValueConstructorDeclaration, ValueConstructorDefinition } = require("./value-constructor");


const annotated = (annotation, T) =>
    annotation === "=" ?
        fallback => FieldValueDefinition({ type: T, default: fallback }) :

    // annotation === "?" ?  maybe(T) :
    // annotation === "[]") ? List(T) :

    fail (`Unrecognized annotation: ${annotation} on type ${T}`)


const TypeDefinition = BasicFactory `TypeDefinition` (declaration => given((
    { binding, ...rest } = declaration,
    constructors = ø(rest.constructors)) =>
({
    binding,
    constructors,
    implementation: function T(...args)
    {
        if (IsTaggedCall(args))
            return annotated(ToResolvedString(args), T);

        if (!HasOwnProperty(constructors, binding))
            fail(
                `${binding} cannot be directly instantiated, use one of its ` +
                `constructors instead:\n` +
                I `Object.keys` (constructors) [ `::Array.prototype.join`] (`\n`));

        return constructors[binding](...args);
    }
})));

const type = Declaration `type` (({ binding, body }) => given((
    constructors = I `Object.fromEntries` ([[binding, body]]
        [I `::Array.prototype.map`]
            (declaration => ValueConstructorDeclaration(...declaration))
        [I `::Array.prototype.map`]
            (ValueConstructorDefinition.parse)
        [I `::Array.prototype.map`]
            (({ binding, implementation }) => [binding, implementation]))) =>
    TypeDefinition
    ({
        binding,
        constructors,
    }).implementation));


const primitive = Declaration `primitive`
    (({ binding, body: hasInstance }) => given((
        T = TypeDefinition(binding, {}).implementation) =>
            I `Object.defineProperty` (
                T,
                Symbol.hasInstance,
                { value: hasInstance })));

// FIXME: Should Declaration only set the prototype if it's not Object or Function?
I `Object.setPrototypeOf` (primitive.prototype, type.prototype);

type.undefined = primitive `undefined` (IsUndefined);
type.null = primitive `null` (IsNull);
type.boolean = primitive `boolean` (IsBoolean);
type.string = primitive `string` (IsString);
type.symbol = primitive `symbol` (IsSymbol);
type.numeric = primitive `numeric` (IsNumeric);
type.number = primitive `number` (IsNumber);
type.bigint = primitive `bigint` (IsBigInt);
type.integer = primitive `integer` (IsIntegralNumber);
type.function = primitive `function` (IsFunctionObject);

type.PropertyKey = primitive `PropertyKey` (IsPropertyKey);


module.exports = type;

/*

const BasicFactory = Declaration `BasicFactory` ({ binding, })

function TypeDefinition()
{
}

const { I, IsArray } = require("@reified/ecma-262");

const Declaration = require("@reified/core/declaration");
const Definition = require("@reified/core/definition");
const fail = require("@reified/core/fail");
const { ƒnamed, IsTaggedCall } = require("@reified/core/function-objects");

const
{
    ValueConstructorDeclaration,
    ValueConstructorDefinition,
    ValueConstructorSymbols,
    GetValueConstructorOf,
    GetValueConstructorDefinitionOf,
    fromParsedConstructorName
} = require("./value-constructor");

const { ø, α } = require("@reified/object");


const [TypeDefinition, GetTypeDefinitionOf] = Definition `TypeDefinition`
    ((implementation, properties) =>
    ({
        implementation,
        ...properties
    }));
// can't rely on .length...
const type = Declaration `type` (declaration => given((
    binding = declaration.name,
    [name] = fromParsedConstructorName(binding),
    { tail: [cases, ...rest] } = declaration,
    T = ƒnamed(name, function (...argumentsList)
    {
        const constructor = definition.constructors[name];

        if (!constructor)
            return fail.type (
                `${name} cannot be directly instantiated, ` +
                `use one if it's constructors.`);

        return constructor(...argumentsList);
    },
    {
        get length() { return definition.constructors[name].length; },
        toString()
        {
            return definition.constructors[name].toString()
        }
    }),
    ValueConstructorDefinitions = !IsArray(cases) ?
        [ValueConstructorDefinition(T, { binding, tail: [cases] })] :
        I `Array.from` (
            cases,
            declaration => ValueConstructorDefinition(T, declaration)),
    definition = TypeDefinition(T,
    {
        constructors: ø.fromEntries(I `Array.from` (
            ValueConstructorDefinitions,
            definition => [definition.name, definition.implementation]))
    }),
    shorthands = ø.fromEntries(I `Array.from` (
        ValueConstructorDefinitions,
        definition =>
        [
            definition.name,
            definition.isConstant ?
                definition.instance :
                definition.implementation
        ])),
    { prototype, ...properties } = ø(...rest)) => I `Object.assign` (T,
    {
        prototype: α(T.prototype, prototype),

        ...shorthands,
        ...properties
    })));

const caseof = (...argumentsList) => IsTaggedCall(argumentsList) ?
    ValueConstructorDeclaration(...argumentsList) :
    given((
        [value, cases] = argumentsList,
        { default: fallback } = cases,
        C = GetValueConstructorOf(value),
        { name, symbol } = GetValueConstructorDefinitionOf(C),
        match = cases[symbol] ||
                cases[name] ||
                cases.default) => !match ?
            fail.type (`No match for ${name} found in caseof statement`) :
            match(value));

module.exports = I `Object.assign` (type,
{
    type,

    of: value => I `Object.getPrototypeOf` (value) .constructor,

    caseof,

    ...ValueConstructorSymbols
});

*/