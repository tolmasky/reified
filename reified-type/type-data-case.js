const given = f => f();

const { I, GetMethod } = require("@reified/ecma-262");
const { ø, Ø } = require("@reified/core");


module.exports = Ø(({ Type0, Symbols: TS }) => Type0
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
        [Ø `isConstant`]: true
    })
}));
