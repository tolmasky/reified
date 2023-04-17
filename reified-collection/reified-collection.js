const given = f => f();

const { I, Call } = require("@reified/intrinsics");
const { α } = require("@reified/object");

const GetPrototypeMethodsOf = require("./get-prototype-methods-of");


const A = given((
    A = GetPrototypeMethodsOf(Array)) =>
({
    ...A,

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

const FromEntries = 1;
const ToEntries = 2;
const FromToEntries = FromEntries | ToEntries;

const fCollectionMethods =
{
    get: to => (target, key) => target[key],
    set: to => (target, key, value) =>
        I `Object.assign` ({}, target, { [key]: value }),

    update: to => (target, ...rest) =>
        rest.length === 1 ? rest[0](target) :
        I `Object.assign` ({}, target, { [rest[0]]: rest[1](target[rest[0]]) }),

    concat: to => (target, ...sources) =>
        I `Object.assign` ({}, target, ...sources),

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
                ([key, f]) => [key, M[key] || f(toCollectionMethod)]))));

const IsArray = value => I `Array.isArray` (value);
const IsString = value => typeof value === "string";
const IsObjectType = value =>
    value &&
    (typeof value === "object" || typeof value === "function");

const toCollectionMethod = given((
    methods = A.map(
        [[IsArray, A], [IsString, S], [IsObject, O]],
        (([predicate, methods]) =>
            [predicate, toComputedCollectionMethods(methods)]))) =>
    key =>
        (target, ...args) =>
            A.find(methods,
                ([predicate]) => predicate(target))[1][key]
            (target, ...args));

const Collection = toCollectionMethod("map")
    (fCollectionMethods, (_, key) => toCollectionMethod(key));

module.exports = α(Collection,
{
    Collection,
    ...toCollectionMethod("map")(
        fCollectionMethods,
        (_, key) => toCollectionMethod(key))
});
