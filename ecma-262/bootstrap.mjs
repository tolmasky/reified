const given = f => f();

const Object = globalThis.Object;


const Apply = (Function.prototype.call).bind(Function.prototype.apply);
const Call = (Function.prototype.call).bind(Function.prototype.call);

const ArrayPrototypeMap = Array.prototype.map;

export const ArrayMap = (array, f) => Call(ArrayPrototypeMap, array, f);

const ArrayPrototypeFilter = Array.prototype.filter;

export const ArrayFilter = (array, f) => Call(ArrayPrototypeFilter, array, f);

const ArrayPrototypeFlatMap = Array.prototype.flatMap;

export const ArrayFlatMap = (array, f) => Call(ArrayPrototypeFlatMap, array, f);

// We aren't currently using this.
// const SetPrototypeHas = Set.prototype.has;

// export const SetHas = (set, value) => Call(SetPrototypeHas, set, value);

const StringPrototypeSubstr = String.prototype.substr;

// We aren't currently using this.
// export const StringSubstr = (...args) => Call(StringPrototypeSubstr, ...args);

// const StringPrototypeLastIndexOf = String.prototype.lastIndexOf;

export const StringLastIndexOf = (...args) => Call(StringPrototypeLastIndexOf, ...args);
