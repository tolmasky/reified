const given = f => f();

const I = require("@reified/intrinsics");

const { IsArray } = require("@reified/core/types-and-values");
const KeyPath = require("@reified/delta/key-path");

const { ø } = require("@reified/object");

const
{
    isArrayPattern,
    isAssignmentPattern,
    isIdentifier,
    isObjectPattern,
    isObjectProperty,
    isRestElement,
    isFunction
} = require("@babel/types");
const { parseExpression } = require("@babel/parser");

const FunctionPrototypeToString = Function.prototype.toString;
/*
const ObjectAssign = Object.assign;
const ObjectGetOwnPropertyNames = Object.getOwnPropertyNames;
const ObjectFromEntries = Object.fromEntries;
const ObjectHasOwn = Object.hasOwn;

const ObjectMerge = (...args) => ObjectAssign({ }, ...args);
const ObjectDefinePropertyValue =
    (object, key, value) => Object.defineProperty(object, key, { value });

const fNamed = (name, f) => ObjectDefinePropertyValue(f, "name", name);

const isPrimitive = value =>
    value === null || typeof value !== "object" && typeof value !== "function";

const fCached = f => given((
    cache = new WeakMap(),
    set = (arguments, value) => (cache.set(arguments[0], value), value),
    getset = (arguments, deferred) => cache.has(arguments[0]) ?
        cache.get(arguments[0]) :
        set(arguments, deferred(...arguments))) =>
        fNamed(`${f.name}-cached`, (...arguments) => isPrimitive(arguments[0]) ?
            f(arguments) :
            getset(arguments, f)));


const fParse = f => given((
    fString = FunctionPrototypeToString.call(f),
    fExpression = parseExpression(`(${fString})`),
    { params } = fExpression,
    lastParameter = params.length > 0 && params[params.length - 1],
    restParameter = lastParameter && isRestElement(lastParameter) && lastParameter) =>
({
    stringified: fString,
    toBoundArguments: f.toBoundArguments || toKeyPathMappings(fExpression),
    length: restParameter ? params.length - 1 : params.length
}));*/

// Object.entries will turn the index into a string.
const ToIndexedEntries = array =>
    I `Array.from` (array, (value, index) => [index, value]);

const toParameterKeyPaths = node =>
    !node ? [] :
    IsArray(node) ?
        node.flatMap(([key, value]) =>
            toParameterKeyPaths(value)
                .map(([name, keyPath]) => [name, KeyPath(key, keyPath)])) :
    isFunction(node) ?
        toParameterKeyPaths(ToIndexedEntries(node.params)) :
    isArrayPattern(node) ?
        toParameterKeyPaths(ToIndexedEntries(node.elements)) :
    isObjectPattern(node) ?
        toParameterKeyPaths(node
            .properties
            .filter(node => isIdentifier(node.key))
            .map(({ key, value }) => [key.name, value])) :
    isIdentifier(node) ? [[node.name, KeyPath.End]] :
    isAssignmentPattern(node) ?
        toParameterKeyPaths(node.left) :
    isRestElement(node) ?
        toParameterKeyPaths(node.argument) :
    [];

const toParameterKeyPath = (f, name) => given((
    fString = FunctionPrototypeToString.call(f),
    fExpression = parseExpression(`(${fString})`),
    parameterMappings = ø.fromEntries(toParameterKeyPaths(fExpression))) =>
    parameterMappings[name]);

module.exports = toParameterKeyPath;
