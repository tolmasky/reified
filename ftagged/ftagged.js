const given = f => f();
const { isArray: ArrayIsArray } = Array;
const
{
    defineProperty: ObjectDefineProperty,
    hasOwnProperty: ObjectHasOwnProperty
} = Object;
const { toString: FunctionPrototypeToString } = Function.prototype;
const hasOwnProperty = (value, key) => ObjectHasOwnProperty.call(value, key);

const fail = message => { throw Error(message); };


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

const fNamed = (...tag) => f =>
    ObjectDefineProperty(f, "name", { value: toResolvedString(...tag) });

const ƒ = fNamed;

module.exports.fNamed = fNamed;
module.exports.ƒ = fNamed;

const taggableBase = implementation => given((
    body = function (...args)
    {
        return isTaggedCall(args) ?
            (...rest) => implementation.call(this, toResolvedString(...args), ...rest) :
            implementation.call(this, false, ...args);
    }) =>
    isNormalFunction(implementation) ?
        body :
        (...args) => body(...args));

const taggable = taggableBase((tag, implementation) => tag ?
    ƒ `${tag}` (taggableBase(implementation)) :
    taggableBase(implementation));

module.exports.taggable = taggable;

const tagged = taggable `tagged` ((name, implementation) =>
    taggable `${name}` ((tag, ...rest) => !tag ?
        fail (`Function ${name || implementation.name} expected a tagged call.`) :
        implementation(tag, ...rest)));

module.exports.tagged = tagged;
