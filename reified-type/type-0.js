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
                (S => [Ø /*.unenumerated*/ (S), definition[S]]))

        // FIXME: First problem, should this be a Maybe<Function>?
        // Should we decide this, or should the caller?
        /*
        [Ø.PrivateSlot `DesignatedCall`]:
            definition.exports
                [I `::Array.prototype.find`]
                    (exported => exported.name === name) || false;*/

        // Spread exports
        // Spread methods -- ehhh, actually rely on the parser to do that.
    }),
    
    [Ø `name`]: "Type(0)",

    [Ø `prototype`]: Ø(({ prototype }) => Ø
    ({
        ...Ø.from(prototype),

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
    
/*
        primitiveof = V => primitives
            [I `::Array.prototype.find`]
                (P => P[Symbols.HasInhabitant](V))) =>
            ø
            ([
                ...primitives
                [Ø `primitives`, ø(primitives)],
                [Ø `primitiveof`, primitiveof]
            ]))),*/

    // Or is it, given((Constructor = ...)
    // [Ø `Constructor`]: 
});

/*

    [Ø `prototype` `...`]:
    {
        [Ø.Call]: (T, thisArg, args) => IsAnnotation(args) ?
            annotate(args, T) :
            GetMethod(T, Symbols.UnannotatedCall)(T, thisArg, args),

        // Spread methods... Or is this the job of the class builder?...
    },
*/
