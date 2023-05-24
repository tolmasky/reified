const given = f => f();

const
{
    I,
    IsArray,
    IsFunctionObject,
    IsSymbol,
    GetOwnPropertyDescriptorEntries,
    GetOwnValues,
    OrdinaryObjectCreate,
    OrdinaryFunctionCreate
} = require("@reified/ecma-262");

const
{
    IsTaggedCall,
    ToResolvedString
} = require("@reified/core/function-objects");

const SymbolBijection = require("./symbol-bijection");


const S = I `Object.fromEntries` (["Call", "Prototype"]
    [I `::Array.prototype.map`] (name => [name, Symbol(name)]));

const fromTag = tag =>
    tag === "..." ? Symbol("...") :
    false;

const ø = (...sources) => sources
    [I `::Array.prototype.reduce`] ((O, source) =>
        I `Object.assign` (
            O,
            IsArray(source) ? I `Object.fromEntries` (source) : source),
        I `Object.create` (null));

exports.ø = ø;

const PropertyPlanSymbols = SymbolBijection(plan =>
    `@reified/core/object/property-plan: ${I `JSON.stringify` (plan)}`);

const DefaultPartialPropertyPlan =
{
    configurable: false,
    enumerable: true,
    writable: false,
    recursive: false,
};

const P = (key, plan) =>
    PropertyPlanSymbols.toSymbol(ø(ToPartialPropertyPlan(key), plan));

const IsPropertyPlanKey = key =>
    IsSymbol(key) && PropertyPlanSymbols.hasSymbol(key);

const ToPartialPropertyPlan = key =>
    IsPropertyPlanKey(key) ?
    PropertyPlanSymbols.forSymbol(key) :
    ø(DefaultPartialPropertyPlan, { key });

const GetOwnPropertyPlans = O => ø(
    GetOwnPropertyDescriptorEntries(O)
        [I `::Array.prototype.map`]
            (([key, { value }]) =>
                ({ ...ToPartialPropertyPlan(key), value }))
        [I `::Array.prototype.map`]
            (plan => [plan.key, plan]));


exports.P = I `Object.assign` (P,
{
    Call: P(S.Call, { enumerable: false }),
    Prototype: P(S.Prototype, { enumerable: false })
});


const Call = function Call(F, thisArg, args)
{
    return F[S.Call](F, thisArg, args);
}

const Ø = I `Object.assign` ((...args) => IsTaggedCall(args) ?
    fromTag(ToResolvedString(args)) : given((
    {
        [S.Prototype]: PrototypePropertyPlan,
        ...plans
    } = GetOwnPropertyPlans(args[0]),
    { [S.Call]: CallPropertyPlan } = plans,
    Prototype =
        PrototypePropertyPlan ? PrototypePropertyPlan.value :
        CallPropertyPlan ? I `Function.prototype` :
        I `Object.prototype`,
    O = CallPropertyPlan ?
        OrdinaryFunctionCreate(Prototype, false, false, Call) :
        OrdinaryObjectCreate(Prototype)) =>
    GetOwnValues(plans, "every")
        [I `::Array.prototype.reduce`]
            ((O, { key, recursive, value, ...rest }) => given((
                resolved = recursive ? value(O) : value,
                descriptor = { ...rest, value: resolved },
                _ = console.log("FOR " + String(key) + " ", descriptor)) =>
                    // IsSymbol(key) && key.description === "..." ?
                    //    I `Object.defineProperties` (O, { ...descriptor) :
                I `Object.defineProperty` (O, key, descriptor)), O)), S);

exports.Ø = Ø;


/*

const toPropertyKey = pKey =>
    IsPropertyProfileKey(pKey) ?
        PropertyProfileSymbols.forSymbol(eKey).key :
        pKey;


const HasOwnEntryForPropertyKey = (O, key) => GetOwnPropertyKeys(O, key)
    [`::Array.prototype.find`] (eKey => toPropertyKey(eKey) === key)


*/