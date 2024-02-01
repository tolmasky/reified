// 24.2.1 The Set Constructor
// https://tc39.es/ecma262/#sec-set-constructor

export const Set = globalThis.Set;

// 24.2.3.7 Set.prototype.has
// https://tc39.es/ecma262/#sec-set.prototype.has

const SetPrototypeHas = Set.prototype.has;

export { SetPrototypeHas as "Set.prototype.has" };
