const given = f => f();

const fail = require("@reified/fail");
const I = require("@reified/intrinsics");
const { α, ø } = require("@reified/object");


const NormalFunctionRegExp =
    /^(?:get\s+)|(?:set\s+)|(?:(?:async\s+)?function[\s\*])/;
const isNormalFunction = f =>
    NormalFunctionRegExp.test(I.Function.prototype.toString.call(f));

const toResolvedString = (strings, ...values) => []
    .concat(...Array.from(strings, (string, index) => [string, values[index]]))
    .join("");

module.exports.toResolvedString = toResolvedString;

const isTaggedCall = args =>
    I.Array.isArray(args) &&
    I.Array.isArray(args[0]) &&
    I.Object.hasOwn(args[0], "raw");

const ƒ = (...tag) =>
    (f, ...sources) => α(
        I.Object.defineProperty(f, "name", { value: toResolvedString(...tag) }),
        ...sources);

module.exports = ƒ;

module.exports.ƒ = ƒ;

// Important that we respect untagged over tagged for function type. Or perhaps
// we should always make a function(){}, and then in the tagged case, do an
// inner check of whether it is function(){} or not.
// Also, we should be subclassing the right kind of function, Maybe use
// construct?...
const taggableBase = (tagged, untagged, ...sources) => given((
    body = function (...args)
    {
        return isTaggedCall(args) ?
            untagged ?
                tagged.call(this, toResolvedString(...args)) :
                (...rest) => tagged.call(this, toResolvedString(...args), ...rest) :
            untagged ? untagged.call(this, ...args) :
            tagged.call(this, false, ...args);
    }) => α(isNormalFunction(untagged || tagged) ?
        body :
        (...args) => body(...args), ...sources));

const taggable = taggableBase((tag, tagged, untagged, ...sources) => tag ?
    ƒ `${tag}` (taggableBase(tagged, untagged, ...sources)) :
    taggableBase(tagged, untagged, ...sources));

module.exports.taggable = taggable;


// This takes a function that returns a funtion, and makes that return function
// taggable. Unclear if this is what we have found ourselves wanting though.
const ƒƒ = taggable `ƒƒ` ((name, f, ...properties) => given((
    taggablef = taggable (
        tag => (...args) => ƒ `${tag}` (f(...args)),
        f)) => name ? ƒ `${name}` (taggablef) : taggablef));

const tagged = taggable `tagged` ((name, implementation) =>
    taggable `${name}` ((tag, ...rest) => !tag ?
        fail (`Function ${name || implementation.name} expected a tagged call.`) :
        implementation(tag, ...rest)));

module.exports.tagged = tagged;

// ƒ.tag = ƒ.tagged `ƒ.tag` ((name, f) => (...args) => f(toResolvedString(...args)));

