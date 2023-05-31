const given = f => f();

const { I, GetMethod } = require("@reified/ecma-262");
const { ø, Ø, SymbolEnum } = require("@reified/core");

const { IsTypeAnnotation, TypeAnnotate } = require("./type-annotation");
const PrimitiveDefinitions = require("./primitive-definitions");

const Symbols = SymbolEnum(
    "Name",
    "Constructors",
    "Exports",
    "Methods",
    "HasInhabitant",
    "UnannotatedCall");

// FIXME: Is this actaully Type(Infinity), and we should then make Type(N)
// where somehow, Type(N + 1) is lazy?...

// FIXME: Should we do Type(N) => So that Type(0) HAS fields, but Type(1)
// doesn't?
module.exports = Ø
({
    [Ø.Call]: (Type_0, _, [definition = { }]) => Ø
    ({
        [Ø.Prototype]: I `Object.create` (Type_0.prototype),

        // Should we automatically make this unenumerated since it's a function?
        // or should this be a getter?... (might not play nice with RunKit)
        [Ø `name`]: definition[Symbols.Name],

        ...ø([...Symbols]
            [I `::Array.prototype.map`]
                (S => [Ø(S) .unenumerable, definition[S]])),

        ...ø(definition[Symbols.Exports]
            [I `::Array.prototype.map`] (({ key, value }) => [Ø(key), value]))

        // Spread methods -- ehhh, actually rely on the parser to do that.
    }),

    [Ø `name`]: "Type(0)",

    [Ø.Prototype]: I `Function.prototype`,

    [Ø `prototype`]: Ø(({ prototype }) => Ø
    ({
        ...Ø.from(prototype),

        // FIXME: We're expecting UnannotatedCall to exist to avoid using
        // Maybe<Function>.
        [Ø.Call]: (T, thisArg, args) => IsTypeAnnotation(args) ?
            TypeAnnotate(args, T) :
            GetMethod(T, Symbols.UnannotatedCall)(T, thisArg, args),
    })),

    [Ø `Symbols`]: ø(Symbols),

    [Ø `primitives`]: Ø(Type_0 => Ø(ø(
        I `Object.entries` (PrimitiveDefinitions)
            [I `::Array.prototype.map`]
                (([name, [UnannotatedCall, HasInhabitant]]) =>
                [
                    Ø(name),
                    Type_0
                    ({
                        [Symbols.Name]: name,
                        // FIXME: Should it show up here too?
                        [Symbols.Constructors]: [],
                        [Symbols.Exports]: [],
                        [Symbols.Methods]: [],
                        [Symbols.HasInhabitant]: HasInhabitant,
                        [Symbols.UnannotatedCall]: UnannotatedCall
                    })
                ])))),

    [Ø `primitiveof`]: Ø(Type0 => given((
        primitives = I `Object.values` (Type0.primitives)) =>
            value => primitives
                [I `::Array.prototype.find`]
                    (P => P[Symbols.HasInhabitant](value)))),

// FIXME: this overrides the Prototype...
//    ...Ø(({ primitives }) => Ø.from(primitives)),

    [Ø `inhabitantof`]: (T, V) => T[Symbols.HasInhabitant](V)

    // Or is it, given((Constructor = ...)
    // [Ø `Constructor`]:
});
