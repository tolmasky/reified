const given = f => f();

const { Enum, caseof } = require("@reified/core/enum");


module.exports = Enum `Mutation`
([
    caseof `Set()` (value => ({ value })),

    caseof `Delete()`
]);
