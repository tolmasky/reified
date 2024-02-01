// 22.1 String Objects
// https://tc39.es/ecma262/#sec-string-objects

// 22.1.1.1 String ( value )
// https://tc39.es/ecma262/#sec-string-constructor-string-value

export const String = globalThis.String;


// 22.1.2.3 String.prototype
// https://tc39.es/ecma262/#sec-string.prototype

const StringPrototype = String.prototype;


// 22.1.3.11 String.prototype.lastIndexOf ( searchString [ , position ] )
// https://tc39.es/ecma262/#sec-string.prototype.lastindexof

const StringPrototypeLastIndexOf = String.prototype.lastIndexOf;

export { StringPrototypeLastIndexOf as "String.prototype.lastIndexOf" };


// 22.1.3.25 String.prototype.substring ( start, end )
// https://tc39.es/ecma262/#sec-string.prototype.substring

const StringPrototypeSubstring = String.prototype.substring;

export { StringPrototypeSubstring as "String.prototype.substring" };
