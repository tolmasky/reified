export const IsUndefined = value => value === void(0);

export const IsNull = value => value === null;

export const IsBoolean = value => typeof value === "boolean";

export const IsString = value => typeof value === "string";

export const IsSymbol = value => typeof value === "symbol";

export const IsNumeric = value => IsNumber(value) || IsBigInt(value);

export const IsNumber = value => typeof value === "number";

export const IsBigInt = value => typeof value === "bigint";

export const IsPrimitive = value => !IsObject(value);

export const IsObject = value => IsPlainObject(value) || IsFunctionObject(value);

export const IsPlainObject = value => !IsNull(value) && typeof value === "object";

export const IsFunctionObject = value => typeof value === "function";

export const IsPrototypelessObject = value =>
    IsPlainObject(value) &&
    IsNull(I `Object.getPrototypeOf` (value));
