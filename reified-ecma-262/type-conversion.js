// 7.1 Type Conversion
// https://tc39.es/ecma262/#sec-type-conversion

// 7.1.7 ToUint32 ( argument )
// https://tc39.es/ecma262/#sec-touint32
const ToUint32 = string => string >>> 0;

exports.ToUint32 = ToUint32;

// 7.1.17 ToString ( argument )
// https://tc39.es/ecma262/#sec-tostring
const ToString = value => value + "";

exports.ToString = ToString;
