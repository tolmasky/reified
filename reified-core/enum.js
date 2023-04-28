const given = f => f();

const fail = require("@reified/fail");
const I = require("@reified/intrinsics");
const Declaration = require("./declaration");
const { ƒnamed, ƒextending, IsFunctionObject } = require("./function-objects");
const SymbolEnum = require("./symbol-enum");

const { ø, α } = require("@reified/object");

const ESymbols = SymbolEnum("[[Constructors]]");

const Constant = (Enum, name, properties) => given((
    constructor = ƒextending(Enum, name, function ()
    {
        return fail.type(
            `${name} is a constant constructor and should not be invoked. `+
            `Treat it like a value instead.`);
    })) => α(
        I `Object.setPrototypeOf`(constructor, constructor.prototype),
        properties));

const Enum = Declaration `Enum` (({ name, tail:[fCaseOfs, ...rest] }) => given((
    Enum = ƒnamed(name, function (...argumentsList)
    {
        const constructor = Enum[ESymbols["[[Constructors]]"]][name];

        if (!constructor)
            return fail.type (
                `${name} cannot be directly instantiated, ` +
                `use one if it's constructors.`);

        return constructor(...argumentsList);
    }),
    constructors = ø.fromEntries(I `Array.from` (
        fCaseOfs(Declaration `Case[${name}]`
            (({ name, tail: [constructor] }) =>
                IsFunctionObject(constructor) ?
                    ƒextending(Enum, name, function C(...argumentsList)
                    {
                        const constructed = constructor(...argumentsList);

                        return constructed instanceof Enum ?
                            constructed :
                            α(I `Object.create` (C.prototype), constructed);
                    }) :
                Constant(Enum, name, constructor))),
        constructor => constructor instanceof Declaration.Tail ?
            [constructor.binding, Constant(Enum, constructor.binding)] :
            [constructor.name, constructor])),
    { prototype, ...properties } = ø(...rest)) => I `Object.assign` (Enum,
    {
        prototype: α(Enum.prototype, prototype),
        ...constructors,
        [ESymbols["[[Constructors]]"]]: constructors,
        ...properties
    })));

module.exports = Enum;
