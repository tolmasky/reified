import { ArrayMap, ArrayFlatMap, ArrayFilter, SetHas, StringLastIndexOf, StringSubstr } from "./bootstrap.mjs";
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
    "Array.isArray" as IsArray
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
    "Object.hasOwn" as ObjectHasOwn
} from "./object-objects.mjs";
import { Set } from "./set-objects.mjs";

const given = f => f();

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
    fromDescriptor = D => ArrayFilter
    ([
        ObjectHasOwn(D, "value") && [false, D.value],
        ObjectHasOwn(D, "get") && ["[[Get]]", D.get],
        ObjectHasOwn(D, "set") && ["[[Set]]", D.set]
    ], x => !!x),
    toIEntries = (V, prefix, visited) =>
        IsPrimitive(V) ? Aø :
        SetHas(visited, V) ? Aø : given((
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
    FunctionPrototypeCall = I["Function.prototype.call"],
    FunctionPrototypeBind = I["Function.prototype.bind"],
    ƒCall = FunctionPrototypeCall.bind(FunctionPrototypeCall),
    toƒCallOnEntry = ([key, value]) =>
        !IsFunctionObject(value) ? Aø : given((
            S = Symbol(key),
            toPrimitive = { value: () => S },
            name = { value: key },
            F = ObjectDefineProperties(
                (...args) => ƒCall(value, ...args),
                { [I["Symbol.toPrimitive"]]: toPrimitive, name })) =>
            [[key, F]])) =>
                ObjectFromEntries(ArrayFlatMap(ObjectEntries(I), toƒCallOnEntry)));

ObjectDefineProperties(
    I["Object.prototype"],
    ObjectFromEntries(ArrayMap(
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

/*

        // FIXME: Do we want this still? It is a shorthand for
        StringPrototypeStartsWith(key, ".") ?
            (...args) => ƒCall(StringPrototypeSubstr(key, 1), ...args) :

/*        ArrayFlatMap(
            ArrayFilter(
                ObjectEntries(I),
                ([key, value]) => IsFunctionObject(value)),
            ([key, value]) => [key, [Symbol(key), ƒCallOn(value)]])));*/
console.log(Iƒ);

/*


export default given((
    called = false,
    toBind = null,
    Bind = global.Symbol && Symbol("Bind"),
    FunctionPrototypeCall = I["Function.prototype.call"],
    FunctionPrototypeBind = I["Function.prototype.bind"],
    ƒCall = FunctionPrototypeCall.bind(FunctionPrototypeCall),
    ƒCallOn = F => (...args) => ƒCall(F, ...args);
    // In the past, we did this at initial call time, but since this should only
    // be used for debug, just do it immediately.
    I["Object.defineProperty"](
        I["Object.prototype"],
        Bind,
        { get () { return 𝑏Call(FunctionPrototypeBind, toBind, this); } }),
    StringPrototypeStartsWith = ƒCallOn(I["String.prototype.startsWith"]),
    StringPrototypeSubstr = ƒCallOn(I["String.prototype.substr"]),
    ) => (
    ([key]) => (
        StringPrototypeStartsWith(key, "::") ?
            (toBind = I[StringPrototypeSubstr(key, 2)], Bind) :
        // FIXME: Do we want this still? It is a shorthand for
        StringPrototypeStartsWith(key, ".") ?
            (...args) => ƒCall(StringPrototypeSubstr(key, 1), ...args) :
        I[key])));

/*


const Call = (Function.prototype.call).bind(Function.prototype.call);

export default given((
    toTypedPrefix = value =>
        IsBoolean(value) ? "Boolean.prototype" :
        IsString(value) ? "String.prototype" :
        IsSymbol(value) ? "Symbol.prototype" :
        IsNumber(value) ? "Number.prototype" :
        IsBigInt(value) ? "BigInt.prototype" :
        IsArray(value) ? "Array.prototype" :
        IsObject(value) ? "Object.prototype" :
        fail("OH NO"),
    I = (strings, self) =>
        strings[0] !== "" ? I[strings[0]] : given((
            explicit = StringLastIndexOf(strings[1], ".") !== 0,
            signature = explicit ?
                StringSubstr(strings[1], 1) :
                `${toTypedPrefix(self)}${strings[1]}`,
            f = I[signature]) =>
                (...args) => Call(f, self, ...args))) =>
    ObjectAssign(I, toI(globalThis)));

/*
const I = [{ Element }).map
{
    "Element.prototype.hasAttribute": Element.prototype.hasAttribute,
    "Element.prototype.setAttribute": Element.prototype.setAttribute
}*/

/*





exports.GetOwnPropertyDescriptorEntries = GetOwnPropertyDescriptorEntries;

const I = given((
    called = false,
    toBind = null,
    Bind = global.Symbol && Symbol("Bind")) => (
    ([key]) => (
        !called && I["Object.defineProperty"](
            I["Object.prototype"],
            Bind,
            { get () { return I.Call(I["Function.prototype.bind"], toBind, this); } }),
        called = true,
        I.Call(I["String.prototype.startsWith"], key, "::") ?
            ((toBind = I[key.substr(2)]), Bind) :
        I.Call(I["String.prototype.startsWith"], key, ".") ?
            (...args) => I.Call(I[key.substr(1)], ...args) :
        I[key])));

const ArrayPrototypeMap = Arrat.prototype.map;
const ObjectGetOwnEntries = Object.entries;


const ObjectGetOwnPropertyNames = Object.prototype.getOwnPropertyNames;
*/