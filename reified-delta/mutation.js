const { IsFunctionObject } = require("@reified/core/types-and-values");
const Enum = require("@reified/core/enum");


const Mutation = Enum `Mutation` (caseof =>
[
    caseof `Mutation` (value =>
        value instanceof Mutation ?
            value :
            Mutation.Set(value)),

    caseof `Set` (value => ({ value })),
    caseof `Delete`,
    caseof `Spread` (value => ({ value })),
    caseof `Splice` ((start, count, value) => ({ start, count, value })),

    caseof `fromShorthand` ((target, update) =>
        update instanceof Mutation ? update :
        IsFunctionObject(update) ? Mutation(update(target)) :
        Mutation.Set(update))
]);

module.exports = Mutation;
