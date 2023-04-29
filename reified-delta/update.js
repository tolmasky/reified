const given = f => f();

const I = require("@reified/intrinsics");
const { caseof } = require("@reified/core/enum");
const { ƒnamed, ƒextending } = require("@reified/core/function-objects");

const KeyPath = require("./key-path");
const CopyValue = require("./copy-value");
const Mutation = require("./mutation");


const omitting = (target, key) => given((
    copy = CopyValue(target)) => (delete copy[key], copy));

const apply = (target, keyPath, update) => caseof(keyPath,
{
    [KeyPath.End]: () => caseof(Mutation.fromShorthand(target, update),
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
    }),

    [KeyPath.KeyPath]: ({ key, tail }) => given((
        current = target[key]) => caseof(apply(current, tail, update),
        {
            [Mutation.Delete]: () =>
                Mutation.Set(omitting(target, key)),

            [Mutation.Set]: ({ value: updated }) =>
                Mutation.Set(current === updated ?
                    target :
                    I `Object.assign` (CopyValue(target), { [key]: updated })),

            default: () => fail("oh no!")
        }))
});

const toNormalizedArguments = ([location, 𝑢]) =>
    [KeyPath(location), 𝑢];

const update = (first, ...rest) =>
    rest.length < 2 ?
        Update(...toNormalizedArguments([first, ...rest])) :
        apply(first, ...toNormalizedArguments(rest)).value;

module.exports = update;

const Update = ƒextending(Function, "Update", function (keyPath, mutation)
{
    return I `Object.setPrototypeOf` (ƒnamed("update",
        target => update(target, keyPath, mutation),
        {
            keyPath,
            mutation,
            effectiveKeyPath: caseof(mutation,
            {
                [Mutation.Splice]: ({ start }) => KeyPath(start, keyPath),
                default: () => keyPath
            })
        }), Update.prototype);
});

Update.prototype.nest = function (key)
{
    return Update(KeyPath(key, this.keyPath), this.mutation);
}

module.exports.Update = Update;
