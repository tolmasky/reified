const given = f => f();

const { I } = require("@reified/ecma-262");
const { ø, Ø, SymbolEnum } = require("@reified/core");

const PrimitiveHasInhabitants = require("./primitive-has-inhabitants");

const Symbols = SymbolEnum(
    "Name",
    "Constructors",
    "Exports",
    "Methods",
    "HasInhabitant",
    "UnannotatedCall");
console.log(Ø);

// FIXME: Should we do Type(N) => So that Type(0) HAS fields, but Type(1)
// doesn't?
module.exports = Ø
({
    [Ø.Call]: (Type_0, _, [definition = { }]) => Ø
    ({
        [Ø.Call]: () => console.log("hi..."),

        [Ø.Prototype]: I `Object.create` (Type_0.prototype),

        // Should we automatically make this unenumerated since it's a function?
        // or should this be a getter?... (might not play nice with RunKit)
        [Ø `name`]: definition[Symbols.Name],

        ...ø([...Symbols]
            [I `::Array.prototype.map`]
                (S => [Ø(S) .unenumerable, definition[S]]))

        // Spread exports
        // Spread methods -- ehhh, actually rely on the parser to do that.
    }),

    [Ø `name`]: "Type(0)",

    [Ø `prototype`]: Ø(({ prototype }) => Ø
    ({
        ...Ø.from(prototype),

        // FIXME: We're expecting UnannotatedCall to exist to avoid using
        // Maybe<Function>.
        [Ø.Call]: (T, thisArg, args) => IsAnnotation(args) ?
            annotate(args, T) :
            GetMethod(T, Symbols.UnannotatedCall)(T, thisArg, args),

        // Spread methods... Or is this the job of the class builder?...
    })),

    [Ø `Symbols`]: ø(Symbols),

    [Ø `primitives`]: Ø(Type_0 => Ø(ø(
        I `Object.entries` (PrimitiveHasInhabitants)
            [I `::Array.prototype.map`] (([name, HasInhabitant]) =>
            [
                Ø(name),
                Type_0
                ({
                    [Symbols.Name]: name,
                    // Should we just do V => check(self, V)?
                    [Symbols.Constructors]: [],
                    [Symbols.Exports]: ø(),
                    [Symbols.Methods]: ø(),
                    [Symbols.HasInhabitant]: HasInhabitant,
                    [Symbols.UnannotatedCall]: () => console.log("BAD")
                })
            ])))),

    [Ø `primitiveof`]: Ø(Type0 => given((
        primitives = I `Object.values` (Type0.primitives)) =>
            value => primitives
                [I `::Array.prototype.find`]
                    (P => P[Symbols.HasInhabitant](value)))),

    ...Ø(({ primitives }) => Ø.from(primitives)),

    [Ø `inhabitantof`]: (T, V) => T[Symbols.HasInhabitant](V)

    // Or is it, given((Constructor = ...)
    // [Ø `Constructor`]:
});
