const given = f => f();

const I = require("@reified/intrinsics");
const { IsArray, IsFunctionObject } = require("@reified/core/types-and-values");
const { Enum, caseof } = require("@reified/core/enum");
const { ƒnamed, ƒextending } = require("@reified/core/function-objects");

const KeyPath = require("./key-path");
const CopyValue = require("./copy-value");

const Mutation = Enum `Mutation` (caseof =>
[
    caseof `Mutation` (value =>
        value instanceof Mutation ?
            value :
            Mutation.Set(value)),

    caseof `Set` (value => ({ value })),
    caseof `Delete`,
    caseof `Spread` (value => ({ value })),
    caseof `Splice` ((start, count, value) => ({ start, count, value }))
]);

const apply = function (target, keyPath, 𝑢)
{
    if (keyPath === KeyPath.End)
    {
        const mutation =
            𝑢 instanceof Mutation ? 𝑢 :
            IsFunctionObject(𝑢) ? Mutation(𝑢(target)) :
            Mutation.Set(𝑢);

        return caseof(mutation,
        {
            [Mutation.Splice]: ({ start, count, value }) => given((
                forAssignment = I `Object.assign`(
                    I `Array.from` (target), { length: start }),
                result = forAssignment.splice(start, count, ...value)) =>
                Mutation.Set(
                    I `Object.assign` (CopyValue(target), forAssignment))),

            [Mutation.Spread]: ({ value }) =>
                Mutation.Set(I `Object.assign` (CopyValue(target), value)),

            default: mutation => mutation
        });
    }

    const { key, tail } = keyPath;
    const current = target[key];

    return caseof(apply(current, tail, 𝑢),
    {
        [Mutation.Delete]: () =>
        {
            const updated = CopyValue(target);

            delete updated[key];

            return Mutation.Set(updated);
        },

        [Mutation.Set]: ({ value: updated }) =>
            Mutation.Set(current === updated ?
                target :
                I `Object.assign` (CopyValue(target), { [key]: updated })),

        default: () => fail("oh no!")
    });
};

/*
const apply = (target, keyPath, 𝑢) => keyPath.caseof
({
    [KeyPath.End]: () => 𝑢(target),
    [KeyPath.KeyPath]: ({ key, tail }) => given((
        current = target[key],
        updated = apply(target, tail, current)) =>
            current === updated ?
                target :
                I `Object.assign` (CopyValue(target), { [key]: updated }))
});*/


const toNormalizedArguments = ([location, 𝑢]) =>
    [KeyPath(location), 𝑢];

const update = (first, ...rest) =>
    rest.length < 2 ?
        TargetedUpdate(...toNormalizedArguments([first, ...rest])) :
        apply(first, ...toNormalizedArguments(rest)).value;

module.exports = update;

module.exports.Mutation = Mutation;

const TargetedUpdate = ƒextending(Function, "TargetedUpdate", function (keyPath, mutation)
{
    const effectiveKeyPath = mutation instanceof Mutation.Splice ? KeyPath(mutation.start, keyPath) : keyPath;
    return I `Object.setPrototypeOf` (
        ƒnamed(
            "update",
            target => update(target, keyPath, mutation),
            { effectiveKeyPath, keyPath, mutation }),
        TargetedUpdate.prototype);
});

TargetedUpdate.prototype.nest = function (key)
{
    return TargetedUpdate(KeyPath(key, this.keyPath), this.mutation);
}

module.exports.TargetedUpdate = TargetedUpdate;
