const toWellKnownValueRegistry =
    require("@reified/well-known-value/to-well-known-value-registry");
console.log(toWellKnownValueRegistry);
const ObjectGetOwnPropertyDescriptor = Object.getOwnPropertyDescriptor;
const ObjectGetPrototypeOf = Object.getPrototypeOf;

const evalSafe = string => { try { return eval(string); } catch (e) { return false } };

const withSafeEvaluatedValue = (string, f) =>
    { try { return f(eval(string)) } catch (e) { return false; } };

const getEvaluatedPrototypeOf = string =>
    withSafeEvaluatedValue(string,
        object => ObjectGetPrototypeOf(object));
const getEvaluatedConstructor = string =>
    withSafeEvaluatedValue(string,
        object => ObjectGetPrototypeOf(object).constructor);

const TopLevelWellKnownObjects =
{
    "AsyncFunction": getEvaluatedConstructor("(async function() { })"),
    "AsyncGeneratorFunction": getEvaluatedConstructor("(async function * () { })"),
    "GeneratorFunction": getEvaluatedConstructor("(function * () { })"),
    "%IteratorPrototype%": ObjectGetPrototypeOf(getEvaluatedPrototypeOf("[][Symbol.iterator]()")),
    "%ArrayIteratorPrototype%": getEvaluatedPrototypeOf("[][Symbol.iterator]()"),
    "%MapIteratorPrototype%": getEvaluatedPrototypeOf(`(new Map())[Symbol.iterator]()`),
    "%SetIteratorPrototype%": getEvaluatedPrototypeOf(`(new Set())[Symbol.iterator]()`),
    "%StringIteratorPrototype%": getEvaluatedPrototypeOf(`""[Symbol.iterator]()`),
    "%RegExpStringIteratorPrototype%": getEvaluatedPrototypeOf(`"".matchAll(/a/g)`),
    "%ThrowTypeError%": (function()
    {
        "use strict";
        try { arguments.callee }
        catch (e)
        {
            return ObjectGetOwnPropertyDescriptor(arguments, "callee").get;
        }
        return false;
    })(),

    // "%AsyncFromSyncIteratorPrototype%":
    // %ForInIteratorPrototype%

    "%TypedArray%": ObjectGetPrototypeOf(Uint8Array)
};

const registry = toWellKnownValueRegistry(
    false,
    ({ key }) => TopLevelWellKnownObjects[key] || global[key],
    require("./es2022/well-known-intrinsic-objects"));
console.log(registry);
module.exports = value => registry.getWKVID(value);


