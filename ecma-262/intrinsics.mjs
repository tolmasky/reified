import { ArrayMap, ArrayFlatMap, ArrayFilter, SetHas, StringLastIndexOf, StringSubstr } from "./bootstrap.mjs";
import { IsPrimitive, IsString } from "./types-and-values.mjs";
import
{
    GetOwnPropertyDescriptorEntries,
    "Object.assign" as ObjectAssign,
    "Object.create" as ObjectCreate,
    "Object.freeze" as ObjectFreeze,
    "Object.fromEntries" as ObjectFromEntries,
    "Object.hasOwn" as ObjectHasOwn
} from "./object-objects.mjs";
import { Set } from "./set-objects.mjs";

const given = f => f();

const Call = (Function.prototype.call).bind(Function.prototype.call);

const SetAppended = (set, item) => (set.add(item), set);

const ø = properties => ObjectCreate(null, properties);
const Aø = ObjectFreeze([]);

const toI = given((
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
                    ]))))) => O => ObjectFromEntries(toIEntries(O, "", new Set())));

const CLASSES = { "string": "String" };

export default ObjectAssign(function I(strings, self)
{
    return  strings[0] !== "" ? I[strings[0]] :
            StringLastIndexOf(strings[1], ".") === 0 ?
                (...args) => Call(I[`${CLASSES[typeof self]}.prototype${strings[1]}`], self, ...args) :
            (...args) => Call(I[StringSubstr(strings[1], 1)], self, ...args);
}, toI(globalThis, "global"));

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