const given = f => f();

const escape = require("@reified/string/escape");


const SpecialCharactersRegExp = /^[%@]|^\[\[|(\.)/;
const OIFQuote = string => given((
    escaped = escape(string)) =>
        escaped !== string || SpecialCharactersRegExp.test(escaped) ?
            `"${escaped}"` :
             string);

// canonical?
const toWellKnownID = (scope, descriptorKeyPath) =>
[
    OIFQuote(scope),
    ...descriptorKeyPath
        .map(({ key, field }) =>
        [
            typeof key === "string" ?
                OIFQuote(key) :
                `@${OIFQuote(key.WKID)}`,
            field !== "[[Value]]" ? `.${field}` : ""
        ].join(""))
].join(".");

module.exports = toWellKnownID;

//ES2022.%TypedArray%
//ES2022.%Array%
