const given = f => f();

const I = require("@reified/intrinsics");
const { caseof } = require("@reified/core/enum");
const { ƒnamed, ƒextending } = require("@reified/core/function-objects");

const KeyPath = require("./key-path");
const CopyValue = require("./copy-value");
const Mutation = require("./mutation");


const omitting = (target, key) => given((
    copy = CopyValue(target)) => (delete copy[key], copy));

const fromUpdate = (update, target) =>
    update instanceof Mutation ?
        update :
        Mutation.fromShorthand(update(target));

//const toDefaultIfAbsent = (target, key) => key in target ?

const apply = (target, keyPath, update) => caseof(keyPath,
{
    [KeyPath.End]: () => update(target),

    [KeyPath.KeyPath]: ({ key, tail }) => given((
        current = target[key],
        updated = apply(current, tail, update)) =>
            current === updated ?
                target :
                I `Object.assign` (CopyValue(target), { [key]: updated }))
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
