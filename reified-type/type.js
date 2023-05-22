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

const toExtendingPrototype = (parent, constructor, ...rest) => Ø
({
    [Ø.Prototype]: parent.prototype,
    constructor: { value: constructor, enumerable: true },
    ...rest
});


const Constructor = (type, T, definition) => Ø
({
    [Ø.Call]: (C, _, [source = { }]) => Ø
    ({
        [Ø.Prototype]: C.prototype,

        ...I `Object.getOwnPropertyDescriptors`(definition
            .fields [I `::Array.prototype.reduce`] (
                (values, field) => I `Object.assign` (values,
                {
                    [field.binding]: extract(type, field, source, values)
                }), ø()))
    }),

    [S.Definition]: { value: definition },

    name: { value: definition.binding },
    binding: { value: definition.binding },

    prototype: C => ({ value: toExtendingPrototype(T, C) })
});

const FIXME_ANY = Object.create(Object.prototype, { binding:{ value: "FIXME_ANY" }, [Symbol.hasInstance]: { value: () => true } });


const check = (T, value, reference) =>(console.log(T),
            false ? //!IsTypeOrConstructor(T) ?
                mismatch(type, T, "type.check") :
            !(value instanceof T) ?
                mismatch(T, value, reference) :
                value);

const extract = (type, { binding, value }, source, values) => given((
    { type: T } = value()) =>
        HasOwnProperty(source, binding) ?
            type.check(T, source[binding], `in field ${binding}`) :
        T === FIXME_ANY ?
            false :
            fail.type (`No value was provided for required field "${binding}".`));


const PrimitiveString = type => I `Object.create` (type.prototype, { [Symbol.hasInstance]: { value: V => typeof V === "string" } });

module.exports = Ø
({
    name: { value: "type" },

    [Ø.Call]: (type, _, args) => given((
        // FIXME: && args[0] instanceof TypeDefinition
        IsTypeDefinition = args =>
            args.length === 2 &&
            args[0] === TypeDefinitionSymbol,

        IsTypeDataDeclaration = args => IsTaggedCall(args),

        FromTypeDefinition = definition => given((
        {
            binding,
            hasInstance = false,
            constructors = [],
            methods = [],
            functions = [],
            extending = I `Object`
        } = definition) => Ø
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
                        `use one of it's named constructors instead:\n` +
                            constructors
                                [I `::Array.prototype.map`]
                                    (({ binding }) => `    ${binding}`)
                                [ I `::Array.prototype.join`] (`\n`)),

            [Ø.Prototype]: type.prototype,

            [S.Definition]: { value: definition },

            [S.Constructors]: T =>
            ({
                value: constructors
                    [I `::Array.prototype.map`]
                        (definition => Constructor(type, T, definition))
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

            prototype: T => toExtendingPrototype(
                extending,
                T,
                ø(methods [I `::Array.prototype.map`] (toMethodDescriptor))),

            ...I `Object.fromEntries` (functions
                [I `::Array.prototype.map`] (toMethodDescriptor))
        }))) =>


            IsTypeDefinition(args) ? FromTypeDefinition(args[1]) :

            args.length === 1 &&
            args[0] instanceof type.Definition ?
                FromTypeDefinition(args[0]) :


            IsTypeDataDeclaration(args) ?
                body => type(type.Definition(
                {
                    binding: ToResolvedString(args),
                    constructors:
                    [type.ConstructorDefinition({
                        binding: ToResolvedString(args),
                        ...body
                    })]
                })) :

            fail.syntax (`Improper type declaration`)),

    type: type => ({ value: type, enumerable: true }),

    Definition: type => ({ value: type(TypeDefinitionSymbol,
    {
        binding: "TypeDefinition",
        constructors:
        [
            {
                binding: "TypeDefinition",
                fields:
                [
                    { binding: "binding", value: () => ({ type: PrimitiveString(type)  }) },
                    { binding: "constructors", value: () => ({ type: Array }) },
                    { binding: "hasInstance", value: () => ({ type: FIXME_ANY }) }
                ]
            }
        ]
    }) }),

    ConstructorDefinition: type => ({ value:
        type(TypeDefinitionSymbol,
        {
            binding: "ConstructorDefinition",
            constructors:
            [
                {
                    binding: "ConstructorDefinition",
                    fields:
                    [
                        { binding: "binding", value: () => ({ type: PrimitiveString(type) }) },
                        { binding: "fields", value: () => ({ type: Array }) }
                    ]
                }
            ]
        })
    }),

    check: type => given((
        IsTypeOrConstructor = T => T instanceof type || IsConstructor(T),

        mismatch = (T, value, reference) => fail.type (
            `Type mismatch${reference ? ` in ${reference}` : ""}:\n` +
            `    Expected: ${toTypeDescription(T)}\n` +
            `    Found: ${value}`),

        // FIXME: We'll want something like [[Description]] here, for Dependent
        // types.
        toTypeDescription = T =>
            T instanceof type ? `instance of type ${T.name}` :
            IsConstructor(T) ? `instance of class ${T.name}` :
            "blah") =>
    ({
        value: (T, value, reference) =>
            T !== FIXME_ANY && !IsTypeOrConstructor(T) ?
                mismatch(type, T, "type.check") :
            !(value instanceof T) ?
                mismatch(T, value, reference) :
                value
    })),

    FieldDefinition: ({ type, ConstructorDefinition }) => ({ value:
        type(type.Definition
        ({
            binding: "FieldDefinition",
            constructors:
            [
                ConstructorDefinition
                ({
                    binding: "FieldDefinition",
                    fields:
                    [
                        { binding: "binding", value: () => ({ type: PrimitiveString(type) }) },
                        { binding: "value", value: () => ({ type: FIXME_ANY }) }
                    ]
                })
            ]
        }))
    }),

    ...I `Object.fromEntries`
    ([
        ["string", IsString],
        ["undefined", IsUndefined],
        ["null", IsNull],
        ["boolean", IsBoolean],
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
                value: type(type.Definition({ binding, hasInstance, constructors:[] })),//TypeDefinitionSymbol, { binding, hasInstance }),
                enumerable: true
            })
        ]))
});


const type = module.exports;

/*
const TypeDefinition = type(TypeDefinitionSymbol,
{
    binding: "TypeDefinition",
    constructors:
    [
        {
            binding: "TypeDefinition",
            fields:
            [
                { binding: "binding", value: () => ({ type: type.string }) },
                { binding: "constructors", value: () => ({ type: Array }) },
                { binding: "hasInstance", value: () => ({ type: FIXME_ANY }) }
            ]
        }
    ]
});*/

/*
const Field = type `Field`
({
    fields:
    [
        { binding: "binding", value: () => type.string },
        { binding: "value", value: () => type.string },
    ]
});*/


// module.exports.TypeDefinition = TypeDefinition;


/*
DataDefinition =
{
    name:           type.string,
    constructors:   [DataConstructorDefinition],
}

DataConstructorDefinition =
{
    name: type.string,
    fields:
    [
        { key: PropertyKey { }, }
    ]
}
// const toConstructor = ConstructorDefinition => Constuctor;

// type `TypeDefinition` ({ })
// type `TypeDefinition` ({ })
*/
