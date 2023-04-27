const given = f => f();

const I = require("@reified/intrinsics");
const SymbolEnum = require("./symbol-enum");
const { IsArray, IsFunctionObject, IsString } = require("./types-and-values");
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

exports.ƒnamed = (name, f) => name ?
    I `Object.defineProperty` (f, "name", { value: name }) :
    f;

exports.IsFunctionObject = IsFunctionObject;

const IsTaggedCall = fArguments =>
    IsArray (fArguments) &&
    IsArray (fArguments[0]) &&
    I `Object.hasOwn` (fArguments[0], "raw");

exports.IsTaggedCall = IsTaggedCall;

const IsTagCoercibleCall = fArguments =>
    IsArray (fArguments) &&
    fArguments.length === 1 &&
    IsString(fArguments[0]);

exports.IsTagCoercibleCall = IsTagCoercibleCall;

const flattened = array => I `.Array.prototype.concat` ([], ...array);

const ToResolvedString = ([strings, ...values]) =>
    I `.Array.prototype.join` (
        flattened(I `Array.from`
            (strings, (string, index) => [string, values[index]])),
        "");

exports.ToResolvedString = ToResolvedString;

