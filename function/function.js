const given = f => f();

const { isArray: ArrayIsArray } = Array;
const
{
    assign: ObjectAssign,
    defineProperty: ObjectDefineProperty,
    hasOwnProperty: ObjectHasOwnProperty
} = Object;
const { toString: FunctionPrototypeToString } = Function.prototype;
const hasOwnProperty = (value, key) => ObjectHasOwnProperty.call(value, key);

const fail = require("@reified/fail");


const NormalFunctionRegExp =
    /^(?:get\s+)|(?:set\s+)|(?:(?:async\s+)?function[\s\*])/;
const isNormalFunction = f =>
    NormalFunctionRegExp.test(FunctionPrototypeToString.call(f));

const toResolvedString = (strings, ...values) => []
    .concat(...Array.from(strings, (string, index) => [string, values[index]]))
    .join("");

module.exports.toResolvedString = toResolvedString;

const isTaggedCall = args =>
    ArrayIsArray(args) &&
    ArrayIsArray(args[0]) &&
    hasOwnProperty(args[0], "raw");

const ƒ = (...tag) => (f, ...attributes) => ObjectAssign(
    ObjectDefineProperty(f, "name", { value: toResolvedString(...tag) }),
    ...attributes);

module.exports = ƒ;

module.exports.ƒ = ƒ;

const taggableBase = (tagged, untagged) => given((
    body = function (...args)
    {
        return isTaggedCall(args) ?
            untagged ?
                tagged.call(this, toResolvedString(...args)) :
                (...rest) => tagged.call(this, toResolvedString(...args), ...rest) :
            untagged ? untagged.call(this, ...args) :
            tagged.call(this, false, ...args);
    }) =>
    isNormalFunction(untagged || tagged) ?
        body :
        (...args) => body(...args));

const taggable = taggableBase((tag, tagged, untagged) => tag ?
    ƒ `${tag}` (taggableBase(tagged, untagged)) :
    taggableBase(tagged, untagged));

module.exports.taggable = taggable;

// This takes a function that returns a funtion, and makes that return function
// taggable. Unclear if this is what we have found ourselves wanting though.
const ƒƒ = taggable `ƒƒ` ((name, f) => given((
    taggablef = taggable (
        tag => (...args) => ƒ `${tag}` (f(...args)),
        f)) => name ? ƒ `${name}` (taggablef) : taggablef));

const tagged = taggable `tagged` ((name, implementation) =>
    taggable `${name}` ((tag, ...rest) => !tag ?
        fail (`Function ${name || implementation.name} expected a tagged call.`) :
        implementation(tag, ...rest)));

module.exports.tagged = tagged;
