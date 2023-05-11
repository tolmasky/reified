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
    IsFunctionObject
} = require("@reified/ecma-262");
const fail = require("@reified/core/fail");

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
//const { ValueConstructorDefinition } = require("./value-constructor");




const TypeDefinition = BasicFactory `TypeDefinition`
    (({ binding, ...rest }) => given((
        instantiate = HasOwnProperty(rest, "instantiate") ?
            rest.instantiate :
            `${binding} cannot be directly instantiated`) =>
({
    binding,
    implementation: function T(...args)
    {
        return  !IsTaggedCall(args) ?
                    instantiate(...args) :
                ToResolvedString(args) === "=" ?
                    fallback =>
                        FieldValueDefinition({ type: T, default: fallback }) :
                    fail (ToResolvedString(args) + " not supported");
    }
})));

const type = Declaration `type` (({ binding, body }) =>
    TypeDefinition
    ({
        binding,
        instantiate: x => x//ValueConstructorDefinition({ binding, tail[0]).implementation
    }).implementation);


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