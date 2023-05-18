const given = f => f();

const
{
    I,
    IsUndefined,
    IsNull,
    IsBoolean,
    IsString,
    IsSymbol,
    IsNumber,
    IsBigInt,
    IsObject,
    IsFunctionObject,
    IsConstructor,
    HasOwnProperty,
} = require("@reified/ecma-262");

const { fail, SymbolEnum, ø, Ø } = require("@reified/core");

const { IsTaggedCall, ToResolvedString } =
    require("@reified/core/function-objects");

const mismatch = (T, value, reference) => fail.type (
    `Type mismatch${reference ? ` in ${reference}` : ""}:\n` +
    `    Expected: ${toTypeDescription(T)}\n` +
    `    Found: ${value}`);

const toTypeDescription = T =>
    // FIXME: We'll want something like [[Description]] here, for Dependent
    // types.
    T instanceof type ? `instance of type ${T.name}` :
    IsConstructor(T) ? `instance of class ${T.name}` :
    "blah";

const IsTypeOrConstructor = T => T instanceof type || IsConstructor(T);

const IsAnnotation = args => IsTaggedCall(args);

const annotate = args => given((
    annotation = ToResolvedString(args)) =>
        annotation === "=" ? value => value :
        annotation === "()=" ? value => value :
        annotation === "const" ? value => value :
        annotation === "const()" ? value => value :
        annotation === "where" ? value => value :
        fail.syntax(`Unrecgonized type annotation: "${annotation}"`));

const TypeDefinitionSymbol = Symbol("@reified/type/type-definition");

const toMethodDescriptor = value => [value.binding, { value, ...value }];

const S = SymbolEnum("Constructors", "Definition", "DefaultConstructor");

const Constructor = (T, definition) => Ø
({
    [Ø.Call]: (C, _, [source = { }]) => Ø
    ({
        [Ø.Prototype]: C.prototype,

        ...I `Object.getOwnPropertyDescriptors`(definition
            .fields [I `::Array.prototype.reduce`] (
                (values, field) => I `Object.assign` (values,
                {
                    [field.binding]: extract(field, source, values)
                }), ø()))
    }),

    [S.definition]: definition,

    name: { value: definition.binding },
    binding: { value: definition.binding },

    prototype: { value: I `Object.create` (T.prototype) }
});

module.exports = Ø
({
    name: { value: "type" },

    [Ø.Call]: (type, _, args) => given((
        // FIXME: && args[0] instanceof TypeDefinition
        IsTypeDefinition = args =>
            args.length === 2 &&
            args[0] === TypeDefinitionSymbol,

        IsTypeDataDeclaration = args => IsTaggedCall(args),

        FromTypeDefinition =
        ({
            binding,
            hasInstance = false,
            constructors = [],
            methods = [],
            functions = [],
            extending = I `Object`
        }) => Ø
        ({
            [Ø.Call]: (T, thisArg, args) =>
                IsAnnotation(args) ?
                    annotate(args) :
                T[S.DefaultConstructor] ?
                    T[S.DefaultConstructor](...args) :
                T[S.Constructors].length <= 0 ?
                    fail.type(`${binding} is only a type, not a constructor.`) :
                    fail.type(
                        `${binding} has no default constructor, ` +
                        `use on of it's named constructors instead:\n` +
                            constructors
                                [I `::Array.prototype.map`]
                                    (({ binding }) => `    ${binding}`)
                                [ I `::Array.prototype.join`] (`\n`)),

            [Ø.Prototype]: type.prototype,

            [S.Constructors]: T =>
            ({
                value: constructors
                    [I `::Array.prototype.map`]
                        (definition => Constructor(T, definition))
            }),

            [S.DefaultConstructor]: T => given((
                defaultConstructor = T[S.Constructors]
                    [I `::Array.prototype.find`]
                        (constructor => binding === constructor.binding)) =>
                ({ value: defaultConstructor || false })),

            [Ø `...`]: ({ [S.Constructors]: constructors }) =>
                ø(constructors [I `::Array.prototype.map`]
                        (value => [value.binding, { value, enumerable: true }])),

            name: { value: binding },
            binding: { value: binding },

            [I `Symbol.hasInstance`]: hasInstance && { value: hasInstance },

            prototype:
            {
                value: I `Object.create` (extending.prototype, methods
                    [I `::Array.prototype.map`] (toMethodDescriptor))
            },

            ...I `Object.fromEntries` (functions
                [I `::Array.prototype.map`] (toMethodDescriptor))
        })) =>

            IsTypeDefinition(args) ? FromTypeDefinition(args[1]) :

            IsTypeDataDeclaration(args) ? type(TypeDefinitionSymbol,
            {
                binding: ToResolvedString(args),
                constructors: [
                {
                    binding:"Cheese",
                    fields: [{ type: type.string, binding: "a" }]
                }]
            }) :

            fail.syntax (`Improper type declaration`)),

    ...I `Object.fromEntries`
    ([
        ["undefined", IsUndefined],
        ["null", IsNull],
        ["boolean", IsBoolean],
        ["string", IsString],
        ["symbol", IsSymbol],
        ["number", IsNumber],
        ["bigint", IsBigInt],
        ["object", IsObject]
    ]
        [I `::Array.prototype.map`] (([binding, hasInstance]) =>
        [
            binding,
            type =>
            ({
                value: type(TypeDefinitionSymbol, { binding, hasInstance }),
                enumerable: true
            })
        ])),

    check:
    {
        value: (T, value, reference) =>
            !IsTypeOrConstructor(T) ?
                mismatch(type, T, "type.check") :
            !(value instanceof T) ?
                mismatch(T, value, reference) :
                value
    }
});

const extract = ({ type: T, binding, value }, source, values) =>
    HasOwnProperty(source, binding) ?
        type.check(T, source[binding], `in field ${binding}`) :
        fail.type (`No value was provided for required field "${binding}".`);

// const toConstructor = ConstructorDefinition => Constuctor;

// type `TypeDefinition` ({ })
// type `TypeDefinition` ({ })