const given = f => f();

const { I, Call } = require("@reified/intrinsics");
const { α } = require("@reified/object");

const GetPrototypeMethodsOf = require("./get-prototype-methods-of");


const A =
{
    ...GetPrototypeMethodsOf(Array),

    // We do Array.from to avoid arrays with non-index entries.
    toEntries: target => I `Array.from` (target, (value, index) => [index, value]),
    fromEntries: target => I `Object.assign` ([], O.fromEntries(target)),

    filterEntries: (target, f) =>
        A.filter(target, (value, index) => f([index, value]))
}

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

const fCollectionMethods =
{
    reduce: to => to(A.reduce),
    concat: to => (target, ...sources) => I `Object.assign` ({}, target, ...sources),

    filter: to => to(A.filter, f => ([key, value]) => f(value, key)),
    filterEntries: to => to(A.filter),

    map: to => to(A.map, f => ([key, value]) => [key, f(value, key)]),
    mapEntries: to => to(A.map)
};

const toComputedCollectionMethods = M => given((
    { fromEntries, toEntries } = M,
    toCollectionMethod = (Af, toEntryIterator = x => x) =>
        (target, f, ...args) => given((
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
const IsObject = value => value && typeof value === "object";

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
