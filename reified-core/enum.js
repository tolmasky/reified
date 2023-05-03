const given = f => f();

const fail = require("@reified/fail");
const I = require("@reified/intrinsics");
const Declaration = require("./declaration");
const Definition = require("./definition");
const { ƒnamed, ƒextending, IsFunctionObject } = require("./function-objects");

const
{
    ValueConstructorDeclaration,
    ValueConstructorDefinition,
    ValueConstructorSymbols,
    GetValueConstructorOf,
    GetValueConstructorDefinitionOf,
} = require("./value-constructor");

const { ø, α } = require("@reified/object");


const [TypeDefinition, GetTypeDefinitionOf] = Definition `TypeDefinition`
    ((implementation, properties) =>
    ({
        implementation,
        ...properties
    }));

const TypeConstructor = Declaration `TypeConstructor` (declaration => given((
    { name, tail: [fCaseOfs, ...rest] } = declaration,
    T = ƒnamed(name, function (...argumentsList)
    {
        const constructor = definition.constructors[name];

        if (!constructor)
            return fail.type (
                `${name} cannot be directly instantiated, ` +
                `use one if it's constructors.`);

        return constructor(...argumentsList);
    }),
    ValueConstructorDefinitions = I `Array.from` (
        fCaseOfs(ValueConstructorDeclaration),
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

const caseof = (value, cases) => given((
    { default: fallback } = cases,
    C = GetValueConstructorOf(value),
    definition = GetValueConstructorDefinitionOf(C),
    match = cases[definition.symbol] ||
            cases[definition.name] ||
            cases.default) =>
        !match ?
            fail.type (`No match for ${definition.name} found in caseof statement`) :
            match(value));

module.exports = I `Object.assign` (TypeConstructor,
{
    Enum: TypeConstructor,
    caseof,
    ...ValueConstructorSymbols
});

