const given = f => f();

const fail = require("@reified/core/fail");
const { I, IsArray, IsFunctionObject, IsString } = require("@reified/ecma-262");
const { ƒ, curry } = require("@reified/function");


const fromJSX = Symbol("@reified/jsx");

const mapJSX = target =>
    target === false ? false :
    IsString(target) ? target :
    IsArray(target) ? target
        [I `::Array.prototype.map`] (mapJSX)
        [I `::Array.prototype.flat`] (Infinity)
        [I `::Array.prototype.filter`] (x => !!x) :
    IsFunctionObject(target) ? mapJSX(target({})) :
    target;
//    fail.type(`Unexpected ${typeof target} when mapping JSX.`);

const reduceJSX = (target, start) =>
    target === false ? start :
    IsArray(target) ? target
        [I `::Array.prototype.reduce`]
            ((current, item) => reduceJSX(target, current), start) :
    IsFunctionObject(target) ? target(start) :
    fail.type(`Unexpected ${typeof target} when reducing JSX.`);


module.exports = ƒ `JSX` ((target, shorthand, rest) => given((
    redirected = fromJSX in target ? target[fromJSX] : target) =>
        curry(redirected, shorthand, rest)),
{
    fromJSX: ƒ `fromJSX` ((target, ...rest) => rest.length === 0 ?
        mapJSX(target) :
        reduceJSX(target, ...rest),
    {
        [Symbol.toPrimitive]: () => fromJSX
    })
});



