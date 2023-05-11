const I = require("./intrinsics");
const { IsString, IsSymbol } = require("./types-and-values");


// 7.2.2 IsArray ( argument )
// https://tc39.es/ecma262/#sec-isarray
//
// Direct all from:
// 23.1.2.2 Array.isArray ( arg )
// https://tc39.es/ecma262/#sec-isarray

const IsArray = argument => I `Array.isArray` (argument);

exports.IsArray = IsArray;

// 7.2.6 IsIntegralNumber ( argument )
// https://tc39.es/ecma262/#sec-isintegralnumber
//
// Direct call from:
// 21.1.2.3 Number.isInteger ( number )
// https://tc39.es/ecma262/#sec-number.isinteger

const IsIntegralNumber = argument => I `Number.isInteger` (argument);

exports.IsIntegralNumber = IsIntegralNumber;

// 7.2.7 IsPropertyKey ( argument )
// https://tc39.es/ecma262/#sec-ispropertykey

const IsPropertyKey = argument => IsString(argument) || IsSymbol(argument);

exports.IsPropertyKey = IsPropertyKey;

