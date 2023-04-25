const given = f => f();

const I = require("@reified/intrinsics");
const { α } = require("@reified/object");

const { reduce } = require("@reified/collection");
const ChainableUpdate = require("./chainable-update");
const { IsFunctionObject } = require("@reified/foundation/types-and-values");


const Δ = ChainableUpdate((target, ...updates) =>
    reduce(updates, (target, update) => IsFunctionObject(update) ?
        update(target) :
        Δ.assign(update)(target), target));

module.exports = I `Object.assign` (Δ, { Δ });

/*

const ObjectAssign = I `Object.assign`;

const ObjectGetOwnSymbolEntries = O =>
    I `Object.getOwnPropertySymbols`(O)
        [I `::Array.prototype.map`] (key => ([key, O[key]]));

const ObjectGetOwnEntries = O =>
    I `Object.entries` (O)
        [I `::Array.prototype.concat`]
            (ObjectGetOwnSymbolEntries(O));

const mapEntries = (O, f) =>
    I `Object.fromEntries` (I `Array.from` (ObjectGetOwnEntries(O), f));


const Δ = (target, ...sources) => sources
    [I `::Array.prototype.filter`] (source => !!source)
    [I `::Array.prototype.map`] (I `Object.getOwnPropertyDescriptors`)
    [I `::Array.prototype.flatMap`] (ObjectGetOwnEntries)
    [I `::Array.prototype.reduce`] (perform, target);

const operators = mapEntries
({
    // Allow get?
    prototype: (target, key, { value }) => (console.log("HERE!!!", target, value),I `Object.setPrototypeOf` (target, value))
}, (([key, value]) => [Symbol(`Δ.${key}`), value]));

const ObjectUpdatePropertyDescriptor = (target, key, descriptor) => given((
    existing = I `Object.getOwnPropertyDescriptor` (target, key)) =>
    I `Object.defineProperty` (
        target,
        key,
        existing && I `Object.hasOwn` (descriptor, "value") ?
            ({ ...existing, value: descriptor.value }) :
            descriptor));
    

const perform = (target, [key, descriptor]) =>(console.log("WILL DO ", target, key, descriptor),
    ((operators[key] || ObjectUpdatePropertyDescriptor)(target, key, descriptor), target));

module.exports = I `Object.assign` (
    Δ,
    mapEntries(operators,
        ([key, value]) =>
            [key.description [I `::String.prototype.replace`] (/^Δ\./, ""), key]));
/*
const property = Declaration `property` (({ name, tail }) => given((
    [first, ...rest] = tail,
    firstSource = IsFunction(first) ? { [ƒSymbols.called]: first } : first,
    body = ø(firstSource, ...rest),
    ƒCalled = body[ƒSymbols.called],
    kind = GetFunctionKind(ƒCalled),
    ƒGenerator = GetƒGeneratorForFunctionKind(kind)) => Declaration `property`
    
    
    α(ƒGenerator(ReifiedCallEvaluateBody),
    {
        name,
        toString()
        {
            return this[ƒSymbols["[[SourceText]]"]];
        },
        [ƒSymbols["[[ThisMode]]"]]: GetApproximateThisMode(ƒCalled),
        [ƒSymbols["[[SourceText]]"]]: ToSourceText(ƒCalled)
    }, body)));*/

/*

const applicable = ƒ.tagged((name, implementation, ...properties) => given((
    symbol = Symbol.for(`@refieid/${name}`)) =>
    ƒ `${name}` (implementation,
    {
        symbol,
        [Symbol.toPrimitive]: () => symbol,
        ...ø(...properties)
    })));



const given = f => f();

const fail = require("@reified/fail");
const I = require("@reified/intrinsics");

// Would be nice if there was an easy way to make unemurable properties...
// Or maybe just have some "known" symbols like "unenumerable-name"?
const α = (target, ...sources) => given((
    descriptors = sources
        .filter(source => !!source)
        .map(source => I.Object.getOwnPropertyDescriptors(source))) =>
    descriptors.length <= 0 ?
        target :
        I.Object.defineProperties(
            target,
            I.Object.assign(...descriptors)));

exports.α = α;
exports.alpha = α;

const ø = (...sources) => α(I.Object.create(null), ...sources);

exports.ø = ø;
exports.alpha = ø;

const construct =
    (C, ...sources) => α(I.Object.create(C.prototype), ...sources);

exports.construct = construct;

exports.kindsof = value =>
    value === null ? ["null"] :
    I.Array.isArray(value) ? ["array", "object"] :
    typeof value === "function" ? ["function", "object"] :
    [typeof value];

// FIXME: Use I.
const GetOwnKeys = Reflect.ownKeys;

exports.GetOwnKeys = GetOwnKeys;

const GetOwnEntries = object => GetOwnKeys(object).map(key => [key, object[key]]);

exports.GetOwnEntries = GetOwnEntries;
*/