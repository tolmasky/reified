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

const fail = require("./fail");
const Θ = require("./theta");

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

module.exports = Θ
({
    name: { value: "type" },

    [Θ.Call]: (type, _, args) => given((
        // FIXME: && args[0] instanceof TypeDefinition
        IsTypeDefinition = args =>
            args.length === 2 &&
            args[0] === TypeDefinitionSymbol,
        IsTypeDataDeclaration = args => IsTaggedCall(args),

        FindDefaultConstructor = (binding, constructors) =>
            constructors [I `::Array.prototype.find`]
                (constructor => binding === constructor.binding) ||
            false,

        FromTypeDefinition =
        ({
            binding,
            hasInstance = false,
            constructors = [],
            methods = [],
            functions = [],
            extending = I `Object`
        }) => given((
            defaultConstructor = FindDefaultConstructor(binding, constructors)) => Θ
        ({
            [Θ.Call]: (T, thisArg, args) =>
                IsAnnotation(args) ?
                    annotate(args) :
                defaultConstructor ?
                    defaultConstructor(args) :
                !constructors.length <= 0 ?
                    fail.type(`${binding} is only a type, not a constructor.`) :
                    fail.type(
                        `${binding} has no default constructor, ` +
                        constructors
                            [I `::Array.prototype.map`]
                                (({ binding }) => `    ${binding}`)
                            [ I `::Array.prototype.join`] (`\n`)),

            [Θ.Prototype]: type.prototype,

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
        }))) =>

            IsTypeDefinition(args) ? FromTypeDefinition(args[1]) :

            IsTypeDataDeclaration(args) ? (console.log("hi"),type(TypeDefinitionSymbol,
            {
                binding: "Cheese",
                constructors: [Object.assign(function () { return this }, { binding:"Cheese", enumerable: true })]
            })) :

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
                value: type(TypeDefinitionSymbol, { binding, hasInstance, functions:[Object.assign(function () { return this }, { binding:"self", enumerable: true })] }),
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

// type `TypeDefinition` ({ })
// type `TypeDefinition` ({ })