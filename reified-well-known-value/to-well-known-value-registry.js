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
const ObjectFromEntries = Object.fromEntries || function fromEntries(entries)
{
    process.exit(1);
};


const HasOwnProperty = (O, P) => Call(ObjectHasOwnProperty, O, P);

const RegExpPrototype = RegExp.prototype;
const RegExpPrototypeTest = RegExpPrototype.test;

const StringPrototype = String.prototype;
const StringPrototypeReplace = StringPrototype.replace;

const FunctionPrototype = Function.prototype;
const FunctionPrototypeCall = FunctionPrototype.call;

const Call = FunctionPrototypeCall.bind(FunctionPrototypeCall);

const isSerializedWellKnownSymbol = ({ type }) => type === "symbol";
const isSerializedWellKnownObject =
    ({ type }) => type === "object" || type === "function";

const toLivePropertyKey = (parent, key) =>
    typeof key === "string" ?
        key :
        parent[key.WKID];

const toLiveValue = (parent, { key, field }, object) => given((
    descriptor =
        ObjectGetOwnPropertyDescriptor(object, toLivePropertyKey(parent, key)),
    value =
        !descriptor ? false :
        field === "[[Get]]" ?
            HasOwnProperty(descriptor, "get") && descriptor.get :
        field === "[[Set]]" ?
            HasOwnProperty(descriptor, "set") && descriptor.set :
            descriptor.value) =>
        value);

const toWellKnownEntry = entrypoint => 
    ({ type, descriptorKeyPath, WKID: WKVID }) => given((
    last = descriptorKeyPath.length - 1,
    value = Call(
        ArrayPrototypeReduce,
        descriptorKeyPath,
        (object, DKF, index) =>
            index === 0 ?
                entrypoint(DKF) :
                object &&
                toLiveValue(index === last && type, DKF, object) ||
                false,
        global)) => [WKVID, value]);

const toWKVIDsToValues = (parent, entrypoint, serialized) =>(console.log(serialized),
({
    ...parent,
    ...ObjectFromEntries(
        filter(
            map(serialized, toWellKnownEntry(entrypoint)),
            entry => !!entry))
}));

const toWellKnownValueRegistry = (parent, entrypoint, serialized) => given((
    WKVIDsToValues = toWKVIDsToValues(
        toWKVIDsToValues(
            parent && parent.WKVIDsToValues,
            entrypoint,
            filter(serialized, isSerializedWellKnownSymbol)),
        entrypoint,
        filter(serialized, isSerializedWellKnownObject))) =>
({
    WKVIDsToValues,
    ValuesToWKVIDs: new Map(map(
        ObjectKeys(WKVIDsToValues),
        key => [WKVIDsToValues[key], key])),
    getWKVID(value)
    {
        return Call(MapPrototypeGet, this.ValuesToWKVIDs, value) || false;
    }
}));

module.exports = toWellKnownValueRegistry;
        