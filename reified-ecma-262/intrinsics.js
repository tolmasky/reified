const given = f => f();

const I = given((
    called = false,
    toBind = null,
    Bind = global.Symbol && Symbol("Bind")) => (
    ([key]) => (
        !called && I["Object.defineProperty"](
            I["Object.prototype"],
            Bind,
            { get () { return I.Call(I["Function.prototype.bind"], toBind, this); } }),
        called = true,
        I.Call(I["String.prototype.startsWith"], key, "::") ?
            ((toBind = I[key.substr(2)]), Bind) :
        I.Call(I["String.prototype.startsWith"], key, ".") ?
            (...args) => I.Call(I[key.substr(1)], ...args) :
        I[key])));

I.I = I;

I.Function = global.Function;

I["Function.prototype.bind"] = I.Function.prototype.bind;
I["Function.prototype.toString"] = I.Function.prototype.toString;

I["Object.getOwnPropertySymbols"] = Object.getOwnPropertySymbols;
I["Object.values"] = Object.values;

I.Apply = (I.Function.prototype.call).bind(I.Function.prototype.apply);
I.Call = (I.Function.prototype.call).bind(I.Function.prototype.call);

const Apply = (I.Function.prototype.call).bind(I.Function.prototype.apply);
const Call = (I.Function.prototype.call).bind(I.Function.prototype.call);

// This is a stopgap for now, but should we keep it?
// From:
// I.on = ƒ.tagged ((identifier, ...args) => I.Call(I[identifier], ...args));
I.on = ([identifier]) => (...args) => Call(I[identifier], ...args);

I.Array = global.Array;
I["Array.from"] = I.Array.from;
I["Array.isArray"] = I.Array.isArray;
I["Array.prototype.concat"] = I.Array.prototype.concat;
I["Array.prototype.every"] = I.Array.prototype.every;
I["Array.prototype.filter"] = I.Array.prototype.filter;
I["Array.prototype.find"] = I.Array.prototype.find;
I["Array.prototype.findIndex"] = I.Array.prototype.findIndex;
I["Array.prototype.flat"] = I.Array.prototype.flat;
I["Array.prototype.flatMap"] = I.Array.prototype.flatMap;
I["Array.prototype.forEach"] = I.Array.prototype.forEach;

I["Array.prototype.group"] = I.Array.prototype.group || function (f, ...rest)
{
    const hasThisArg = rest.length > 1;
    const thisArg = hasThisArg && rest[0];
    const fCall = hasThisArg ? (...args) => Call(f, thisArg, ...args) : f;

    return this
        [I `::Array.prototype.map`]
            ((element, ...rest) => [fCall(element, ...rest), element])
        [I `::Array.prototype.reduce`] (
            (groups, [key, element]) => (
                I `Object.hasOwn` (groups, key) ?
                    groups[key] [I `::Array.prototype.push`] (element) :
                    groups[key] = [element],
                groups),
            I `Object.create` (null));
}

I["Array.prototype.join"] = I.Array.prototype.join;
I["Array.prototype.map"] = I.Array.prototype.map;
I["Array.prototype.push"] = I.Array.prototype.push;
I["Array.prototype.reduce"] = I.Array.prototype.reduce;
I["Array.prototype.slice"] = I.Array.prototype.slice;
I["Array.prototype.sort"] = I.Array.prototype.sort;

I["Map"] = global.Map;
I["Map.prototype"] = I.Map.prototype;
I["Map.prototype.entries"] = I.Map.prototype.entries;
I["Map.prototype.get"] = I.Map.prototype.get;
I["Map.prototype.set"] = I.Map.prototype.set;

I.Number = global.Number;
I["Number.isInteger"] = I.Number.isInteger;

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
I["Object.defineProperties"] = I.Object.defineProperties;

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
I["Object.getOwnPropertyDescriptors"] = I.Object.getOwnPropertyDescriptors;
I["Object.getOwnPropertyNames"] = I.Object.getOwnPropertyNames;
I["Object.getOwnPropertySymbols"] = I.Object.getOwnPropertySymbols;

I["Object.getPrototypeOf"] = I.Object.getPrototypeOf;
I["Object.setPrototypeOf"] = I.Object.setPrototypeOf;
I["Object.values"] = I.Object.values;

I["Object.prototype"] = I.Object.prototype;

I["RegExp"] = global.RegExp;
I["RegExp.prototype.exec"] = I.RegExp.prototype.exec;
I["RegExp.prototype.test"] = I.RegExp.prototype.test;

I["String"] = global.String;
I["String.prototype.charAt"] = I.String.prototype.charAt;
I["String.prototype.charCodeAt"] = I.String.prototype.charCodeAt;
I["String.prototype.indexOf"] = I.String.prototype.indexOf;
I["String.prototype.match"] = I.String.prototype.match;
I["String.prototype.replace"] = I.String.prototype.replace;
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
I["String.prototype.toLowerCase"] = I.String.prototype.toLowerCase;
I["String.prototype.toUpperCase"] = I.String.prototype.toUpperCase;

I["undefined"] = void(0);

I["WeakMap"] = global.WeakMap;
I["WeakMap.prototype.get"] = I.WeakMap.prototype.get;
I["WeakMap.prototype.set"] = I.WeakMap.prototype.set;
I["WeakMap.prototype.has"] = I.WeakMap.prototype.has;

I["JSON"] = JSON;
I["JSON.stringify"] = JSON.stringify;
I["JSON.parse"] = JSON.parse;

const EvaluatedExpression = string => Function("return (" + string + ")")();
const EvaluatedExpressionOr = function (string, fallback)
{
    try { return EvaluatedExpression(string) }
    catch (e) { return fallback; }
};

const Chain = (target, ...operations) =>
    I `.Array.prototype.reduce` (
        I `Array.from` (
            operations, operation => I `Object.entries`(operation)[0]),
        (target, [key, f]) =>
            I([`.Array.prototype.${key}`]) (target, f),
        target);

I["@reified/array-chain"] = Chain;

const FunctionSubclasses =  I `Object.fromEntries` (Chain
([
    "async function * () { }",
    "async function () { }",
    "function * () { }",
],
    { map: string => EvaluatedExpressionOr(string, false) },
    { filter: F => !!F },
    { map: F => I `Object.getPrototypeOf` (F).constructor },
    { map: C => [C.name, C] }));

module.exports = I `Object.assign` (I, FunctionSubclasses);
