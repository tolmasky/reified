const
{
    IsNumberValueRegExp,
    IsSymbolValueRegExp,
    IsStringValueRegExp,
    IsFunctionValueRegExp
} = require("templated-regular-expression")
({

    ExactValue: /(\*NaN\*|\*[^\s]+\*𝔽)(\s*\(.+\))?/,
    ApproximateValue: /approximately [\d\.]+(\s×\s\d+(-\d+)?)?/,
    ThisIsADataPropertyRegExp: /^This is a data property with a value of \d+\./,
    TheValueIsRegExp: /^The (Number )?value .+ is (${ExactValue}|${ApproximateValue})\.$/,
    IsNumberValueRegExp: /${ThisIsADataPropertyRegExp}|${TheValueIsRegExp}/,

    IsSymbolValueRegExp:
        /The initial value of `[A-Za-z\.]+` is the well[\s-]?known symbol @@[A-Za-z]+/,

    TheEmptyString: /the empty String/,
    TheStringValue: /the String value ${StringValue}/,
    StringValue: /\*"[^"]+"\*/,
    String: /${TheEmptyString}|${TheStringValue}?\*"[^"]+"\*/,
    ValueOf: /`[^\s]+` is (${TheEmptyString}|${StringValue})/,
    ValueOfProperty: /the [^\s]+ property is ${TheStringValue}/,
    IsStringValueRegExp: /^The initial value of (?:${ValueOf}|${ValueOfProperty})\.$/,

    Getter: /^get\s+/,
    Setter: /^set\s+/,
    ParameterList: /\s*\(.+$/,
    IsFunctionValueRegExp: /${Getter}|${Setter}|${ParameterList}/
});


module.exports = (signature, description) =>
    IsNumberValueRegExp.test(description) ? "number" :
    IsSymbolValueRegExp.test(description) ? "symbol" :
    IsStringValueRegExp.test(description) ? "string" :
    IsFunctionValueRegExp.test(signature) ? "function" :
    "object";
