const given = f => f();

const { Call, I } = require("@reified/intrinsics");
const { caseof } = require("@reified/core/type");
const { ƒnamed, ƒextending } = require("@reified/core/function-objects");
const UpdatePattern = require("./update-pattern");
const CopyValue = require("./copy-value");
const { max } = Math;
const Mutation = require("./mutation");


const omitting = (target, key) => given((
    copy = CopyValue(target)) => (delete copy[key], copy));

const toMutation = value =>
    value instanceof Mutation ?
        value :
        Mutation.Set(value);

//const toDefaultIfAbsent = (target, key) => key in target ?

const apply = (target, pattern, update) => caseof(pattern,
{
    [UpdatePattern.End]: () => toMutation(update(target)),

    [UpdatePattern.Property]: ({ key, tail }) => given((
        current = target[key],
        mutation = apply(current, tail, update)) => caseof(mutation,
        {
            [Mutation.Set]: ({ value: updated }) => Mutation.Set(
                current === updated ?
                    target :
                    I `Object.assign` (CopyValue(target), { [key]: updated }))
        })),

    [UpdatePattern.Indexes]: ({ indexes, tail }) => given((
        [start, stop] = indexes,
        current = Call(I `Array.prototype.slice`, target, start, stop),
        mutation = apply(current, tail, update)) => caseof(mutation,
        {
            [Mutation.Set]: ({ value: updated }) => given((
            //current === update ?
            // target :
            remove = stop - start,
            forAssignment = I `Object.assign` (
                I `Array.from` (target),
                { length: max(start, target.length) }),
            result = forAssignment.splice(start, remove, ...updated)) =>
                Mutation.Set(I `Object.assign` (
                    CopyValue(target),
                    forAssignment,
                    { length: forAssignment.length })))
        })),

    /*

    [KeyPath.KeyPath]: ({ key, tail }) => given((
        current = target[key],
        updated = apply(current, tail, update)) =>
            current === updated ?
                target :
                I `Object.assign` (CopyValue(target), { [key]: updated }))*/
});

const toNormalizedArguments = ([location, 𝑢]) =>
    [UpdatePattern(location), 𝑢];

const update = (first, ...rest) =>
    rest.length < 2 ?
        Update(...toNormalizedArguments([first, ...rest])) :
        apply(first, ...toNormalizedArguments(rest)).value;

module.exports = update;

const Update = ƒextending(Function, "Update", function (pattern, mutation)
{
    return I `Object.setPrototypeOf` (ƒnamed("update",
        target => update(target, pattern, mutation),
        {
            pattern: UpdatePattern(pattern),
            mutation
        }), Update.prototype);
});

Update.prototype.nest = function (shorthand)
{
    return Update(UpdatePattern(shorthand, this.pattern), this.mutation);
}

module.exports.Update = Update;
