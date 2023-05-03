const given = f => f();

const { I, Call, IsArray, IsObject, IsString } = require("@reified/ecma-262");
const { ø, α } = require("@reified/object");

const GetPrototypeMethodsOf = require("./get-prototype-methods-of");
const CopyValue = require("@reified/delta/copy-value");


const A = given((
    A = GetPrototypeMethodsOf(Array)) =>
({
    ...A,

    partition: (target, filter) =>
        [A.filter(target, filter), A.filter(target, (...args) => !filter(...args))],

    // We do Array.from to avoid arrays with non-index entries.
    toEntries: target => I `Array.from` (target, (value, index) => [index, value]),
    fromEntries: target => I `Object.assign` ([], O.fromEntries(target)),

    filterEntries: (target, f) =>
        A.filter(target, (value, index) => f([index, value])),

    // NEED TO do itN if we want to reverse f and start
    reduce: (target, f, start) => A.reduce(target, f, start)
}));

const O =
{
    toEntries: I `Object.entries`,
    fromEntries: I `Object.fromEntries`
}

const S =
{
    ...GetPrototypeMethodsOf(String),

    toEntries: target => A.toEntries(S.split(target, "")),
    fromEntries: target => A.join(
        I `Array.from` (target, ([_, string]) => string),
        "")
}

const M =
{
    toEntries: target => [...Call(I `Map.prototype.entries`, target)],
    fromEntries: target => new I `Map` (target)
};

const FromEntries = 1;
const ToEntries = 2;
const FromToEntries = FromEntries | ToEntries;

// set
// setEntry
// setProperty
// For all builtins, setEntry === setProperty


// set SPECIAL(K) -> PD.V
// setProperty SPECIAL(K) -> PD
// setEntry -> [K, V] (for Objects, setEntry === set)

// assign { [SPECIAL(K)]: PD.V }
// assignProperties: { [SPECIAL(K)]: PD }
// assignEntries: [[K, V], [K, V], ...

// SHORTHAND:
// { [prototype]: },
// { [prototype.update]: },
// { [property `a`]: }, (same as { a: })
// { [property (symbol)]: }
// { [entry `a`]: } -> SetEntry
// { [] }
// { a: 10 }

const fCollectionMethods =
{
    fromEntries: false,
    toEntries: false,

    get: to => (target, key) => target[key],
    set: to => (target, keylike, value) =>
        KeyPath(keylike).set(target, value),

    assign: to => (target, source) =>(console.log(target),
        α(CopyValue(target), source)),

    assignEntries: (to, { fromEntries }) => (target, source) =>
        fromEntries([...C.toEntries(target), ...source]),

    assignEntriesFrom: (to, { fromEntries }) => (target, source) =>
        fromEntries([...C.toEntries(target), ...C.toEntries(source)]),

    update: to => (target, ...rest) =>
        rest.length === 1 ? rest[0](target) :
        I `Object.assign` (CopyValue(target), { [rest[0]]: rest[1](target[rest[0]]) }),

    concat: to => (target, ...sources) =>
        I `Object.assign` (CopyValue(target), ...sources),

    group: to => (target, f) =>
        A.reduce(target, (result, item) => given((
            key = f(item),
            items = result[key] || []) =>
                (items.push(item), result[key] = items, result)), ø()),

    // FIXME: Broken.
    partition: to => to(A.partition, f => ([key, value]) => f(value, key)),
    partitionEntries: to => to(A.partition),

    filter: to => to(A.filter, f => ([key, value]) => f(value, key)),
    filterEntries: to => to(A.filter),

    map: to => to(A.map, f => ([key, value]) => [key, f(value, key)]),
    mapEntries: to => to(A.map),

    reduce: to => to(A.reduce, f => (accum, [key, value]) => f(accum, value, key), ToEntries),
    reduceEntries: to => to(A.reduce, f => (accum, entry) => f(accum, entry), ToEntries)
};

const toComputedCollectionMethods = M => given((
    { fromEntries, toEntries } = M,
    toCollectionMethod = (Af, toEntryIterator = x => x, flags = FromToEntries) =>
        (target, f, ...args) => given((
            fromEntries = (flags & FromEntries) ? M.fromEntries : x => x,
            toEntries = (flags & ToEntries) ? M.toEntries : x => x,
            iterator = toEntryIterator(f)) =>
            fromEntries(Af(toEntries(target), iterator, ...args)))) =>
    I `Object.assign` ({ },
        M,
        O.fromEntries(
            I `Array.from` (
                O.toEntries(fCollectionMethods),
                ([key, f]) => [key, M[key] || f(toCollectionMethod, M)]))));

const toCollectionMethod = given((
    methods = A.map(
    [
        [IsArray, A],
        [IsString, S],
        [value => value instanceof I `Map`, M],
        [IsObject, O]
    ],
        (([predicate, methods]) =>
            [predicate, toComputedCollectionMethods(methods)]))) =>
    key =>
        (target, ...args) =>
            A.find(methods,
                ([predicate]) => predicate(target))[1][key]
            (target, ...args));

const Collection = toCollectionMethod("map")
    (fCollectionMethods, (_, key) => toCollectionMethod(key));

const C = Collection;

module.exports = α(Collection,
{
    Collection,
    ...toCollectionMethod("map")(
        fCollectionMethods,
        (_, key) => toCollectionMethod(key))
});
