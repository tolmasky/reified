const given = f => f();

const { I } = require("@reified/ecma-262");
const { ø } = require("./object");


const SymbolEnum = (...args) => given((
    index = I `.Array.prototype.findIndex` (args, item => typeof item !== "string"),
    [names, sources] = index < 0 ?
        [args, []] :
        [
            I `.Array.prototype.slice` (args, 0, index),
            I `.Array.prototype.slice` (args, index)
        ],
    symbols = I `Array.from` (names, name => Symbol(name))) =>
        I `Object.setPrototypeOf` (
            I `Object.fromEntries` (I `Array.from`
                (symbols, symbol => [symbol.description, symbol])),
        {
            *[Symbol.iterator]() { return yield * symbols },
            extract: target => extract(symbols, target),
            ...sources,
        }));

const extract = (SE, target) => given((
    members = new Set([...SE]),
    descriptors = I `Object.getOwnPropertyDescriptors` (target),
    namedDescriptors = I `Object.getOwnPropertyNames` (descriptors)
        [I `::Array.prototype.map`] (name => [name, descriptors[name]]),
    symbolicDescriptors = I `Object.getOwnPropertySymbols` (descriptors)
        [I `::Array.prototype.map`] (symbol => [symbol, descriptors[symbol]])) =>
    [
        ø.fromPropertyDescriptors(I `Object.fromEntries`(
            symbolicDescriptors
                [I `::Array.prototype.filter`] (([symbol]) => members.has(symbol))
                [I `::Array.prototype.flatMap`] (([symbol, descriptor]) =>
                    [[symbol, descriptor], [symbol.description, descriptor]]))),

        ø.fromPropertyDescriptors(I `Object.fromEntries`(
            namedDescriptors
                [I `::Array.prototype.concat`] (
                symbolicDescriptors
                    [I `::Array.prototype.filter`] (([symbol]) => !members.has(symbol)))))
    ]);

module.exports = I `Object.assign` (SymbolEnum, { extract });
