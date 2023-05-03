const given = f => f();

const { I, Call } = require("@reified/ecma-262");


module.exports = C => given((
    prefix = `${C.name}.prototype.`) => I `Object.fromEntries`(
    I `Array.from` (Call(
        I `Array.prototype.filter`,
            I `Object.entries` (I),
            ([name]) => Call(I `String.prototype.startsWith`, name, prefix)),
        ([name, f]) =>
        [
            Call(I `String.prototype.replace`, name, prefix, ""),
            (target, ...args) => Call(f, target, ...args)
        ])));