/*
const given = f => f();

const hasSymbols = !!global.Symbol;

const ArrayPrototype = Array.prototype;
const ArrayPrototypeFilter = ArrayPrototype.filter;
const ArrayPrototypeMap = ArrayPrototype.map;
const ArrayPrototypeReduce = ArrayPrototype.reduce;

const map = (array, f) => Call(ArrayPrototypeMap, array, f);
const filter = (array, f) => Call(ArrayPrototypeFilter, array, f);

const MapPrototype = Map.prototype;
const MapPrototypeGet = MapPrototype.get;

const ObjectHasOwnProperty = Object.hasOwnProperty;
const ObjectKeys = Object.keys;
const ObjectGetOwnPropertyDescriptor = Object.getOwnPropertyDescriptor;
const ObjectGetPrototypeOf = Object.getPrototypeOf;
const ObjectFromEntries = Object.fromEntries;

const HasOwnProperty = (O, P) => Call(ObjectHasOwnProperty, O, P);

const RegExpPrototype = RegExp.prototype;
const RegExpPrototypeTest = RegExpPrototype.test;

const StringPrototype = String.prototype;
const StringPrototypeReplace = StringPrototype.replace;

const FunctionPrototype = Function.prototype;
const FunctionPrototypeCall = FunctionPrototype.call;

const Call = FunctionPrototypeCall.bind(FunctionPrototypeCall);

const ToPropertyKey = key =>
    typeof key === "string" ?
        key :
        WellKnownSymbols[key.WKID];

const TypeCheckedGet = (type, { key, field }, object) => given((
    descriptor = ObjectGetOwnPropertyDescriptor(object, ToPropertyKey(key)),
    value =
        !descriptor ? false :
        field === "[[Get]]" ?
            HasOwnProperty(descriptor, "get") && descriptor.get :
        field === "[[Set]]" ?
            HasOwnProperty(descriptor, "set") && descriptor.set :
            descriptor.value) =>
        value);

const evalSafe = string => { try { return eval(string); } catch (e) { return false } };

const withSafeEvaluatedValue = (string, f) =>
    { try { return f(eval(string)) } catch (e) { return false; } };

const getEvaluatedPrototypeOf = string =>
    withSafeEvaluatedValue(string,
        object => ObjectGetPrototypeOf(object));
const getEvaluatedConstructor = string =>
    withSafeEvaluatedValue(string,
        object => ObjectGetPrototypeOf(object).constructor);

const TopLevelWellKnownObjects =
{
    "AsyncFunction": getEvaluatedConstructor("(async function() { })"),
    "AsyncGeneratorFunction": getEvaluatedConstructor("(async function * () { })"),
    "GeneratorFunction": getEvaluatedConstructor("(function * () { })"),
    "%IteratorPrototype%": ObjectGetPrototypeOf(getEvaluatedPrototypeOf("[][Symbol.iterator]()")),
    "%ArrayIteratorPrototype%": getEvaluatedPrototypeOf("[][Symbol.iterator]()"),
    "%MapIteratorPrototype%": getEvaluatedPrototypeOf(`(new Map())[Symbol.iterator]()`),
    "%SetIteratorPrototype%": getEvaluatedPrototypeOf(`(new Set())[Symbol.iterator]()`),
    "%StringIteratorPrototype%": getEvaluatedPrototypeOf(`""[Symbol.iterator]()`),
    "%RegExpStringIteratorPrototype%": getEvaluatedPrototypeOf(`"".matchAll(/a/g)`),
    "%ThrowTypeError%": (function()
    {
        "use strict";
        try { arguments.callee }
        catch (e)
        {
            return ObjectGetOwnPropertyDescriptor(arguments, "callee").get;
        }
        return false;
    })(),

    // "%AsyncFromSyncIteratorPrototype%":
    // %ForInIteratorPrototype%

    "%TypedArray%": ObjectGetPrototypeOf(Uint8Array)
};

const get = ({ key }) => TopLevelWellKnownObjects[key] || global[key];

function toWellKnownEntry({ type, descriptorKeyPath, WKID })
{
    const last = descriptorKeyPath.length - 1;
    const value = Call(
        ArrayPrototypeReduce,
        descriptorKeyPath,
        (object, DKP, index) =>
            index === 0 ?
                get(DKP) :
                object &&
                TypeCheckedGet(index === last && type, DKP, object) ||
                false,
        global);

    return [WKID, value];
}

const toIDstoValues = WKVDs =>
    ObjectFromEntries(filter(map(WKVDs, toWellKnownEntry), entry => !!entry));

const WellKnownIntrinsicValues = require("./es2022/well-known-intrinsic-objects");
const WellKnownSymbols = toIDstoValues(filter(
    WellKnownIntrinsicValues,
    WKIV =>
        WKIV.descriptorKeyPath[0].key === "Symbol" &&
        WKIV.type === "symbol"));

const WellKnownObjectsAndSymbols =
{
    ...WellKnownSymbols,
    ...toIDstoValues(filter(
        WellKnownIntrinsicValues,
        WKIV => WKIV.type === "object" || WKIV.type === "function"))
};

const WellKnownIDs = new Map(map(
    ObjectKeys(WellKnownObjectsAndSymbols),
    key => [WellKnownObjectsAndSymbols[key], key]));

module.exports = object => Call(MapPrototypeGet, WellKnownIDs, object);

*/