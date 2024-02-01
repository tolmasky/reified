// 6 ECMAScript Data Types and Values
// https://tc39.es/ecma262/#sec-ecmascript-data-types-and-values


// 6.1.1 The Undefined Type
// https://tc39.es/ecma262/#sec-ecmascript-language-types-undefined-type
export const IsUndefined = value => value === void(0);

// 6.1.2 The Null Type
// https://tc39.es/ecma262/#sec-ecmascript-language-types-null-type
export const IsNull = value => value === null;

// 6.1.3 The Boolean Type
// https://tc39.es/ecma262/#sec-ecmascript-language-types-boolean-type
export const IsBoolean = value => typeof value === "boolean";

// 6.1.4 The String Type
// https://tc39.es/ecma262/#sec-ecmascript-language-types-string-type
export const IsString = value => typeof value === "string";

// 6.1.5 The Symbol Type
// https://tc39.es/ecma262/#sec-ecmascript-language-types-symbol-type
export const IsSymbol = value => typeof value === "symbol";

// 6.1.6 Numeric Types
// https://tc39.es/ecma262/#sec-numeric-types
export const IsNumeric = value =>
    IsNumber(value) ||
    IsBigInt(value);

// 6.1.6.1 The Number Type
// https://tc39.es/ecma262/#sec-ecmascript-language-types-number-type
export const IsNumber = value => typeof value === "number";

// 6.1.6.2 The BigInt Type
// https://tc39.es/ecma262/#sec-ecmascript-language-types-bigint-type
export const IsBigInt = value => typeof value === "bigint";

export const IsPrimitive = value => !IsObject(value);

// 6.1.7 The Object Type
// https://tc39.es/ecma262/#sec-object-type
export const IsObject = value =>
    IsPlainObject(value) ||
    IsFunctionObject(value);

export const IsPlainObject = value => !IsNull(value) && typeof value === "object";

// FIXME: Do we need this given that we can IsCallable?
export const IsFunctionObject = value => typeof value === "function";

const ObjectGetPrototypeOf = Object.getPrototypeOf;

export const IsPrototypelessObject = value =>
    IsPlainObject(value) &&
    IsNull(ObjectGetPrototypeOf(value));
