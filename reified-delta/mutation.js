const given = f => f();

const { type, caseof, apply } = require("@reified/core/type");


module.exports = type `Mutation`
([
    caseof `Set()` (value => ({ value })),

    caseof `Delete()`,

    caseof `Update()` (implementation =>
    ({
        [apply]: (f, thisArgument, [current]) => implementation(current),
        implementation
    }))
]);
