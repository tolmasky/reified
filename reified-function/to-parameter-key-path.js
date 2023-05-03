const given = f => f();

const { I, Call } = require("@reified/intrinsics");

const { IsArray } = require("@reified/core/types-and-values");

const UpdatePattern = require("@reified/delta/update-pattern");
const update = require("@reified/delta/update");
const Mutation = require("@reified/delta/mutation");

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
const ToIndexedEntries = array => I `Array.from` (
    array,
    (node, index) => isRestElement(node) ?
        [[index, Infinity], node.argument] :
        [index, node]);

const toRestUpdateTemplates = (templates, fromArrayIndex) =>
    templates.length !== 1 ? templates : given((
        [[name, { pattern }]] = templates) =>
        pattern !== UpdatePattern.End ? templates :
        [[
            name,
            update(
                fromArrayIndex !== false ?
                    [fromArrayIndex, Infinity] :
                    [],
                Mutation.Set(null))
        ]]);

const toUpdateTemplates = (node, fromArrayIndex = false) =>
    !node ? [] :
    IsArray(node) ?
        node.flatMap(([key, value]) => I `Array.from` (
            toUpdateTemplates(value),
            ([name, template]) => [name, template.nest(key)])) :
    isFunction(node) ?
        toUpdateTemplates(ToIndexedEntries(node.params)) :
    isArrayPattern(node) ?
        toUpdateTemplates(ToIndexedEntries(node.elements)) :
    isObjectPattern(node) ?
        toUpdateTemplates(node
            .properties
            .filter(node => isIdentifier(node.key))
            .map(({ key, value }) => [key.name, value]))
            .concat(toUpdateTemplates(node
                .properties
                .filter(isRestElement)[0])) :
    isIdentifier(node) ?
         [[node.name, update(UpdatePattern.End, Mutation.Set(null))]] :
    isAssignmentPattern(node) ?
        toUpdateTemplates(node.left) :
    isRestElement(node) ?
        toRestUpdateTemplates(
            toUpdateTemplates(node.argument),
            fromArrayIndex) :
    [];

const toUpdateTemplate = (f, name) => given((
    fString = Call(I `Function.prototype.toString`, f),
    fExpression = parseExpression(`(${fString})`),
    templates = ø.fromEntries(toUpdateTemplates(fExpression))) =>
    templates[name]);

module.exports = toUpdateTemplate;
