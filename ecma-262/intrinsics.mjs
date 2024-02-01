import { ArrayMap, ArrayFlatMap } from "./bootstrap.mjs";
import
{
    IsPrimitive,
    IsBoolean,
    IsString,
    IsSymbol,
    IsNumber,
    IsBigInt,
    IsObject,
    IsFunctionObject
} from "./types-and-values.mjs";
import
{
    "Array.prototype.filter" as ArrayPrototypeFilter,
    "Array.prototype.map" as ArrayPrototypeMap
} from "./array-objects.mjs";
import
{
    GetOwnPropertyDescriptorEntries,
    "Object.assign" as ObjectAssign,
    "Object.create" as ObjectCreate,
    "Object.defineProperties" as ObjectDefineProperties,
    "Object.entries" as ObjectEntries,
    "Object.freeze" as ObjectFreeze,
    "Object.fromEntries" as ObjectFromEntries,
    "Object.hasOwn" as ObjectHasOwn,
    "Object.prototype" as ObjectPrototype,
    "Function.prototype.call" as FunctionPrototypeCall,
    "Function.prototype.bind" as FunctionPrototypeBind,
} from "./fundamental-objects.mjs";
import
{
    Set,
    "Set.prototype.has" as SetPrototypeHas
} from "./set-objects.mjs";

const given = f => f();

const ƒCall = FunctionPrototypeCall.bind(FunctionPrototypeCall);

const SetAppended = (set, item) => (set.add(item), set);

const ø = properties => ObjectCreate(null, properties);

const I = given((
    Aø = [],
    toAccess = (hasPrefix, K) =>
        K === false ? "" :
        IsString(K) ? hasPrefix ? `.${K}` : K :
        `[@@${K.description.substr("Symbol.".length)}]`,
    toAccessPath = (prefix, K, DK) =>
        `${prefix}${toAccess(!!prefix, K)}${toAccess(true, DK)}`,
    toExtantItems = array => ƒCall(ArrayPrototypeFilter, array, x => !!x),
    fromDescriptor = D => toExtantItems
    ([
        ObjectHasOwn(D, "value") && [false, D.value],
        ObjectHasOwn(D, "get") && ["[[Get]]", D.get],
        ObjectHasOwn(D, "set") && ["[[Set]]", D.set]
    ]),
    toIEntries = (V, prefix, visited) =>
        IsPrimitive(V) ? Aø :
        ƒCall(SetPrototypeHas, visited, V) ? Aø : given((
        uVisited = SetAppended(visited, V)) =>
            ArrayFlatMap(
                GetOwnPropertyDescriptorEntries(V, "STRING+SYMBOL"),
                ([K, D]) => ArrayFlatMap(
                    fromDescriptor(D),
                    ([DK, V]) => given((
                        uPrefix = toAccessPath(prefix, K, DK)) =>
                    [
                        [uPrefix, V],
                        ...toIEntries(V, uPrefix, uVisited)
                    ])))),
    toI = O => ObjectFromEntries(toIEntries(O, "", new Set()))) =>
    toI(globalThis));

const Iƒ = given((
    Aø = [],
    toƒCallOnEntry = ([key, value]) =>
        !IsFunctionObject(value) ? Aø : given((
            S = Symbol(key),
            toPrimitive = { value: () => S },
            name = { value: `::${key}` },
            F = ObjectDefineProperties(
                (...args) => ƒCall(value, ...args),
                { [I["Symbol.toPrimitive"]]: toPrimitive, name })) =>
            [[key, F]])) =>
                ObjectFromEntries(ArrayFlatMap(ObjectEntries(I), toƒCallOnEntry)));

ObjectDefineProperties(
    ObjectPrototype,
    ObjectFromEntries(ƒCall(
        ArrayPrototypeMap,
        ObjectEntries(Iƒ),
        ([key, F]) =>
        [
            F[I["Symbol.toPrimitive"]](),
            { get() { return (...args) => F(this, ...args) } }
        ])));

export default given((
    StringPrototypeStartsWith = Iƒ["String.prototype.startsWith"],
    StringPrototypeSubstr = Iƒ["String.prototype.substr"]) =>
    ([key]) =>
        StringPrototypeStartsWith(key, "::") ?
            Iƒ[StringPrototypeSubstr(key, 2)] :
            I[key]);
