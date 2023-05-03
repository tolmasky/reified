const given = f => f();

const
{
    I,
    Call,
    IsArray,
    IsNumber,
    IsSymbol,
    IsString
} = require("@reified/ecma-262");
const { type, caseof } = require("@reified/core/type");

const IsUpdatePatternKey = value =>
    IsNumber(value) || IsSymbol(value) || IsString(value);

const UpdatePattern = type `UpdatePattern`
([
    caseof `End` ({ length: 0 }),

    caseof `UpdatePattern` ((...argumentsList) =>
        argumentsList.length === 0 ?
            UpdatePattern.End : given((
            [lhs, ...rest] = argumentsList,
            rhs = UpdatePattern(...rest)) =>
            IsArray(lhs) ?
                UpdatePattern.Indexes(lhs, rhs) :
            IsUpdatePatternKey(lhs) ?
                UpdatePattern.Property(lhs, rhs) :
            rest.length === 0 ?
                lhs :
            caseof(lhs,
            {
                [UpdatePattern.End]: () => rhs,
                [UpdatePattern.Property]: ({ key, tail }) =>
                    UpdatePattern(key, UpdatePattern(tail, rhs)),
                [UpdatePattern.Indexes]: ({ indexes }) =>
                    UpdatePattern(indexes, UpdatePattern(tail, rhs)) 
            }))),

    caseof `Property` ((key, tail = UpdatePattern.End) =>
        ({ key, tail, length: tail.length + 1 })),

    caseof `Indexes` ((indexes, tail = UpdatedPattern.End) =>
        ({ indexes, tail, length: tail.length + 1 }))
],
{
    parse: string => string
        .split(".")
        .reverse()
        .reduce((tail, key) => KeyPath(key, tail), KeyPath.End),

    prototype:
    {
        hasOwn(target)
        {
            return  this === KeyPath.End ||
                    I `Object.hasOwn` (target, this.key) &&
                    this.tail.hasOwn(target);
        },

        reduce (f, start)
        {
            return this === KeyPath.End ?
                start :
                this.tail.reduce(f, f(start, this.key));
        },

        toString()
        {
            return Call(
                I `Array.prototype.join`,
                I `Array.from` (
                    this.toArray(),
                    item => IsArray(item) ?
                        `[${item[0]},${item[1]}]` :
                        String(item)),
                ".");
        },

        toArray()
        {
            return caseof(this,
            {
                [UpdatePattern.End]: () => [],
                [UpdatePattern.Property]: ({ key, tail }) => [key, ...tail.toArray()],
                [UpdatePattern.Indexes]: ({ indexes, tail }) => [indexes, ...tail.toArray()]
            });
        },

        toKeyID()
        {
            return JSON.stringify(this.toArray());
        }
    }
});

module.exports = UpdatePattern;
