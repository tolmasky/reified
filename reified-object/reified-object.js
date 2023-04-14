const given = f => f();

const fail = require("@reified/fail");
const I = require("@reified/intrinsics");


const o = () => { };

module.exports = o;
module.exports.o = o;

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

o.α = α;
o.alpha = α;

const ø = (...sources) => α(I.Object.create(null), ...sources);

o.ø = ø;

o.mapEntries= mapEntries = (O, f) =>
    I `Object.fromEntries` (
        I `Array.from` (I `Object.entries` (O), f));

ø.fromPropertyDescriptors = descriptors =>
    I `Object.defineProperties` (ø(), descriptors);

ø.mapEntries = mapEntries;

ø.fromEntries = entries => ø(I `Object.fromEntries` (entries));

o.alpha = ø;

const construct =
    (C, ...sources) => α(I.Object.create(C.prototype), ...sources);

o.construct = construct;

o.kindsof = value =>
    value === null ? ["null"] :
    I.Array.isArray(value) ? ["array", "object"] :
    typeof value === "function" ? ["function", "object"] :
    [typeof value];

o.typeof = value =>
    value === null ? "null" :
    typeof value;

// FIXME: Use I.
const GetOwnKeys = Reflect.ownKeys;

o.GetOwnKeys = GetOwnKeys;

const GetOwnEntries = object => GetOwnKeys(object).map(key => [key, object[key]]);

o.GetOwnEntries = GetOwnEntries;


