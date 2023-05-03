const given = f => f();

const { type, caseof } = require("@reified/core/type");


module.exports = type `Mutation`
([
    caseof `Set()` (value => ({ value })),

    caseof `Delete()`
]);
