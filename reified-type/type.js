const given = f => f();

const
{
    I,
    IsArray,
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
    GetOwnPropertyDescriptorEntries,
    IsArrayIndex
} = require("@reified/ecma-262");

const { fail, SymbolEnum, ø, Ø, M } = require("@reified/core");

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

const { caseof, IsCaseofPropertyKey } = require("./caseof_");

// Unary constructor

// Do we want to do something for get too?
const IsMethodDeclaration = given((
    // FIXME should we do a real parse here?
    MethodDeclarationRegExp = /^\s*\(?\s*self[,\s\)=]/) =>
    descriptor =>
        !!descriptor.enumerable &&
        HasOwnProperty(descriptor, "value") &&
        IsFunctionObject(descriptor.value) &&
        MethodDeclarationRegExp [I `::RegExp.prototype.test`]
            (descriptor.value [I `::Function.prototype.toString`] ()));

const IsFieldDeclaration = given((
    FieldDeclarationRegExp = /^\s*of\s*=>/) =>
    descriptor =>
        !!descriptor.enumerable &&
        HasOwnProperty(descriptor, "value") &&
        IsFunctionObject(descriptor.value) &&
        FieldDeclarationRegExp [I `::RegExp.prototype.test`]
            (descriptor.value [I `::Function.prototype.toString`] ()));


const toExtendingPrototype = (parent, constructor, ...rest) => Ø
({
    [Ø.Prototype]: parent.prototype,
    constructor: { value: constructor, enumerable: true },

    ...ø(...rest [I `::Array.prototype.map`] (source => ({ [Ø `...`]: source })))
});

const toPrototypeM = M(C => given((
    T = C.oftype()) => Ø
({
    [Ø.Call]: () => fail.type(`${C.binding} is not meant to be called`),

    name: { value: `${T.name}.${C.binding}` },
    binding: { value: C.binding },

    DataConstructor: { value: C, enumerable: true },

    prototype: CC => ({ value: toExtendingPrototype(T, CC,
    {
        [Symbol.iterator]: { value: function * ()
        {
            yield * (C.fields [I `::Array.prototype.map`] (({ binding }) => this[binding]));
        }, enumerable: true }
    }) })
}).prototype));

const construct = type => (C, _, args) => given((
    source = C.hasPositionalFields ? args : args[0]) => Ø
({
    [Ø.Prototype]: toPrototypeM(C),

    ...I `Object.getOwnPropertyDescriptors`(C
        .fields [I `::Array.prototype.reduce`] (
            (values, field) => I `Object.assign` (values,
            {
                [field.binding]: extract(type, field, source, values)
            }), ø()))
}));

const TypeConstruct = given((
    TypeConstructM = M((TC, ...args) => TC.implementation(...args))) =>
        (TC, _, args) => TypeConstructM(TC, ...args));


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

