const { α } = require("@reified/object");
const { ƒnamed } = require("@reified/foundation/function-objects");
const { FunctionFactory } = require("@reified/foundation/factory");
const SymbolEnum = require("@reified/foundation/symbol-enum");
const { Collection, map, reduce } = require("@reified/collection");


const S = SymbolEnum("[[ChildUpdates]]");

const toChainableUpdateMethod = method => ƒnamed(method.name, function (...args)
{
    const curried = target => method(target, ...args);
    const ChildUpdates = [...(this[S["[[ChildUpdates]]"]] || []), curried];
    const implementation = target =>
        reduce(ChildUpdates, (target, update) => update(target), target);

    return α(
        ChainableUpdate(implementation),
        { [S["[[ChildUpdates]]"]]: ChildUpdates });
});

const ChainableUpdate = FunctionFactory `ChainableUpdate`
    (class extends Function { }, map(Collection, toChainableUpdateMethod));

module.exports = ChainableUpdate;
