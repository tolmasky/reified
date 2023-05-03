const given = f => f();

const { Call, I } = require("@reified/intrinsics");
const { caseof } = require("@reified/core/enum");
const { ƒnamed, ƒextending } = require("@reified/core/function-objects");

const UpdatePattern = require("./update-pattern");
const CopyValue = require("./copy-value");
const { max } = Math;
//const Mutation = require("./mutation");


const omitting = (target, key) => given((
    copy = CopyValue(target)) => (delete copy[key], copy));

const fromUpdate = (update, target) =>
    update instanceof Mutation ?
        update :
        Mutation.fromShorthand(update(target));

//const toDefaultIfAbsent = (target, key) => key in target ?

const apply = (target, pattern, update) => caseof(pattern,
{
    [UpdatePattern.End]: () => update(target),

    [UpdatePattern.Property]: ({ key, tail }) => given((
        current = target[key],
        _ = console.log(key),
        updated = apply(current, tail, update)) =>
            current === updated ?
                target :
                I `Object.assign` (CopyValue(target), { [key]: updated })),

    [UpdatePattern.Indexes]: ({ indexes, tail }) => given((
        [start, stop] = indexes,
        current = Call(I `Array.prototype.slice`, target, start, stop),
        updated = apply(current, tail, update)) =>
            //current === update ?
            // target :
            given((
            remove = stop - start,
            forAssignment = I `Object.assign` (
                I `Array.from` (target),
                { length: max(start, target.length) }),
            result = forAssignment.splice(start, remove, ...updated)) =>
                I `Object.assign` (
                    CopyValue(target),
                    forAssignment,
                    { length: forAssignment.length }))),

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
        apply(first, ...toNormalizedArguments(rest)); //.value;

module.exports = update;

const Update = ƒextending(Function, "Update", function (keyPath, mutation)
{
    return I `Object.setPrototypeOf` (ƒnamed("update",
        target => update(target, keyPath, mutation),
        {
            pattern,
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
