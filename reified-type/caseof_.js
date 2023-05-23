const given = f => f();

const { I, IsSymbol, HasOwnProperty } = require("@reified/ecma-262");
const { IsTaggedCall, ToResolvedString } = require("@reified/core/function-objects");

const { toPrimitive } = Symbol;
const SymbolBijection = require("./symbol-bijection");

const CaseofSymbols = SymbolBijection(caseof =>
    `@reified/type/caseof/${I `String` (caseof.name)}`);

const { Ø, fail } = require("@reified/core");

const IsCaseofPropertyKey =
    key => IsSymbol(key) && CaseofSymbols.hasSymbol(key);

const GetConstructorOf = O => I `Object.getPrototypeOf` (O).constructor;


module.exports = Ø
({
    [Ø.Call]: (caseof, _, args) =>

        IsTaggedCall(args) ?
            Ø
            ({
                [Ø.Prototype]: caseof.prototype,
                name: { value: ToResolvedString(args) },
                [toPrimitive]:
                    { value() { return CaseofSymbols.toSymbol(this) } }
            }) :

        args.length === 1 && IsCaseofPropertyKey(args[0]) ?
            CaseofSymbols.forSymbol(args[0]) : given((

        [value, cases] = args,
        { name, symbol } = GetConstructorOf(value),
        key = [symbol, name, "default"]
            [I `::Array.prototype.find`]
                (key => HasOwnProperty(cases, key))) =>
        key ?
            cases[key](value) :
            fail.type (`No match for ${name} found in caseof statement`)),

    caseof: caseof => ({ value: caseof }),

    IsCaseofPropertyKey: { value: IsCaseofPropertyKey },
});
