const given = f => f();

const { Enum, apply } = require("@reified/core/enum");


module.exports = Enum `Mutation` (caseof =>
[
    caseof `Set()` (value =>
    ({
        [apply]: self => self,
        value
    })),

    caseof `Delete()`
    ({
        [apply]: self => self
    })
]);
