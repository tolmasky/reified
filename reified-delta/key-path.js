const given = f => f();

const I = require("@reified/intrinsics");
const { α } = require("@reified/object");
const { IsPlainObject, IsArray } = require("@reified/core/types-and-values");
const CopyValue = require("./copy-value");
const Enum = require("@reified/core/enum");

const KeyPath = Enum `KeyPath` (caseof =>
[
    caseof `End` ({ length: 0 }),

    caseof `KeyPath` ((keylike, ...rest) =>
        keylike instanceof KeyPath ? keylike : given((
            tail =
                rest.length === 0 ? KeyPath.End :
                rest[0] instanceof KeyPath ? rest[0] :
                KeyPath(...rest)) =>
        ({
            key: keylike,
            tail,
            length: tail.length + 1
        })))
],
{
    parse: string => string
        .split(".")
        .reverse()
        .reduce((tail, key) => KeyPath(key, tail), KeyPath.End),

    prototype:
    {
        get(value)
        {
            return this === KeyPath.End ?
                value :
                this.tail.get(value[this.key]);
        },

        set(target, value)
        {
            if (this === KeyPath.End)
                return value;

            const current = target[this.key];
            const updated = this.tail.set(current, value);

            return current === updated ?
                target :
                I `Object.assign` (CopyValue(target), { [this.key]: updated });
        },

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
            return this.toArray().join(".");
        },

        toArray()
        {
            return this === KeyPath.End ?
                [] :
                [this.key, ...this.tail.toArray()];
        },

        toKeyID()
        {
            return JSON.stringify(this.toArray());
        }
    }
});

module.exports = KeyPath;
/*




function KeyPath(keylike, ...rest)
{
    if (keylike instanceof KeyPath)
        return keylike;

    if (!(this instanceof KeyPath))
        return new KeyPath(keylike, ...rest);

    this.key = keylike;
    this.tail =
        rest.length === 0 ?
            KeyPath.End :
        rest[0] instanceof KeyPath ?
            rest[0] :
            KeyPath(...rest);
    this.length = this.tail.length + 1;
}

function RestKeyPath(keylike)
{
    if (keylike instanceof KeyPath)
        return new RestKeyPath(keylike.key, keylike.tail);

    if (keylike instanceof RestKeyPath)
        return keylike;

    if (!(this instanceof RestKeyPath))
        return new RestKeyPath(keylike);

    this.key = keylike;
    this.tail = KeyPath.End;
    this.length = 1;
}

Object.setPrototypeOf(RestKeyPath.prototype, KeyPath.prototype);

module.exports = KeyPath;

KeyPath.prototype.get = function (value)
{
    return this === KeyPath.End ? value : this.tail.get(value[this.key]);
}

KeyPath.prototype.set = function (target, value)
{
    if (this === KeyPath.End)
        return value;

    const current = target[this.key];
    const updated = this.tail.set(current, value);

    if (this instanceof RestKeyPath)
    {
        // FIXME: Check if its an array index key.
        if (IsArray(target))
            return I.Call(
                I `Array.prototype.concat`,
                I.Call(I `Array.prototype.slice`, target, 0, this.key),
                value);

        return I `Object.assign` (CopyValue(target), value);
    }

    return current === updated ?
        target :
        I `Object.assign` (CopyValue(target), { [this.key]: updated });
}

KeyPath.prototype.update = function (target, f)
{
    return update(f, this, target);
}

KeyPath.prototype.hasOwn = function (target)
{
    return  this === KeyPath.End ||
            I `Object.hasOwn` (target, this.key) &&
            this.tail.hasOwn(target);
}

KeyPath.prototype.reduce = function (f, start)
{
    return this === KeyPath.End ?
        start :
        this.tail.reduce(f, f(start, this.key));
}

KeyPath.parse = string => string
    .split(".")
    .reverse()
    .reduce((tail, key) => KeyPath(key, tail), KeyPath.End);

KeyPath.prototype.toString = function ()
{
    return this.toArray().join(".");
}

KeyPath.prototype.toArray = function ()
{
    return this === KeyPath.End ?
        [] :
        [this.key, ...this.tail.toArray()];
}

KeyPath.prototype.toKeyID = function ()
{
    return JSON.stringify(this.toArray());
}

KeyPath.KeyPath = KeyPath;

KeyPath.End = α(I `Object.create` (KeyPath.prototype), { length: 0 });

KeyPath.RestKeyPath = α(I `Object.create` (KeyPath.prototype), { tail: KeyPath.End, length: 1 });

function update(f, keyPath, target)
{
    if (keyPath === KeyPath.End)
        return f(target);

    const { key, tail } = keyPath;
    const current = target[key];
    const updated = update(f, tail, current);

    return current === updated ?
        target :
        I `Object.assign` (CopyValue(target), { [key]: updated });
}

const Enum = function ()
{
}

function Mutation() { };*/


