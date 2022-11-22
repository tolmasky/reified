const { isArray: ArrayIsArray } = Array;
const
{
    defineProperty: ObjectDefineProperty,
    hasOwnProperty: ObjectHasOwnProperty
} = Object;
const hasOwnProperty = (value, key) => ObjectHasOwnProperty.call(value, key);

const fail = message => { throw Error(message); };


const toResolvedString = (strings, ...values) => []
    .concat(...Array.from(strings, (string, index) => [string, values[index]]))
    .join("");

const isTaggedCall = arguments =>
    ArrayIsArray(arguments) &&
    ArrayIsArray(arguments[0]) &&
    hasOwnProperty(arguments[0], "raw");

const fNamed = (...tag) => f =>
    ObjectDefineProperty(f, "name", { value: toResolvedString(...tag) });

const ƒ = fNamed;

module.exports.fNamed = fNamed;
module.exports.ƒ = fNamed;

const taggableBase = implementation => (...args) =>
    isTaggedCall(args) ?
        (...rest) => implementation(toResolvedString(...args), ...rest) :
        implementation(false, ...args);

const taggable = taggableBase((tag, implementation) => tag ?
    ƒ `${tag}` (taggableBase(implementation)) :
    taggableBase(implementation));

module.exports.taggable = taggable;

const tagged = taggable `tagged` ((name, implementation) =>
    taggable `${name}` ((tag, ...rest) => !tag ?
        fail (`Function ${name || implementation.name} expected a tagged call.`) :
        implementation(tag, ...rest)));

module.exports.tagged = tagged;
