const given = f => f();

const fail = require("@reified/fail");
const I = require("@reified/intrinsics");
const Declaration = require("./declaration");
const { ƒnamed, ƒextending, IsFunctionObject } = require("./function-objects");
const ESymbols = require("./symbol-enum")("apply");

const { ø, α } = require("@reified/object");


const Constant = (Enum, name, properties) => given((
    constructor = ƒextending(Enum, name, function ()
    {
        return fail.type(
            `${name} is a constant constructor and should not be invoked. `+
            `Treat it like a value instead.`);
    })) => α(
        I `Object.setPrototypeOf`(constructor, constructor.prototype),
        properties));


const GetConstructorOf = value => I `Object.getPrototypeOf` (value).constructor;
const EnumNameRegExp = /([^\(]+)(\(\))?$/;

const instantiate = C => given((
    { name, isCallable } = GetConstructorDefinitionOf(C)) => isCallable ?
        I `Object.setPrototypeOf` (ƒnamed(
            name,
            function f(...args) { return f[ESymbols["apply"]](f, this, args); }),
            C.prototype) :
        I `Object.create` (C.prototype));

const Enum = Declaration `Enum` (declaration => given((
    { name: unparsed, tail: [fCaseOfs, ...rest] } = declaration,
    [, name, isCallable] =
        I.Call(I `String.prototype.match`, unparsed, EnumNameRegExp),
    Enum = ƒnamed(name, function (...argumentsList)
    {
        const constructor = definition.constructors[name];

        if (!constructor)
            return fail.type (
                `${name} cannot be directly instantiated, ` +
                `use one if it's constructors.`);

        return constructor(...argumentsList);
    }),
    constructors = I `Array.from` (
        fCaseOfs(Declaration `Case[${name}]`
            (({ name, tail: [constructor] }) =>
                IsFunctionObject(constructor) ?
                    ƒextending(Enum, name, function C(...argumentsList)
                    {
                        const constructed = constructor(...argumentsList);

                        return constructed instanceof Enum ?
                            constructed :
                            α(instantiate(C), constructed);
                    }) :
                Constant(Enum, name, constructor))),
        constructor => α(constructor instanceof Declaration.Tail ?
            Constant(Enum, constructor.binding) :
            constructor,
        { [Symbol.toPrimitive]()
        {
            return GetConstructorDefinitionOf(this).symbol;
        }})),
    Cdefinitions = I `Array.from` (
        constructors,
        C => ConstructorDefinition(C, { isCallable: !!isCallable, symbol: Symbol(C.name) })),
    definition = TypeDefinition(Enum,
    {
        isCallable: !!isCallable,
        constructors: ø.fromEntries(I `Array.from` (constructors, C => [C.name, C]))
    }),
    { prototype, ...properties } = ø(...rest)) => I `Object.assign` (Enum,
    {
        prototype: α(Enum.prototype, prototype),

        [Symbol.toPrimitive]()
        {
            return GetConstructorDefinitionOf(this).symbol;
        },

        ...definition.constructors,
        ...properties
    })));

const Definition = Declaration `Definition` (({ name, tail }) => given((
    instances = new WeakMap()) =>
[
    ƒnamed(name, function Definition(target, ...rest)
    {
        if (!(this instanceof Definition))
            return new Definition(target, ...rest);

        instances.set(target, this);

        return I `Object.assign` (this, { name: target.name }, ...rest);
    }),
    ƒnamed(`Get${name}Of`, instance => instances.get(instance))
]));

const [TypeDefinition, GetTypeDefinitionOf] = Definition `TypeDefinition` ();
const [ConstructorDefinition, GetConstructorDefinitionOf] = Definition `ConstructorDefinition` ();


/*

const ConstructorDefinitions = new WeakMap();
const GetConstructorDefinitionOf = C => ConstructorDefinitions.get(C);

const GetTypeOf = C => TypesForConstructors.get(C);


const WeakMapSet = (WM, key, value) => (WM.set(key, value), value);

const TypeDefinitions = new WeakMap();
const GetTypeDefinitionOf = T => TypeDefinitions.get(T);

const TypesForConstructors = new Map();

function TypeDefinition(...args)
{
    if (!(this instanceof TypeDefinition))
        return new TypeDefinition(...args);

    const [T, name, constructorsList] = args;
    const constructors = ø.fromEntries(
        I `Array.from` (constructorsList, C =>
            [C.name, (WeakMapSet(TypesForConstructors, C, T), C)]));

    return WeakMapSet(T, I `Object.assign` (this, { name, constructors }));
}

function ConstructorDefinition(name)
{
    if (!(this instanceof ConstructorDefinition))
        return new ConstructorDefinition({ name });

    return WeakMapSet(ConstructorDefinitions, C, I `Object.assign` (this, { name, symbol: Symbol(name) }));
}



/*

const GetConstructor = O => I `Object.getPrototypeOf` (O) .constructor;
const GetTypeOf = O => TypesForConstructors[GetConstructor(O)] || fail(`${O} is not an enum`);
*/



const caseof = (value, cases) => given((
    { default: fallback } = cases,
    C = GetConstructorOf(value),
    definition = GetConstructorDefinitionOf(C),
    match = cases[definition.symbol] ||
            cases[definition.name] ||
            cases.default) =>
        !match ?
            fail.type (`No match for ${definition.name} found in caseof statement`) :
            match(value));

module.exports = I `Object.assign` (Enum, { Enum, caseof, ...ESymbols });

