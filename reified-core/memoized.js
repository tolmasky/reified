const given = f => f();

const { I } = require("@reified/ecma-262");


const Cache = () => given((
    start = new Map(),
    ValueKey = Symbol("value"),
    set = (map, key, fValue, value = fValue()) => (map.set(key, value), value),
    getset =  (map, key, fValue) =>
        map.has(key) ? map.get(key) : set(map, key, fValue),
    cache = (map, args, index, miss) => 
        index === args.length ?
            getset(map, ValueKey, miss) :
            cache(
                getset(map, args[index], () => new Map()),
                args, index + 1, miss)) =>
        (args, miss) => cache(start, args, 0, miss));
      
const caches = Cache();

// FIXME: FUNCTION COPYING
const memoized = f => given((
    cache = Cache()) =>
        (...args) => cache(args, () => f(...args)));

module.exports = I `Object.assign` (memoized, { M: memoized });
