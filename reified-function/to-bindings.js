const given = f => f();

const I = require("@reified/intrinsics");
const KeyPath = require("@reified/delta/key-path");
const { ToUint32 } = require("@reified/core/type-conversion");
const { IsArrayIndex } = require("@reified/core/array-exotic-objects");
const toUpdateTemplate = require("./to-parameter-key-path");
const Δ = require("@reified/delta");
const update = require("@reified/delta/update");


const toBindings = (target, shorthand) => new I `Map`(
    I `Array.from` (
        I `Object.entries`(shorthand),
        ([key, value]) => given((
            { pattern, mutation } = toUpdateTemplate(target, IsArrayIndex(key) ? ToUint32(key) : key)) =>
            (console.log(pattern),[pattern.toKeyID(), update(pattern, value/*Δ(mutation, { value })*/)]))));

module.exports = toBindings;
