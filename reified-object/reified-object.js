const given = f => f();

const fail = require("@reified/fail");
const I = require("@reified/intrinsics");

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

exports.construct;
