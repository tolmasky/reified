const given = f => f();

const { I, ToUint32, IsArrayIndex, IsArray }  = require("@reified/ecma-262");

const Δ = require("@reified/delta");
const update = require("@reified/delta/update");
const UpdatePattern = require("@reified/delta/update-pattern");
const Mutation = require("@reified/delta/mutation");

const { toUpdateTemplate, GetRestArgumentIndex } = require("./to-parameter-key-path");


const toBindings = (target, primary, rest = false) => new I `Map` (

    I `Array.from` (I `Object.entries`(primary),
        ([key, value]) => IsArrayIndex(key) ?
            update(UpdatePattern(ToUint32(key)), Mutation.Set(value)) : given((
            //_ = console.log(target.toString(), key),
            { pattern, mutation } = toUpdateTemplate(target, key)) =>
            update(pattern, Δ(mutation, { value }))))

    [I `::Array.prototype.concat`](rest ?
        update(UpdatePattern([GetRestArgumentIndex(target), Infinity]), Mutation.Set(rest)) :
        [])

    [I `::Array.prototype.map`](update => [update.pattern.toKeyID(), update]));

module.exports = toBindings;
