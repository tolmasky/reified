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

const TypeCheckedGet = (type, [key, field], object) => given((
    descriptor = ObjectGetOwnPropertyDescriptor(object, ToPropertyKey(key)),
    value =
        !descriptor ? false :
        field === "[[Get]]" ?
            HasOwnProperty(descriptor, "get") && descriptor.get :
        field === "[[Set]]" ?
            HasOwnProperty(descriptor, "set") && descriptor.set :
            descriptor.value) =>
        (!type || typeof value === type) && value);

function GetIntrinsicObject(type, keyPath)
{
    const last = keyPath.length - 1;

    return Call(
        ArrayPrototypeReduce,
        keyPath,
        (object, DKP, index) =>
            object &&
            TypeCheckedGet(index === last && type, DKP, object) ||
            false,
        global);
}

const AvailableIntrinsicObjects = new Map(Call(
    ArrayPrototypeMap,
    WellKnownIntrinsicObjects,
    ({ type, fullyQualifiedKeyPath, fullyQualifiedName }) =>
        [GetIntrinsicObject(type, fullyQualifiedKeyPath), fullyQualifiedName]));
console.log(AvailableIntrinsicObjects);
module.exports = object => Call(MapPrototypeGet, AvailableIntrinsicObjects, object);