const extract = (type, { binding, value: fValue }, source, values) => given((
    { type: T, ...value } = fValue()) =>
        HasOwnProperty(source, binding) ?
            type.check(T, source[binding], `field ${String(binding)}`) :
        T === FIXME_ANY ?
            false :
        HasOwnProperty(value, "value") ?
            value.value :
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
            statics = [],
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
                        (definition =>
                            type.Constructor && definition instanceof type.Constructor ?
                                definition :
                                Constructor(type, T, definition))
            }),

            // FIXME: Replace S.DefaultConstructor with DefaultCall to allow for statics.
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

            prototype: T => ({ value:
                toExtendingPrototype(
                    extending,
                    T,
                    ø(methods [I `::Array.prototype.map`] (([key, { value, ...descriptor }]) =>
                        [key, { ...descriptor, value: function(...args) { return value(this, ...args); } }])))
            }),

            [Ø `...`]: ø(statics)
        }))) =>


            IsTypeDefinition(args) ? FromTypeDefinition(args[1]) :

            args.length === 1 &&
            args[0] instanceof type.Definition ?
                FromTypeDefinition(args[0]) :

            IsString(args[0]) ?
                IsFunctionObject(args[1]) ?
                    type.TypeConstructor({ name: args[0] , implementation: args[1] }) : given((
                name = args[0],
                body = args[1],
                grouped = GetOwnPropertyDescriptorEntries (body)
                    [I `::Array.prototype.group`] (([key, descriptor]) =>
                        IsCaseofPropertyKey(key) ? "caseofs" :
                        IsFieldDeclaration(descriptor) ? "fields" :
                        IsMethodDeclaration(descriptor) ? "methods" :
                        "statics"),
                caseofs = grouped.caseofs ?
                    grouped.caseofs
                        [I `::Array.prototype.map`] (([key, descriptor]) =>
                        [
                            caseof(key).name,
                            GetOwnPropertyDescriptorEntries(descriptor.value)
                                [I `::Array.prototype.filter`]
                                    (([, descriptor]) => IsFieldDeclaration(descriptor))
                        ]) :
                    [[name, grouped.fields || []]],
                methods = grouped.methods || [],
                statics = [...(grouped.statics || []), ...methods],
                T = type(TypeDefinitionSymbol,
                {
                    binding: name,
                    hasInstance: false,
                    constructors: caseofs
                        [I `::Array.prototype.map`] (([name, entries]) => type.Constructor
                        ({
                            name,
                            binding: name,
                            symbol: Symbol(name),
                            hasPositionalFields: entries
                                [I `::Array.prototype.every`] (([key]) => IsArrayIndex(key)),
                            fields: entries
                                [I `::Array.prototype.map`] (([key, descriptor]) =>
                                    type.Field_({ binding: key, value: () => ({ type: descriptor.value() }) })),
                            oftype: () => T
                        })),
                    methods,
                    statics
                })) => T) :

            IsTypeDataDeclaration(args) ?
                body => type(ToResolvedString(args), body) :

            fail.syntax (`Improper type declaration ${console.log(args)}`)),

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

    Constructor: ({ type }) => ({ value:
        type(TypeDefinitionSymbol,
        {
            binding: "Constructor",
            constructors:
            [
                {
                    binding: "Constructor",
                    fields:
                    [
                        { binding: "binding", value: () => ({ type: FIXME_ANY }) },
                        { binding: "name", value: () => ({ type: FIXME_ANY }) },
                        { binding: "symbol", value: () => ({ type: FIXME_ANY }) },
                        { binding: "hasPositionalFields", value: () => ({ type: FIXME_ANY }) },
                        { binding: "fields", value: () => ({ type: Array }) },
                        { binding: "oftype", value: () => ({ type: Function }) },
                        { binding: Ø.Call, value: () =>
                        ({
                            type: Function,
                            value: construct(type)
                        }) }
                    ]
                }
            ],
            methods:
            [
                [Symbol.toPrimitive, { value: self => self.symbol }]
            ]
        })
    }),

    Field_: ({ type }) => ({ value: given((T = type(TypeDefinitionSymbol,
    {
        binding: "Field",
        constructors:
        [
            type.Constructor
            ({
                binding: "Field",
                fields:
                [
                    { binding: "binding", value: () => ({ type: type.string }) },
                    { binding: "value",  value: () => ({ type: FIXME_ANY }) }
                ],
                oftype: () => T
            })
        ]
    })) => T) }),

    /*
    FieldValue: ({ type }) => ({ value: given((T = type(TypeDefinitionSymbol,
    {
        binding: "Field.Value.Constant",
        constructors:
        [
            type.Constructor
            ({
                binding: "Field.Value.Constant",
                fields:
                [
                    { binding: "binding", value: () => ({ type: type.string }) },
                    { binding: "value",  value: () => ({ type: FIXME_ANY }) }
                ],
                oftype: () => T
            })
        ]
    })) => T) }),

    /*({ value: type("Field",
    {
        binding :of => type.string,//PrimitiveString(type),
        value   :of => FIXME_ANY
    }) }),*/

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
        ])),

    TypeConstructor: ({ type }) => ({ value:(console.log("IT IS[[:",type.string),
        type(TypeDefinitionSymbol,
        {
            binding: "TypeConstructor",
            constructors:
            [
                {
                    binding: "TypeConstructor",
                    fields:
                    [
                        { binding: "name", value: () => ({ type: type.string }) },
                        { binding: "implementation", value: () => ({ type: Function }) },
                        { binding: Ø.Call, value: () =>
                        ({
                            type: Function,
                            value: TypeConstruct
                        }) }
                    ]
                }
            ]
        }))
    }),

    caseof: { value: caseof, enumerable: true },

    PropertyKey: type => ({ value: type `PropertyKey`
    ({
        [caseof `Name`]: [of => type.string],
        [caseof `Symbol`]: [of => type.symbol]
    }), enumerable: true }),

    Field: type => ({ value: type `Field` (T => type `Field<${T.name}>`
    ({
        key     :of => type.PropertyKey,
        type    :of => type,
        value   :of => T
    })), enumerable: true }),

    Maybe: type => ({ value: require("./maybe")(type), enumerable: true })

/*
    Initializer: ({ type }) => ({ value:
        type(`Initializer`,
        {
            // Ideally we have this be dependently typed...
            [caseof `Static`]:
            {
                type    :of => type,
                value   :of => FIXME_ANY
            },

            [caseof `Computed`]:
            {
                type    :of => type,
                value   :of => Function
            }
        }) }),

    Value: ({ type }) => ({ value:
        type(`Field.Value`,
        {
            [caseof `Variable`]:
            {
                initializer :of => Maybe(Initializer)
            },

            [caseof `Constant`]:
            {
                initializer :of => Initializer
            }
        })
    })*/
});

/*
IDEA:

We *could* combine Constructor and ConstructorDefinition (and possibly Type and
 TypeDefinition), but it would require deferring the creation of the Constructor
since we usally don't have T available at time of instantiating C:

    Constructor: ({ type }) => ({ value:
        type(TypeDefinitionSymbol,
        {
            binding: "Constructor",
            constructors:
            [
                {
                    binding: "Constructor",
                    fields:
                    [
                        { binding: "binding", value: () => ({ type: FIXME_ANY }) },
                        { binding: "fields", value: () => ({ type: Array }) },
                        { binding: Ø.Call, value: () => ({ type: Function }) }
                    ]
                }
            ]
        })
    }),

This has the interesting side effect of making Type and Constructor also objects
from our system though... and unifies the idea of constructors and definition.constructors...

type.construct = (type, T, C) => Ø
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
    })
});

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
