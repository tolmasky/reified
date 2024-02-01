// 7.1 Type Conversion
// https://tc39.es/ecma262/#sec-type-conversion


// 7.1.7 ToUint32 ( argument )
// https://tc39.es/ecma262/#sec-touint32
export const ToUint32 = string => string >>> 0;


// 7.1.17 ToString ( argument )
// https://tc39.es/ecma262/#sec-tostring
export const ToString = value => value + "";


// 7.1.18 ToObject ( argument )
// https://tc39.es/ecma262/#sec-toobject

export const ToObject = value => Object(value);
