const given = f => f();

const { I, IsFunctionObject } = require("@reified/ecma-262");

const Declaration = require("./declaration");
const Definition = require("./definition");
const fail = require("./fail");
const { ƒnamed, IsTaggedCall } = require("./function-objects");

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
    ValueConstructorDefinitions = IsFunctionObject(cases) ?
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
