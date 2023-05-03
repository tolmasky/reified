const given = f => f();

const I = require("./intrinsics");


const IsUndefined = value => value === void(0);

exports.IsUndefined = IsUndefined;

const IsNull = value => value === null;

exports.IsNull = IsNull;

const IsBoolean = value => typeof value === "boolean";

exports.IsBoolean = IsBoolean;

const IsString = value => typeof value === "string";

exports.IsString = IsString;

const IsSymbol = value => typeof value === "symbol";

exports.IsSymbol = IsSymbol;

const IsNumeric = value => IsNumber(value) || IsBigInt(value);

exports.IsNumeric = IsNumeric;

const IsNumber = value => typeof value === "number";

exports.IsNumber = IsNumber;

const IsBigInt = value => typeof value === "bigint";

exports.IsBigInt = IsBigInt;

const IsPrimitive = value => !IsObject(value);

exports.IsPrimitive = IsPrimitive;

const IsObject = value => IsPlainObject(value) || IsFunctionObject(value);

exports.IsObject = IsObject;

const IsPlainObject = value => !IsNull(value) && typeof value === "object";

exports.IsPlainObject = IsPlainObject;

const IsFunctionObject = value => typeof value === "function";

exports.IsFunctionObject = IsFunctionObject;

const IsPrototypelessObject = value =>
    IsPlainObject(value) &&
    IsNull(I `Object.getPrototypeOf` (value));

exports.IsPrototypelessObject = IsPrototypelessObject;

const IsArray = I `Array.isArray`;

exports.IsArray = IsArray;
