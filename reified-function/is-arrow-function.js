const I = require("@reified/intrinsics");

const NonArrowFunctionRegExp =
    /^(?:get\s+)|(?:set\s+)|(?:(?:async\s+)?function[\s\*])/;

const IsArrowFunction = f =>
    I `.RegExp.prototype.test` (
        NonArrowFunctionRegExp,
        I `.Function.prototype.toString` (f));

module.exports = IsArrowFunction;
