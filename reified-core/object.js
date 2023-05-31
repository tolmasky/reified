const given = f => f();

const
{
    I,
    IsArray,
    IsCallable,
    IsFunctionObject,
    IsString,
    IsSymbol,
    GetOwnPropertyDescriptorEntries,
    GetOwnValues,
    HasProperty,
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

const ToKeyedObjectElements = GetOwnPropertyPlans;

const ToParsedObjectElements = declaration =>
    GetOwnPropertyDescriptorEntries(declaration)
        [I `::Array.prototype.map`]
            (([key, { value }]) =>
                ({ ...ToPartialPropertyPlan(key).contents, value }));

/*
const ØFunctionCreate = given((
    ForwardCall = (F, thisArg, args) => F[Symbols.Call](F, thisArg, args)) =>
    functionPrototype =>
        OrdinaryFunctionCreate(functionPrototype, false, false, ForwardCall));


// Have to create function and copy... no need to deal with prototype?

const CreateObjectFromObjectElements_ = (unparsed, existingO) => given((
    {
        [Symbols.Prototype]: PrototypeElement,
        ...elements
    } = ToKeyedObjectElements(unparsed),
    Prototype = PrototypeElement ? PrototypeElement.value : null,
    hadCallProperty = !!existingO && HasProperty(existingO, Symbols.Call),
    hasCallProperty =
        hadCallProperty ||
        HasOwnProperty(elements, Symbols.Call) ||
        HasProperty(PrototypeElement.value, Symbols.Call),
    O = !existingO && hasCallProperty ? ØFunctionCreate(Prototype) :
        !existingO && !hasCallProperty ? OrdinaryObjectCreate(Prototype) :
        existingO && !hadCallProperty && hasCallProperty ? fromObjectElements(Ø.from(existingO)) :
        existingO) =>
    GetOwnValues(elements, "every")
        [I `::Array.prototype.reduce`]
            ((O, { key, value, ...rest }) =>
                IsSymbol(key) && key.description === "..." ?
                    CreateObjFromObjectElements(value.definition(O), O) :
                    I `Object.defineProperty` (O, key,
                    {
                        value: value instanceof RecursiveDefinition ?
                            value.definition(O) :
                            value,
                        configurable: toPropertyDesctiptorOption(key, "configurable", rest, O),
                        enumerable: toPropertyDesctiptorOption(key, "enumerable", rest, O),
                        writable: toPropertyDesctiptorOption(key, "writable", rest, O),
                    }), O));

// FIXME: We need them extracted in their original order (!!).
// We also need to be able to get them keyed...
// We *DO* need, [extracted, rest] = split(elements, keys)
const CreateObjectFromObjectElements = (elements, existingO) => given((
    {
        [Symbols.Prototype]: PrototypeElement,
        ...rest
    } = elements,
    Prototype = PrototypeElement ? PrototypeElement.value : null,
    hadCallProperty = !!existingO && HasProperty(existingO, Symbols.Call),
    hasCallProperty =
        hadCallProperty ||
        HasOwnProperty(rest, Symbols.Call) ||
        HasProperty(PrototypeElement.value, Symbols.Call),
    O = !existingO && hasCallProperty ? ØFunctionCreate(Prototype) :
        !existingO && !hasCallProperty ? OrdinaryObjectCreate(Prototype) :
        existingO && !hadCallProperty && hasCallProperty ? console.log("YIKES!") :
        existingO) =>
    GetOwnValues(rest, "every")
        [I `::Array.prototype.map`](x => (console.log("gonna do", x), x))
        [I `::Array.prototype.reduce`]
            ((O, { key, value, ...rest }) =>
                IsSymbol(key) && key.description === "..." ?
                    CreateObjectFromDeclaration(value.definition(O), O) :
                    I `Object.defineProperty` (O, key,
                    {
                        value: value instanceof RecursiveDefinition ?
                            value.definition(O) :
                            value,
                        configurable: toPropertyDesctiptorOption(key, "configurable", rest, O),
                        enumerable: toPropertyDesctiptorOption(key, "enumerable", rest, O),
                        writable: toPropertyDesctiptorOption(key, "writable", rest, O),
                    }), O));

*/
const ObjectAssignPropertyDescriptors = (toO, fromO) =>
    I `Object.defineProperties` (toO, I `Object.getOwnPropertyDescriptors` (fromO));

const CreateObjectFromObjectElements = given((
    IsPrototypeElement = ({ key }) => key === Symbols.Prototype,
    IsSpreadElement = ({ key }) => IsSymbol(key) && key.description === "...",
    ForwardCall = (F, thisArg, args) => F[Symbols.Call](F, thisArg, args),
    AccommodateCallability = O =>
        IsCallable(O) ? O :
        !HasProperty(O, Symbols.Call) ? O :
        ObjectAssignPropertyDescriptors(
            OrdinaryFunctionCreate(
                I `Object.getPrototypeOf` (O),
                false,
                false,
                ForwardCall), O)) =>
    (elements, existingO) => elements
        [I `::Array.prototype.reduce`]
            ((O, element) => AccommodateCallability(
                IsPrototypeElement(element) ? I `Object.setPrototypeOf` (O, element.value) :
                IsSpreadElement(element) ? CreateObjectFromDeclaration(element.value.definition(O), O) :
                given((
                    { key, value, ...rest } = element) =>
                I `Object.defineProperty` (O, element.key,
                {
                    value: value instanceof RecursiveDefinition ?
                        value.definition(O) :
                        value,
                    configurable: toPropertyDesctiptorOption(key, "configurable", rest, O),
                    enumerable: toPropertyDesctiptorOption(key, "enumerable", rest, O),
                    writable: toPropertyDesctiptorOption(key, "writable", rest, O),
                }))), existingO || I `Object.create` (null)));

const CreateObjectFromDeclaration = (declaration, existingO) =>
    CreateObjectFromObjectElements(ToParsedObjectElements(declaration), existingO);

const Ø = I `Object.assign` ((...args) =>
    IsTaggedCall(args) ? P(ToResolvedString(args)) :
    IsString(args[0]) ? P(args[0]) :
    IsSymbol(args[0]) ? P(args[0]) :
    IsFunctionObject(args[0]) ? new RecursiveDefinition(args[0]) :
    CreateObjectFromDeclaration(args[0]),
    { Symbols });

const GetOwnObjectElements = O => ø(
    GetOwnPropertyDescriptorEntries(O)
        [I `::Array.prototype.map`]
            (([key, descriptor]) => [key, { key, ...descriptor }])
        [I `::Array.prototype.concat`]
            ([[Symbols.Prototype, { value: I `Object.getPrototypeOf` (O) }]]));


exports.Ø = I `Object.assign` (Ø,
{
    // Do we want the Prototype from this?... YES
    // FIXME: Need ot make sure the property has the same properties, instead of just Ø()ing it
    from: O => ø(GetOwnPropertyDescriptorEntries(O)
        [I `::Array.prototype.map`]
            (([key, descriptor]) => [Ø(key), descriptor.value])
        [I `::Array.prototype.concat`]
            ([[Ø.Prototype, I `Object.getPrototypeOf` (O)]])),

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