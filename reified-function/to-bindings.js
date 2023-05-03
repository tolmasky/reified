const given = f => f();

const { I, ToUint32, IsArrayIndex }  = require("@reified/ecma-262");

const Δ = require("@reified/delta");
const update = require("@reified/delta/update");

const toUpdateTemplate = require("./to-parameter-key-path");


const toBindings = (target, shorthand) => new I `Map`(
    I `Array.from` (
        I `Object.entries`(shorthand),
        ([key, value]) => given((
            { pattern, mutation } = toUpdateTemplate(target, IsArrayIndex(key) ? ToUint32(key) : key)) =>
            [pattern.toKeyID(), update(pattern, Δ(mutation, { value }))])));

module.exports = toBindings;
