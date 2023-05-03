const given = f => f();

const { Enum, apply } = require("@reified/core/enum");


module.exports = Enum `Mutation` (caseof =>
[
    caseof `Set()` (value => ({ value })),

    caseof `Delete()`
]);
