const given = f => f();

const WellKnownIntrinsicObjects = require("./es2022/well-known-intrinsic-objects");

const hasSymbols = !!global.Symbol;

const ArrayPrototype = Array.prototype;
const ArrayPrototypeFilter = ArrayPrototype.filter;
const ArrayPrototypeMap = ArrayPrototype.map;
const ArrayPrototypeReduce = ArrayPrototype.reduce;

const MapPrototype = Map.prototype;
const MapPrototypeGet = MapPrototype.get;

const ObjectHasOwnProperty = Object.hasOwnProperty;
const ObjectGetOwnPropertyDescriptor = Object.getOwnPropertyDescriptor;
const ObjectGetPrototypeOf = Object.getPrototypeOf;

const HasOwnProperty = (O, P) => Call(ObjectHasOwnProperty, O, P);

const RegExpPrototype = RegExp.prototype;
const RegExpPrototypeTest = RegExpPrototype.test;

const StringPrototype = String.prototype;
const StringPrototypeReplace = StringPrototype.replace;

const FunctionPrototype = Function.prototype;
const FunctionPrototypeCall = FunctionPrototype.call;

const Call = FunctionPrototypeCall.bind(FunctionPrototypeCall);

const ToPropertyKey = given((
    IsWellKnownSymbolRegExp = /^@@/) =>
    key => Call(RegExpPrototypeTest, IsWellKnownSymbolRegExp, key) ?
        hasSymbols && Symbol[Call(StringPrototypeReplace, key, IsWellKnownSymbolRegExp, "")] :
        key);

const TypeCheckedGet = (type, { key, field }, object) => given((
    descriptor = ObjectGetOwnPropertyDescriptor(object, ToPropertyKey(key)),
    value =
        !descriptor ? false :
        field === "[[Get]]" ?
            HasOwnProperty(descriptor, "get") && descriptor.get :
        field === "[[Set]]" ?
            HasOwnProperty(descriptor, "set") && descriptor.set :
            descriptor.value) =>
        (!type || typeof value === type || typeof value === "symbol") && value);

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
        {console.log("here...");
            return ObjectGetOwnPropertyDescriptor(arguments, "callee").get;
        }
        return false;
    })(),

    // "%AsyncFromSyncIteratorPrototype%":
    // %ForInIteratorPrototype%

    "%TypedArray%": ObjectGetPrototypeOf(Uint8Array)
};

const get = ({ key }) => TopLevelWellKnownObjects[key] || global[key];

function GetIntrinsicObject(type, keyPath)
{
    const last = keyPath.length - 1;

    return Call(
        ArrayPrototypeReduce,
        keyPath,
        (object, DKP, index) =>
            index === 0 ?
                get(DKP) :
                object &&
                TypeCheckedGet(index === last && type, DKP, object) ||
                false,
        global);
}
console.log(TopLevelWellKnownObjects);
const AvailableIntrinsicObjects = new Map(Call(
    ArrayPrototypeFilter,
    Call(
        ArrayPrototypeMap,
        WellKnownIntrinsicObjects,
        ({ type, descriptorKeyPath, WKID }) =>
            [GetIntrinsicObject(type, descriptorKeyPath), WKID]),
    ([object]) => !!object));

module.exports = object => Call(MapPrototypeGet, AvailableIntrinsicObjects, object);

console.log(AvailableIntrinsicObjects);
console.log(AvailableIntrinsicObjects.size + " vs. " + WellKnownIntrinsicObjects.length);
const every = new Set(AvailableIntrinsicObjects.values());
console.log("COULDNT FIND:",
WellKnownIntrinsicObjects
    .map(x => x.WKID)
    .filter(WKID => !every.has(WKID))
    .filter(WKID => !WKID.endsWith(`"@@toStringTag"`) && !WKID.endsWith(".constructor")));

console.log("hey -> ", GetIntrinsicObject(false, [
      {
        "key": "%TypedArray%",
        "field": "[[Value]]"
      }
    ]));

console.log("hey -> ", GetIntrinsicObject(false, [
      {
        "key": "%TypedArray%",
        "field": "[[Value]]"
      },
      {
        "key": "prototype",
        "field": "[[Value]]"
      }
    ]));

console.log("hey -> ", GetIntrinsicObject("function", [
      {
        "key": "Array",
        "field": "[[Value]]"
      },
      {
        "key": "prototype",
        "field": "[[Value]]"
      },
      {
        "key": "toString",
        "field": "[[Value]]"
      }
    ]));