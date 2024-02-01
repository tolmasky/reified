// 23.1 Array Objects
// https://tc39.es/ecma262/#sec-array-objects


// 23.1.1.1 Array ( ...values )
// https://tc39.es/ecma262/#sec-array

export const Array = globalThis.Array;


// 23.1.2.2 Array.isArray ( arg )
// https://tc39.es/ecma262/#sec-array.isarray

const ArrayIsArray = Array.isArray;

export { ArrayIsArray as "Array.isArray" };


// 23.1.2.4 Array.prototype
// https://tc39.es/ecma262/#sec-array.prototype

const ArrayPrototype = Array.prototype;

export { ArrayPrototype as "Array.prototype" };


// 23.1.3.8 Array.prototype.filter ( callbackfn [ , thisArg ] )
// https://tc39.es/ecma262/#sec-array.prototype.filter

const ArrayPrototypeFilter = Array.prototype.filter;

export { ArrayPrototypeFilter as "Array.prototype.filter" };


// 23.1.3.21 Array.prototype.map ( callbackfn [ , thisArg ] )
// https://tc39.es/ecma262/#sec-array.prototype.map

const ArrayPrototypeMap = Array.prototype.map;

export { ArrayPrototypeMap as "Array.prototype.map" };
