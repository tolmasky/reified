import { ArrayMap } from "./bootstrap.mjs";


const Object = globalThis.Object;


// 20.1.2.1 Object.assign ( target, ...sources )
// https://tc39.es/ecma262/#sec-object.assign

const ObjectAssign = Object.assign;

export { ObjectAssign as "Object.assign" };


// 20.1.2.2 Object.create ( O, Properties )
// https://tc39.es/ecma262/#sec-object.create

const ObjectCreate = Object.create;

export { ObjectCreate as "Object.create" };


// 20.1.2.3.1 ObjectDefineProperties ( O, Properties )
// https://tc39.es/ecma262/#sec-objectdefineproperties

const ObjectDefineProperties = Object.defineProperties;

export { ObjectDefineProperties as "Object.defineProperties" };


// 20.1.2.4 Object.defineProperty ( O, P, Attributes )
// https://tc39.es/ecma262/#sec-object.defineproperty

const ObjectDefineProperty = Object.defineProperty;

export { ObjectDefineProperty as "Object.defineProperty" };


// 20.1.2.5 Object.entries ( O )
// https://tc39.es/ecma262/#sec-object.entries

const ObjectEntries = Object.entries;

export { ObjectEntries as "Object.entries" };


// 20.1.2.6 Object.freeze ( O )
// https://tc39.es/ecma262/#sec-object.freeze

const ObjectFreeze = Object.freeze;

export { ObjectFreeze as "Object.freeze" };

// 20.1.2.7 Object.fromEntries ( iterable )
// https://tc39.es/ecma262/#sec-object.fromentries

const ObjectFromEntries = Object.fromEntries;

export { ObjectFromEntries as "Object.fromEntries" };


// 20.1.2.8 Object.getOwnPropertyDescriptor ( O, P )
// https://tc39.es/ecma262/#sec-object.getownpropertydescriptor

const ObjectGetOwnPropertyDescriptor = Object.getOwnPropertyDescriptor;

export { ObjectGetOwnPropertyDescriptor as "Object.getOwnPropertyDescriptor" };


// 20.1.2.9 Object.getOwnPropertyDescriptors ( O )
// https://tc39.es/ecma262/#sec-object.getownpropertydescriptors

const ObjectGetOwnPropertyDescriptors = Object.getOwnPropertyDescriptors;

export { ObjectGetOwnPropertyDescriptors as "Object.getOwnPropertyDescriptors" };


// 20.1.2.10 Object.getOwnPropertyNames ( O )
// https://tc39.es/ecma262/#sec-object.getownpropertynames

const ObjectGetOwnPropertyNames = Object.getOwnPropertyNames;

export { ObjectGetOwnPropertyNames as "Object.getOwnPropertyNames" };


// 20.1.2.11 Object.getOwnPropertySymbols ( O )
// https://tc39.es/ecma262/#sec-object.getownpropertysymbols

const ObjectGetOwnPropertySymbols = Object.getOwnPropertySymbols;

export { ObjectGetOwnPropertySymbols as "Object.getOwnPropertySymbols" };


// 20.1.2.11.1 GetOwnPropertyKeys ( O, type )
// https://tc39.es/ecma262/#sec-getownpropertykeys
// But we also return BOTH names AND symbols when type is "STRING+SYMBOL".
export const GetOwnPropertyKeys = (O, type) =>
    type === "STRING" ? ObjectGetOwnPropertyNames(O) :
    type === "SYMBOL" ? ObjectGetOwnPropertySymbols(O) :
    type === "STRING+SYMBOL" ?
    [
        ...GetOwnPropertyKeys(O, "STRING"),
        ...GetOwnPropertyKeys(O, "SYMBOL")
    ] :
    fail("oh no...");

// Convenience method.
export const GetOwnPropertyDescriptorEntries = (O, type) =>
    ArrayMap(
        GetOwnPropertyKeys(O, type),
        K => [K, ObjectGetOwnPropertyDescriptor(O, K)]);


// 20.1.2.14 Object.hasOwn ( O, P )
// https://tc39.es/ecma262/#sec-object.hasown

const ObjectHasOwn = Object.hasOwn;

export { ObjectHasOwn as "Object.hasOwn" };