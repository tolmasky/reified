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

const M = require("./cached");
const SymbolBijection = require("./symbol-bijection");


const S = I `Object.fromEntries` (["Call", "Prototype"]
    [I `::Array.prototype.map`] (name => [name, Symbol(name)]));

const fromTag = tag =>
    tag === "..." ? Symbol("...") :
    false;

const ø = (...sources) => sources
    [I `::Array.prototype.reduce`] ((O, source) =>
        !source ?
            O :
        IsArray(source) ?
            I `Object.assign` (O, I `Object.fromEntries` (source)) :
            I `Object.defineProperties`
                (O, I `Object.getOwnPropertyDescriptors` (source)),
        I `Object.create` (null));

exports.ø = ø;

const PropertyPlanSymbols = SymbolBijection(plan =>
    `@reified/core/object/property-plan: ${I `JSON.stringify` (plan)}`);

const DefaultPartialPropertyPlan =
{
    key: void(0),
    configurable: false,
    enumerable: true,
    writable: false,
    recursive: false,
};


const MapPartialPropertyPlanKeys = given((
    keys = I `Object.keys` (DefaultPartialPropertyPlan)) =>
        f => keys [I `::Array.prototype.map`] (f));

const PartialPropertyPlan = given((
    PartialPropertyPlan = function (contents)
    {
        return PartialPropertyPlanM(
            ...MapPartialPropertyPlanKeys(key => contents[key]));
    },
    PartialPropertyPlanM = M((...args) => given((
        contents = ø(MapPartialPropertyPlanKeys(
            (key, index) => [key, args[index]]))) =>
        I `Object.assign` (
            I `Object.create` (PartialPropertyPlan.prototype), { contents }))),
    mutate = (plan, key, value) =>
        PartialPropertyPlan({ ...plan.contents, [key]: value }),
    prototype = I `Object.defineProperties` (PartialPropertyPlan.prototype,
        ø(  ["configurable", "enumerable", "writable", "recursive"]
                [I `::Array.prototype.flatMap`] (key => [true, false]
                    [I `::Array.prototype.map`] (value =>
                    [
                        value ? key : `un${key}`,
                        {
                            enumerable: true,
                            get ()  { return mutate(this, key, value); }
                        }
                    ])),
            [[
                Symbol.toPrimitive,
                {
                    enumerable: true,
                    value() { return PropertyPlanSymbols.toSymbol(this); }
                }
            ]]))) => PartialPropertyPlan);

const P = (...args) => IsTaggedCall(args) ?
    P(ToResolvedString(args)) :
    PartialPropertyPlan({ ...DefaultPartialPropertyPlan, key: args[0] });

const IsPropertyPlanKey = key =>
    IsSymbol(key) && PropertyPlanSymbols.hasSymbol(key);

// FIXME: Always use property plans in order to maintain correct key order?
const ToPartialPropertyPlan = key =>
    IsPropertyPlanKey(key) ?
        PropertyPlanSymbols.forSymbol(key) :
        P(key);

const GetOwnPropertyPlans = O => ø(
    GetOwnPropertyDescriptorEntries(O)
        [I `::Array.prototype.map`]
            (([key, { value }]) =>
                ({ ...ToPartialPropertyPlan(key).contents, value }))
        [I `::Array.prototype.map`]
            (plan => [plan.key, plan]));

exports.GetOwnPropertyPlans = GetOwnPropertyPlans;

exports.P = I `Object.assign` (P,
{
    Call: P(S.Call).unenumerable,
    Prototype: P(S.Prototype).unenumerable,

    hasInstance: P(Symbol.hasInstance),
    iterator: P(Symbol.iterator)
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