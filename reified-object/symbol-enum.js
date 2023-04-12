const I = require("@reified/intrinsics");
const { ø } = require("@reified/object");


module.exports = (...names) => ø.fromEntries(
    I `Array.from` (names, name => [name, Symbol(name)]));
