const given = f => f();

const { I, GetMethod } = require("@reified/ecma-262");
const { ø, Ø, M } = require("@reified/core");

const { caseof, IsCaseofPropertyKey } = require("./caseof_");
const DataHasInhabitant = (T, V) => V instanceof T;


module.exports = Ø(({ Type0, Symbols: TS }) => Ø
({
    [Ø `Case`]: Type0
    ({
        [TS.Name]: "Case",
        // No case means self? Special one-time hack...
        [TS.Cases]: [],
        [TS.Exports]: [],
        [TS.Methods]: [],
        [TS.UnannotatedCall]: (Case, _, [definition = { }]) => Ø
        ({
            [Ø.Prototype]: I `Object.create` (Case.prototype),

            [Ø `name`]: definition.name,
            [Ø `symbol`]: Symbol(definition.name),
            [Ø `isConstant`]: definition.fields.length <= 0 || false // definition.fields.every(field => field.isConstant)
        })
    }),

    [Ø `parse`]: Ø(({ Case }) => (name, body) => Type0
    ({
        [TS.Name]: name,
        [TS.Cases]: [Case({ name, fields: [] })],
        [TS.Exports]: [],
        [TS.Methods]: [],
        [TS.HasInhabitant]: DataHasInhabitant,
        [TS.UnannotatedCall]: (T, _, args) => Construct(T, T[TS.Cases][0])
    }))
}));

const toPrototypeM = M((T, C) => Ø
({
    [Ø.Call]: () => fail.type(`${C[Symbols.Name]} is not meant to be called`),

    [Ø `name`]: `${T.name}.${C.name}`,

    [Ø `prototype`]: Ø(({ prototype }) => Ø
    ({
        ...Ø.from(prototype),

        [Ø.Prototype]: T.prototype
    }))
}).prototype);

// FIXME: Eventually when we do type constructors, we'll want to turn constants
// into functions... That way Maybe.Not(number) === Maybe(number).Not
const Construct = given((
    ConstructVariable = (T, C) => Ø({ [Ø.Prototype]: toPrototypeM(T, C) }),
    ConstructConstant = M(ConstructVariable)) =>
        (T, C) => C.isConstant ?
            ConstructConstant(T, C) :
            ConstructVariable(T, C));
