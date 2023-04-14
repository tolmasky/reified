const I = require("@reified/intrinsics");


const flattened = array => I `.Array.prototype.concat` ([], ...array);

const IsTaggedCall = fArguments =>
    I `Array.isArray` (fArguments) &&
    I `Array.isArray` (fArguments[0]) &&
    I `Object.hasOwn` (fArguments[0], "raw");

module.exports.IsTaggedCall = IsTaggedCall;

const ToResolvedString = ([strings, ...values]) =>
    I `.Array.prototype.join` (
        flattened(I `Array.from`
            (strings, (string, index) => [string, values[index]])),
        "");

module.exports.ToResolvedString = ToResolvedString;
