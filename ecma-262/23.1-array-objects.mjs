// 23.1 Array Objects
// https://tc39.es/ecma262/#sec-array-objects


// 23.1.1.1 Array ( ...values )
// https://tc39.es/ecma262/#sec-array

export const Array = globalThis.Array;


// 23.1.2.1 Array.from ( items [ , mapfn [ , thisArg ] ] )
// https://tc39.es/ecma262/#sec-array.from

const ArrayFrom = Array.from;

export { ArrayFrom as "Array.from" };


// 23.1.2.2 Array.isArray ( arg )
// https://tc39.es/ecma262/#sec-array.isarray

const ArrayIsArray = Array.isArray;

export { ArrayIsArray as "Array.isArray" };


// 23.1.2.3 Array.of ( ...items )
// https://tc39.es/ecma262/#sec-array.of

const ArrayOf = Array.of;

export { ArrayOf as "Array.of" };


// 23.1.2.4 Array.prototype
// https://tc39.es/ecma262/#sec-array.prototype

const ArrayPrototype = Array.prototype;

export { ArrayPrototype as "Array.prototype" };


// 23.1.3.2 Array.prototype.concat ( ...items )
// https://tc39.es/ecma262/#sec-array.prototype.concat

const ArrayPrototypeConcat = Array.prototype.concat;

export { ArrayPrototypeConcat as "Array.prototype.concat" };


// 23.1.3.2.1 IsConcatSpreadable ( O )
/*
export const IsConcatSpreadable = O =>
    !IsObject(O) ? false :
1. If O is not an Object, return false.
2. Let spreadable be ? Get(O, @@isConcatSpreadable).
3. If spreadable is not undefined, return ToBoolean(spreadable).
4. Return ? IsArray(O).
*/


// 23.1.3.8 Array.prototype.filter ( callbackfn [ , thisArg ] )
// https://tc39.es/ecma262/#sec-array.prototype.filter

const ArrayPrototypeFilter = Array.prototype.filter;

export { ArrayPrototypeFilter as "Array.prototype.filter" };


// 23.1.3.14 Array.prototype.flatMap ( mapperFunction [ , thisArg ] )
// https://tc39.es/ecma262/#sec-array.prototype.flatmap

const ArrayPrototypeFlatMap = Array.prototype.flatMap;

export { ArrayPrototypeFlatMap as "Array.prototype.flatMap" };

// 23.1.3.18 Array.prototype.join ( separator )
// https://tc39.es/ecma262/#sec-array.prototype.join

const ArrayPrototypeJoin = Array.prototype.join;

export { ArrayPrototypeJoin as "Array.prototype.join" };


// 23.1.3.21 Array.prototype.map ( callbackfn [ , thisArg ] )
// https://tc39.es/ecma262/#sec-array.prototype.map

const ArrayPrototypeMap = Array.prototype.map;

export { ArrayPrototypeMap as "Array.prototype.map" };
