const given = f => f();

const { I, IsSymbol } = require("@reified/ecma-262");
const { IsTaggedCall, ToResolvedString } = require("@reified/core/function-objects");

const { toPrimitive } = Symbol;
const SymbolBijection = require("./symbol-bijection");

const CaseofSymbols = SymbolBijection(caseof =>
    `@reified/type/caseof/${I `String` (caseof.binding)}`);

//const IsCaseofKey = key => IsSymbol(key) && 

const DataProperty = (value, enumerable = false) => ({ value, enumerable });
const MethodProperty = (value, ...rest) =>
    DataProperty(function (...args) { return value(this, ...args) }, ...rest);

const caseof = function caseof(...args)
{
    if (IsTaggedCall(args))
        return I `Object.create` (caseof.prototype,
        {
            binding: DataProperty(ToResolvedString(args), true),
            [toPrimitive]: MethodProperty(self => CaseofSymbols.toSymbol(self))
        });

    const [value, cases] = args;
    const { default: fallback } = cases;

    const C = GetValueConstructorOf(value);
    const { name, symbol } = GetValueConstructorDefinitionOf(C);
    const match =
        cases[symbol] ||
        cases[name] ||
        cases.default;

    return !match ?
        fail.type (`No match for ${name} found in caseof statement`) :
        match(value);
}

caseof.IsCaseofPropertyKey = key => IsSymbol(key) && CaseofSymbols.hasSymbol(key);

module.exports = caseof;

