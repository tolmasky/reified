const given = f => f();
const I = require("@reified/intrinsics");
const SymbolEnum = require("@reified/object/symbol-enum");
// const { α } = require("@reified/object");


const IsArrowFunction = given((
    NonArrowFunctionRegExp =
        /^(?:get\s+)|(?:set\s+)|(?:(?:async\s+)?function[\s\*])/) =>
    f => !I `.RegExp.prototype.test` (
        NonArrowFunctionRegExp,
        I `.Function.prototype.toString` (f)));

exports.IsArrowFunction = IsArrowFunction;

const ThisMode = SymbolEnum("Lexical", "Strict", "Global");

exports.ThisMode = ThisMode;

exports.GetApproximateThisMode = f =>
    IsArrowFunction(f) ? ThisMode.Lexical : ThisMode.Global;
