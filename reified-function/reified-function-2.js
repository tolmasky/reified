const given = f => f();

const fail = require("@reified/fail");
//const ƒ = require("@reified/function");
const I = require("@reified/intrinsics");
const { α } = require("@reified/object");

I["Array.prototype.join"] = I.Array.prototype.join;
I["Object.setPrototypeOf"] = Object.setPrototypeOf;
I["String.prototype.toLowerCase"] = String.prototype.toLowerCase;

const Call = Symbol("Call");
const Construct = Symbol("Construct");
const Populate = Symbol("Populate");
const Extends = Symbol("Extends"); 

const isObject = value =>
    value !== null &&
    typeof value === "object";

// Should we set Function[Construct] to this?
const ƒConstruct = (f, args) => given((
    constructed = given((
    prototype = Object.getPrototypeOf(f),
    construct = prototype[Construct]) =>
    construct && I.Call(construct, f, ...args) ||
    given((populate = prototype[Populate]) =>
        populate && α(f, populate(...args))) ||
        f)) =>
            isObject(constructed) ? constructed :  f);
    
const isTaggedCall = args =>
    I["Array.isArray"](args) &&
    I["Array.isArray"](args[0]) &&
    I["Object.hasOwn"] (args[0], "raw");

const toResolvedString = (strings, ...values) => 
    I.on `Array.prototype.join` (
        I.on `Array.prototype.concat` ([],
            ...I["Array.from"]
                (strings, (string, index) => [string, values[index]])),
        "");

const ƒnamed = (named, name, f) => named ?
    I["Object.defineProperty"](f, "name", { value: name }) :
    f;

const ƒ = function ƒ (...args)
{
    // FIXME, should we make ƒƒ inherit from ƒ?
    if (isTaggedCall(args))
        return function ƒƒ (...rest)
        {
            return ƒ ({ name: toResolvedString(args) }, ...rest);
        };

    const merged = α({ }, ...args);
    const named = I.Object.hasOwn(merged, "name");
    const { name } = merged;
    
    const prototype = merged;

    delete merged["name"];

    const F = ƒnamed(named, name, function (...args)
    {
        if (!(this instanceof F))
            return new F(...args);

        const prototype = I["Object.getPrototypeOf"](this);
        const named = "name" in this;
        const Fname = named && prototype.constructor.name;
        const Iname = typeof Fname === "string" ?
            I.on `String.prototype.toLowerCase` (Fname) :
            Fname;

        const f = ƒnamed(named, Iname, function (...args)
        {
            return I.Call(f[Call], this, ...args);
        });

        return ƒConstruct(I["Object.setPrototypeOf"](f, prototype), args);
    });

    α(F.prototype, prototype);
    
    I["Object.setPrototypeOf"](F.prototype, (prototype[Extends] || Function).prototype);

    return F;
}

const Mutation = ƒ `Mutation`
({
    [Call]() { console.log("hello"); }
});

Mutation()