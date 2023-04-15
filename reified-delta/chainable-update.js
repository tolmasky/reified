const { α } = require("@reified/object");
const ƒnamed = require("@reified/language/function-named");
const { FunctionFactory } = require("@reified/object/factory");
const SymbolEnum = require("@reified/object/symbol-enum");
const { Collection, map, reduce } = require("@reified/collection");


const S = SymbolEnum("[[ChildUpdates]]");

const toChainableUpdateMethod = method => ƒnamed(method.name, function (...args)
{
    const reversed = args.slice().reverse();
    const curried = target => method(target, ...reversed);
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

module.exports.delta = ChainableUpdate((target, ...updates) => reduce(updates, (target, update) => update(target), target));
