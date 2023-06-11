const given = f => f();

const { I, HasOwnProperty } = require("@reified/ecma-262");
const { ø } = require("./object");


const WeakMapSet = (WM, K, V) => (WM [I `::WeakMap.prototype.set`] (K, V), V);

const SymbolBijection = toDescription => given ((
    symbols = new I.WeakMap(),
    objects = ø(),
    hasObject = O => symbols [I `::WeakMap.prototype.has`] (O)) =>
({
    hasSymbol: symbol => HasOwnProperty(objects, symbol),
    hasObject,

    forSymbol: symbol => objects[symbol],
    toSymbol: O => hasObject(O) ?
        symbols [I `::WeakMap.prototype.get`] (O) : given((
            symbol = Symbol(toDescription(O)),
            stored = objects[symbol] = O) =>
                WeakMapSet(symbols, O, symbol))
}));

module.exports = SymbolBijection;
