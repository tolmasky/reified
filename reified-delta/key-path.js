const I = require("@reified/intrinsics");
const CopyValue = require("./copy-value");


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
}

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

    return current === updated ?
        target :
        I `Object.assign` (CopyValue(target), { [this.key]: updated });
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

KeyPath.End = Object.create(KeyPath.prototype);
