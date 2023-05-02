const given = f => f();

const I = require("@reified/intrinsics");
const { IsFunctionObject } = require("@reified/core/types-and-values");
const { Enum, caseof, apply } = require("@reified/core/enum");
const CopyValue = require("./copy-value");
const { max } = Math;


const omitting = (target, key) => given((
    copy = CopyValue(target)) => (delete copy[key], copy));

const Mutation = Enum `Mutation()` (caseof =>
[
    caseof `Set` ((key, value) =>
    ({
        [apply]: ({ key, value }, _, [target]) =>
            target[key] === value ?
                target :
                I `Object.assign` (CopyValue(target), { [key]: value }),
        key,
        value
    })),

    caseof `Delete` (key =>
    ({
        [apply]: ({ key }, _, [target]) =>
            I `Object.hasOwn` (target, key) ?
                 omitting(target, key) :
                 target,
        key
    })),

    caseof `Spread` (value =>
    ({
        [apply]: ({ value }, _, [target]) =>
            I `Object.assign` (CopyValue(target), value),
        value
    })),

    // FIXME: We need a better name for this since it isn't a strict splice...
    caseof `Splice` ((key, remove, value) =>
    ({
        [apply]: ({ key, remove, value }, _, [target]) =>
            remove === 0 && value.length === 0 ? target : given((
            forAssignment = I `Object.assign`(
                I `Array.from` (target), { length: max(key, target.length) }),
            result = forAssignment.splice(key, remove, ...value)) =>
                I `Object.assign` (
                    CopyValue(target),
                    forAssignment,
                    { length: forAssignment.length })),
        key,
        remove,
        value
    })),

    caseof `Replace` (value => ({ [apply]: ({ value }) => value, value }))
]);

module.exports = Mutation;
