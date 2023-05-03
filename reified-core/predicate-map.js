const given = f => f();

const
{
    I,
    Call,
    IsFunctionObject,
    IsArray
} = require("@reified/ecma-262");

const Declaration = require("./declaration");
const { ƒnamed } = require("./function-objects");
const fail = require("./fail");


const Map = class Map { };
const map = f => I `Object.create` (Map.prototype, { map: { value: f } });

const NoFallback = map(query =>
    fail(I.RangeError, `Could not find match for ${query} in predicate map`));


// FIXME!!! No fallback.
module.exports = Declaration `PredicateMap` (({ name, tail: [body] }) => given((
    unparsed = IsFunctionObject(body) ? body(map) : body,
    fallbacks = Call (I `Array.prototype.filter`, unparsed, V => !IsArray(V)),
    fallback = [() => true, fallbacks.length > 0 ? fallbacks[0] : NoFallback],
    cases = I `Array.from` (Call(
        I `Array.prototype.concat`,
            Call (I `Array.prototype.filter`, unparsed, IsArray),
            [fallback]),
        ([K, V]) => [K, V instanceof Map ? V.map : () => V])) =>
    ƒnamed(name, function (query)
    {
        return Call(
            I `Array.prototype.find`,
            cases,
            ([predicate]) => predicate(query))[1](query);
    })));
