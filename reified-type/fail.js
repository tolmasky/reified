const given = f => f();

const { I } = require("@reified/ecma-262");
const { IsTaggedCall } = require("@reified/core/function-objects");


const ToResolvedMessaged = ([strings, ...values]) => strings
    [I `::Array.prototype.flatMap`]
        ((string, index) => [string, values[index]])
    [I `::Array.prototype.filter`] (string => !!string)
    [I `::Array.prototype.join`] ("");

const parse = args => IsTaggedCall(args) ?
    [ToResolvedMessaged(args)] :
    args;

const fail = I `Object.assign` (
    (first, ...rest) =>
    {
        throw   first instanceof I `Error` ?
                    first :
                typeof first === "function" &&
                first.prototype instanceof I `Error` ?
                    first(...rest) :
                typeof first === "object" ?
                    I `Object.assign` (I `Error` (), first) :
                rest.length > 1 ?
                    new (first)(...rest) :
                I `Error` (first);
    },
{
    syntax: (...args) => fail(I `SyntaxError`, ...parse(args)),
    type: (...args) => fail(I `TypeError`, ...parse(args))
});

module.exports = fail;


/*
const ToFilteredMessage = ([strings, ...values]) =>console.log("hello") ||
    mapAccum((lhsFiltered, string, index) => given((
        rhsFiltered = !values[index],
        trimmed =
            lhsFiltered && rhsFiltered ? string.trim() :
            lhsFiltered ? string.trimLeft() :
            rhsFiltered ? string.trimRight() :
            string) =>
            [
                rhsFiltered,
                [trimmed, values[index]]
            ]),
        false,
        strings)
        [1]
        [I `::Array.prototype.flat`] ()
        [I `::Array.prototype.filter`] (x => !!x) 
        [I `::Array.prototype.join`] ("");

function mapAccum(f, accumulated, list)
{
    const implementation = Array.isArray(list) ?
        mapAccumArray : mapAccumIterable;

    return implementation(f, accumulated, list);
}

function mapAccumIterable(f, accumulated, iterable)
{
    var index = 0;
    var result = [];

    for (const item of iterable)
        [accumulated, result[index]] =
            f(accumulated, item, index++);

    return [accumulated, [].concat(...result)];
}

function mapAccumArray(f, accumulated, list)
{
    const count = list.length;
    const result = [];

    if (count <= 0)
        return [accumulated, result];

    var index = 0;

    for (; index < count; ++index)
        [accumulated, result[index]] =
            f(accumulated, list[index], index);

    return [accumulated, [].concat(...result)];
}
*/