const { isArray: ArrayIsArray } = Array;
const
{
    defineProperty: ObjectDefineProperty,
    hasOwnProperty: ObjectHasOwnProperty
} = Object;
const hasOwnProperty = (value, key) => ObjectHasOwnProperty.call(value, key);

const toResolvedString = (strings, ...values) => []
    .concat(...Array.from(strings, (string, index) => [string, values[index]]))
    .join("");

const isTaggedCall = arguments =>
    ArrayIsArray(arguments) &&
    ArrayIsArray(arguments[0]) &&
    hasOwnProperty(arguments[0], "raw");



module.exports.taggable = implementation => (...arguments) =>
    isTaggedCall(arguments) ?
        (...rest) =>
            implementation({ tag: toResolvedString(...arguments), arguments: rest }) :
        implementation({ tag: false, arguments });


    
module.exports.fNamed = (...tag) => f =>
    ObjectDefineProperty(f, "name", { value: toResolvedString(...tag) });
