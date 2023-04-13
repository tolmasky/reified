const given = f => f();

const I = require("@reified/intrinsics");
const { ø } = require("@reified/object");


module.exports = (...args) => given((
    index = I `.Array.prototype.findIndex` (args, item => typeof item !== "string"),
    [names, sources] = index < 0 ?
        [args, []] :
        [
            I `.Array.prototype.slice` (args, 0, index),
            I `.Array.prototype.slice` (args, index)
        ]) =>
    ø(ø.fromEntries(
        I `Array.from` (names, name => [name, Symbol(name)])),
        ...sources));
