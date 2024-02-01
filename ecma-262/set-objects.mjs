// 24.2 Set Objects
// https://tc39.es/ecma262/#sec-set-objects


// 24.2.1.1 Set ( [ iterable ] )
// https://tc39.es/ecma262/#sec-set-iterable

export const Set = globalThis.Set;


// 24.2.3.7 Set.prototype.has
// https://tc39.es/ecma262/#sec-set.prototype.has

const SetPrototypeHas = Set.prototype.has;

export { SetPrototypeHas as "Set.prototype.has" };
