export const given = f => f();

const ObjectDefineProperties = Object.defineProperties;
const ObjectGetOwnPropertyDescriptor = Object.getOwnPropertyDescriptor;

const FunctionPrototypeApply = Function.prototype.apply;
const FunctionPrototypeCall = Function.prototype.call;

export const ƒApply = FunctionPrototypeApply.bind(FunctionPrototypeApply);
export const ƒCall = FunctionPrototypeCall.bind(FunctionPrototypeCall);


// FIXME: Should we try to copy length?
// FIXME: Copy parameter names?
// FIXME: Should we copy *all* property descriptors? The only remaining one
// may be length, which it may not respect anyways?...
export const ƒCopy = F => ObjectDefineProperties(function (...args)
{
    return ƒCall(F, this, ...args);
}, { name: ObjectGetOwnPropertyDescriptor(F, "name") });
