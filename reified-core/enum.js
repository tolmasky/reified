const given = f => f();

const fail = require("@reified/fail");
const I = require("@reified/intrinsics");
const Declaration = require("./declaration");
const { ƒnamed, ƒextending } = require("./function-objects");
const SymbolEnum = require("./symbol-enum");

const { ø, α } = require("@reified/object");

const ESymbols = SymbolEnum("[[Constructors]]");

const Constant = (Enum, name) => given((
    constructor = ƒextending(Enum, name, function ()
    {
        return fail.type(
            `${name} is a constant constructor and should not be invoked. `+
            `Treat it like a value instead.`);
    })) =>
        I `Object.setPrototypeOf` (constructor, constructor.prototype));

const Enum = Declaration `Enum` (({ name, tail:[fCaseOfs, ...rest] }) => given((
    Enum = ƒnamed(name, function (...argumentsList)
    {
        const constructor = Enum[ESymbols["[[Constructors]]"]][name];

        if (!constructor)
            return fail.type (
                `${name} cannot be directly instantiated, ` +
                `use one if it's constructors.`);

        return constructor(...args);
    }),
    EnumPrototype = Enum.prototype,
    constructors = ø.fromEntries(I `Array.from` (
        fCaseOfs(Declaration `Case[${name}]`
            (({ name, tail:[constructor] }) =>
                ƒextending(Enum, name, function C(...argumentsList)
                {
                    return α(
                        I `Object.create` (C.prototype),
                        constructor(...argumentsList));
                }))),
        constructor => constructor instanceof Declaration.Tail ?
            (console.log("HERE",constructor, constructor.binding),[constructor.binding, Constant(Enum, constructor.binding)]) :
            [constructor.name, constructor]))) =>
    α(Enum,
    {
        ...constructors,
        [ESymbols["[[Constructors]]"]]: constructors,
        ...rest
    })));

module.exports = Enum;
