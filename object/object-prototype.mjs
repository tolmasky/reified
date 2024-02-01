import
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
    OrdinaryFunctionCreate
} = require("@reified/ecma-262");

import { I } from "@reified/host/intrinsics.mjs";

import { ø } from "./null-prototype.mjs";

const given = f => f();


const M = require("./memoized");

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

const SymbolBijection = require("./symbol-bijection");

// These have to come afterexporting ø so they can see it.
const
{
    IsTaggedCall,
    ToResolvedString
} = require("./function-objects");

const SymbolEnum = require("./symbol-enum");

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

function RecursiveDefinition(definition)
{
    I `Object.defineProperty` (this, "definition", { value: definition });

    this[P(Symbol("..."))] = this;
}

RecursiveDefinition.prototype[Symbol("...")];

const ToParsedObjectElements = declaration =>
    GetOwnPropertyDescriptorEntries(declaration)
        [I `::Array.prototype.map`]
            (([key, { value }]) =>
                ({ ...ToPartialPropertyPlan(key).contents, value }));

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
                IsPrototypeElement(element) ?
                    I `Object.setPrototypeOf` (O, element.value) :
                IsSpreadElement(element) ?
                    CreateObjectFromDeclaration(element.value.definition(O), O) :
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
    // FIXME: Need ot make sure the property has the same properties, instead of just Ø()ing it
    from: O => ø(GetOwnPropertyDescriptorEntries(O)
        [I `::Array.prototype.map`]
            (([key, descriptor]) => [Ø(key), descriptor.value])
        [I `::Array.prototype.concat`]
            ([[Ø.Prototype, I `Object.getPrototypeOf` (O)]])),

    enumerables: O => ø(GetOwnPropertyDescriptorEntries(O)
        [I `::Array.prototype.filter`]
            (([key, descriptor]) => descriptor.enumerable)
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