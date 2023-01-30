const I = { };

I.I = I;

I.Function = global.Function;
I["Function.prototype.toString"] = I.Function.prototype.toString;

I.Apply = (I.Function.prototype.call).bind(I.Function.prototype.apply);
I.Call = (I.Function.prototype.call).bind(I.Function.prototype.call);

const Apply = (I.Function.prototype.call).bind(I.Function.prototype.apply);
const Call = (I.Function.prototype.call).bind(I.Function.prototype.call);

I.Array = global.Array;
I["Array.from"] = I.Array.from;
I["Array.isArray"] = I.Array.isArray;
I["Array.prototype.concat"] = I.Array.prototype.concat;
I["Array.prototype.filter"] = I.Array.prototype.filter;
I["Array.prototype.forEach"] = I.Array.prototype.forEach;
I["Array.prototype.map"] = I.Array.prototype.map;
I["Array.prototype.push"] = I.Array.prototype.push;
I["Array.prototype.reduce"] = I.Array.prototype.reduce;
I["Array.prototype.slice"] = I.Array.prototype.slice;
I["Array.prototype.sort"] = I.Array.prototype.sort;

I.Error = global.Error;
I.AggregateError = global.AggregateError;
I.EvalError = global.EvalError;
I.RangeError = global.RangeError;
I.ReferenceError = global.ReferenceError;
I.SyntaxError = global.SyntaxError;
I.TypeError = global.TypeError;
I.URIError = global.URIError;

I.isNaN = global.isNaN;

I.Object = global.Object;
I["Object.assign"] = I.Object.assign || function assign(object)
{
    Call(
        I["Array.prototype.forEach"],
        arguments,
        (argument, index) =>
            index > 0 &&
            Call(
                I["Array.prototype.forEach"],
                I["Object.keys"](argument),
                key => object[key] = argument[key]));

    return object;
};
I["Object.create"] = I.Object.create;
I["Object.defineProperty"] = I.Object.defineProperty;
I["Object.entries"] = I.Object.entries || function entries(object)
{
    return Call(
        I["Array.prototype.map"],
        I["Object.keys"](object),
        key => [key, object[key]]);
};
I["Object.fromEntries"] = I.Object.fromEntries || function fromEntries(entries)
{
    const array = I["Array.isArray"](entries) ?
        entries :
        I["Array.from"](entries, entry => entry);

    return Call(
        I["Array.prototype.reduce"],
        array,        
        (object, [key, value]) => (object[key] = value, object),
        { });
};
I["Object.hasOwn"] = I.Object.hasOwn || function hasOwn(object, key)
{
    return Call(I["Object.hasOwnProperty"], object, key);
};
I["Object.hasOwnProperty"] = I.Object.hasOwnProperty;
I["Object.keys"] = I.Object.keys;

I["Object.getOwnPropertyDescriptor"] = I.Object.getOwnPropertyDescriptor;
I["Object.getPrototypeOf"] = I.Object.getPrototypeOf;

I["RegExp"] = global.RegExp;
I["RegExp.prototype.exec"] = I.RegExp.prototype.exec;

I["String"] = global.String;
I["String.prototype.charCodeAt"] = I.String.prototype.charCodeAt;
I["String.prototype.match"] = I.String.prototype.match;
I["String.prototype.indexOf"] = I.String.prototype.indexOf;
I["String.prototype.slice"] = I.String.prototype.slice;
I["String.prototype.split"] = I.String.prototype.split;
I["String.prototype.startsWith"] =
    I.String.prototype.startsWith ||
    function startsWith(prefix)
    {
        return Call(I["String.prototype.indexOf"], this, prefix) === 0;
    };
I["String.prototype.substr"] = I.String.prototype.substr;
I["String.prototype.substring"] = I.String.prototype.substring;

I["undefined"] = void(0);

I["JSON"] = JSON;
I["JSON.stringify"] = JSON.stringify;
I["JSON.parse"] = JSON.parse;

module.exports = I;
