const given = f => f();

const WellKnownIntrinsicObjects = require("./es2022/well-known-intrinsic-objects");

const hasSymbols = !!global.Symbol;

const ArrayPrototype = Array.prototype;
const ArrayPrototypeMap = ArrayPrototype.map;
const ArrayPrototypeReduce = ArrayPrototype.reduce;

const MapPrototype = Map.prototype;
const MapPrototypeGet = MapPrototype.get;

const ObjectHasOwnProperty = Object.hasOwnProperty;
const ObjectGetOwnPropertyDescriptor = Object.getOwnPropertyDescriptor;

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

// FIXME: Check type === "function" ?
const TypeCheckedGet = (type, key, object) => given((
    descriptor = ObjectGetOwnPropertyDescriptor(object, key)) =>
    !descriptor ? false :
    type === "getter" ?
        HasOwnProperty(descriptor, "get") && descriptor.get :
    type === "setter" ?
        HasOwnProperty(descriptor, "set") && descriptor.set :
        descriptor.value);

function GetIntrinsicObject(type, keyPath)
{
    // Can we trust .length?
    const last = keyPath.length - 1;

    return Call(
        ArrayPrototypeReduce,
        keyPath,
        (object, encoded, index) => object && given((
            key = ToPropertyKey(encoded)) =>
            !key ? false :
            (index === last ?
                TypeCheckedGet(type, key, object) :
                // Access with descriptor?...
                object[key]) || false),
        global);
}

const AvailableIntrinsicObjects = new Map(Call(
    ArrayPrototypeMap,
    WellKnownIntrinsicObjects,
    ({ type, fullyQualifiedKeyPath, fullyQualifiedName }) =>
        [GetIntrinsicObject(type, fullyQualifiedKeyPath), fullyQualifiedName]));
console.log(AvailableIntrinsicObjects);
module.exports = object => Call(MapPrototypeGet, AvailableIntrinsicObjects, object);
