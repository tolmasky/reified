// 20.2 Function Objects
// https://tc39.es/ecma262/#sec-function-objects

// 20.2.1.1 Function ( ...parameterArgs, bodyArg )
// https://tc39.es/ecma262/#sec-function-p1-p2-pn-body

export const Function = globalThis.Function;


// 20.2.3.1 Function.prototype.apply ( thisArg, argArray )
// https://tc39.es/ecma262/#sec-function.prototype.apply

const FunctionPrototypeApply = Function.prototype.apply;

export { FunctionPrototypeApply as "Function.prototype.apply" };


// 20.2.3.2 Function.prototype.bind ( thisArg, ...args )
// https://tc39.es/ecma262/#sec-function.prototype.bind

const FunctionPrototypeBind = Function.prototype.bind;

export { FunctionPrototypeBind as "Function.prototype.bind" };


// 20.2.3.3 Function.prototype.call ( thisArg, ...args )
// https://tc39.es/ecma262/#sec-function.prototype.call

const FunctionPrototypeCall = Function.prototype.call;

export { FunctionPrototypeCall as "Function.prototype.call" };
