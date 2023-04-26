// This is adapted from node's string escape:
// https://github.com/nodejs/node/blob/main/lib/internal/util/inspect.js
//
// Importantly, we escape double quotes instead of single quotes.
const given = f => f();

// Escaped control characters (plus the single quote and the backslash). Use
// empty strings to fill up unused entries.
const meta =
[
  '\\x00', '\\x01', '\\x02', '\\x03', '\\x04', '\\x05', '\\x06', '\\x07', // x07
  '\\b', '\\t', '\\n', '\\x0B', '\\f', '\\r', '\\x0E', '\\x0F',           // x0F
  '\\x10', '\\x11', '\\x12', '\\x13', '\\x14', '\\x15', '\\x16', '\\x17', // x17
  '\\x18', '\\x19', '\\x1A', '\\x1B', '\\x1C', '\\x1D', '\\x1E', '\\x1F', // x1F
  '', '', '\\"', '', '', '', '', '', '', '', '', '', '', '', '', '',      // x2F
  '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '',         // x3F
  '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '',         // x4F
  '', '', '', '', '', '', '', '', '', '', '', '', '\\\\', '', '', '',     // x5F
  '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '',         // x6F
  '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '\\x7F',    // x7F
  '\\x80', '\\x81', '\\x82', '\\x83', '\\x84', '\\x85', '\\x86', '\\x87', // x87
  '\\x88', '\\x89', '\\x8A', '\\x8B', '\\x8C', '\\x8D', '\\x8E', '\\x8F', // x8F
  '\\x90', '\\x91', '\\x92', '\\x93', '\\x94', '\\x95', '\\x96', '\\x97', // x97
  '\\x98', '\\x99', '\\x9A', '\\x9B', '\\x9C', '\\x9D', '\\x9E', '\\x9F', // x9F
];

const EscapeSequencesTestRegExp = RegExp
([
    /[\x00-\x1f\x22\x5c\x7f-\x9f]/,
    /[\ud800-\udbff](?![\udc00-\udfff])/,
    /(?<![\ud800-\udbff])[\udc00-\udfff]/
].map(pattern => pattern.source).join("|"));
const EscapeSequencesReplaceRegExp =
    RegExp(EscapeSequencesTestRegExp.source, "g");

const toPrototypeCall = (Class, key, method = Class.prototype[key]) =>
    (...args) => method.call(...args);

const StringCharCodeAt = toPrototypeCall(String, "charCodeAt");
const NumberToString = toPrototypeCall(Number, "toString");
const RegExpTest = toPrototypeCall(RegExp, "test");
const StringReplace = toPrototypeCall(String, "replace");

const charEscape = string => given((
    charCode = StringCharCodeAt(string)) =>
    charCode < meta.length ?
        meta[charCode] :
        `\\u${NumberToString(charCode, 16)}`);

module.exports = string =>
    RegExpTest(EscapeSequencesTestRegExp, string) ?
        StringReplace(string, EscapeSequencesReplaceRegExp, charEscape) :
        string;
