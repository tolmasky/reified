const given = f => f();

const
{
    I,
    IsArray,
    IsFunctionObject,
    IsString,
    IsSymbol,
    GetOwnPropertyDescriptorEntries,
    GetOwnValues,
    HasOwnProperty,
    OrdinaryObjectCreate,
    OrdinaryFunctionCreate
} = require("@reified/ecma-262");

const
{
    IsTaggedCall,
    ToResolvedString
} = require("./function-objects");

const SymbolEnum = require("./symbol-enum");

const M = require("./cached");
const SymbolBijection = require("./symbol-bijection");

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

const Symbols = SymbolEnum("Call", "Prototype");

const PropertyPlanSymbols = SymbolBijection(plan =>
    `@reified/core/object/property-plan: ${I `JSON.stringify` (plan)}`);

const Default = Symbol("Default");

const DefaultPartialPropertyPlan =
{
    key: void(0),
    configurable: false,
    enumerable: true,
    writable: false
};

const toPropertyDesctiptorOption = (key, option, setting, existing) =>
    setting[option] !== Default ?
        setting[option] :
    HasOwnProperty(existing, key) ?
        I `Object.getOwnPropertyDescriptor` (existing, key) [option] :
        DefaultPartialPropertyPlan[option];

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
    PartialPropertyPlan
    ({
        configurable: Default,
        enumerable: Default,
        writable: Default,
        key: args[0]
    });

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

function RecursiveDefinition(definition)
{
    I `Object.defineProperty` (this, "definition", { value: definition });

    this[P(Symbol("..."))] = this;
}

RecursiveDefinition.prototype[Symbol("...")];

const Ø = I `Object.assign` ((...args) =>
    IsTaggedCall(args) ? P(ToResolvedString(args)) :
    IsString(args[0]) ? P(args[0]) :
    IsSymbol(args[0]) ? P(args[0]) :
    IsFunctionObject(args[0]) ? new RecursiveDefinition(args[0]) : given((
    {
        [Symbols.Prototype]: PrototypePropertyPlan,
        ...plans
    } = GetOwnPropertyPlans(args[0]),
    { [Symbols.Call]: CallPropertyPlan } = plans,
    Prototype =
        PrototypePropertyPlan ? PrototypePropertyPlan.value :
        CallPropertyPlan ? I `Function.prototype` :
        I `Object.prototype`,
    O = CallPropertyPlan ?
        OrdinaryFunctionCreate(Prototype, false, false, CallPropertyPlan.value) :
        OrdinaryObjectCreate(Prototype),
    DefineElements = (O, elements) => GetOwnValues(elements, "every")
        [I `::Array.prototype.reduce`]
            ((O, { key, value, ...rest }) =>
                IsSymbol(key) && key.description === "..." ?
                    DefineElements(O, GetOwnPropertyPlans(value.definition(O))) :
                    I `Object.defineProperty` (O, key,
                    {
                        value: value instanceof RecursiveDefinition ?
                            value.definition(O) :
                            value,
                        configurable: toPropertyDesctiptorOption(key, "configurable", rest, O),
                        enumerable: toPropertyDesctiptorOption(key, "enumerable", rest, O),
                        writable: toPropertyDesctiptorOption(key, "writable", rest, O),
                    }), O)) => DefineElements(O, plans)),
    { Symbols });



exports.Ø = I `Object.assign` (Ø,
{
    from: O => ø(GetOwnPropertyDescriptorEntries(O)
        [I `::Array.prototype.map`]
            (([key, descriptor]) => [Ø(key), descriptor.value])),

    Call: P(Symbols.Call).unenumerable,
    Prototype: P(Symbols.Prototype)
});


/*

const toPropertyKey = pKey =>
    IsPropertyProfileKey(pKey) ?
        PropertyProfileSymbols.forSymbol(eKey).key :
        pKey;


const HasOwnEntryForPropertyKey = (O, key) => GetOwnPropertyKeys(O, key)
    [`::Array.prototype.find`] (eKey => toPropertyKey(eKey) === key)


*/