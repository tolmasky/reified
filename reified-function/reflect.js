const given = f => f();
const I = require("@reified/intrinsics");
const SymbolEnum = require("@reified/foundation/symbol-enum");
// const { α } = require("@reified/object");


const IsArrowFunction = given((
    NonArrowFunctionRegExp =
        /^(?:get\s+)|(?:set\s+)|(?:(?:async\s+)?function[\s\*])/) =>
    f => !NonArrowFunctionRegExp
        [I `::RegExp.prototype.test`]
            (f[I `::Function.prototype.toString`]()));

exports.IsArrowFunction = IsArrowFunction;

const ThisMode = SymbolEnum("Lexical", "Strict", "Global");

exports.ThisMode = ThisMode;

exports.GetApproximateThisMode = f =>
    IsArrowFunction(f) ? ThisMode.Lexical : ThisMode.Global;
