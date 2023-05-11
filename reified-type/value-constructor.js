const given = f => f();

const { Call, I, IsPlainObject } = require("@reified/ecma-262");

const Declaration = require("@reified/core/declaration");
const Definition = require("@reified/core/definition");
const { ƒnamed, ƒextending, IsFunctionObject } = require("@reified/core/function-objects");
const fail = require("@reified/core/fail");

const ValueConstructorSymbols = require("@reified/core/symbol-enum")("apply");

const { ø, α } = require("@reified/object");


const ValueConstructorStaticToPrimitive =
{
    [Symbol.toPrimitive]()
    {
        return GetValueConstructorDefinitionOf(this).symbol;
    }
};

const ValueConstructorConstantInstanceToPrimitive =
{
    [Symbol.toPrimitive]()
    {
        return GetValueConstructorOf(this)[Symbol.toPrimitive]();
    }
};

const instantiate = (C, name, isCallable, properties) => α(
    isCallable ?
        I `Object.setPrototypeOf` (ƒnamed(name, function f(...args)
        {
            return f[ValueConstructorSymbols["apply"]](f, this, args);
        }), C.prototype) :
        I `Object.create` (C.prototype),

    // By default, callable constructors return themselves if you don't
    // supply an explicit function.
    isCallable && { [ValueConstructorSymbols.apply]: self => self },

    properties);

const toConstantValueConstructor = (T, name, isCallable, properties) => given((
    ConstantValueConstructor = α(ƒextending(T, name, function ()
    {
        return instance;
    }), ValueConstructorStaticToPrimitive),
    instance = instantiate(
        ConstantValueConstructor,
        name,
        isCallable,
        α(properties || ø(), ValueConstructorConstantInstanceToPrimitive))) =>
            ConstantValueConstructor);

const toValueConstructor = (T, name, isCallable, constructor) => α(
    ƒextending(T, name, function C(...argumentsList)
    {
        const constructed = constructor(...argumentsList);

        return constructed instanceof T ?
            constructed :
            instantiate(C, name, isCallable, constructed);
    }),
    {
        length: constructor.length,
        toString()
        {
            return constructor.toString();//[I `::Function.prototype.toString`]();
        },
    },
    ValueConstructorStaticToPrimitive);

const ValueConstructorDeclaration = Declaration `ValueConstructor`
    (({ name, tail }) => ({ binding: name, tail }));

exports.ValueConstructorDeclaration = ValueConstructorDeclaration;

const fromParsedConstructorName = given ((
    ValueConstructorNameRegExp = /([^\(]+)(\(\))?$/) =>
    unparsed => given((
        [, name, isCallable] = Call(
            I `String.prototype.match`,
            unparsed,
            ValueConstructorNameRegExp)) =>
            [name, !!isCallable]));

exports.fromParsedConstructorName = fromParsedConstructorName;

const IsRecordDeclaration = given((
    TypeRegExp = /^\s*of\s*\=>/) =>
    declaration =>
        IsPlainObject(declaration) &&
        I `Object.entries` (declaration)
            [I `::Array.prototype.every`] (([key, value]) =>
                IsFunctionObject(value) &&
                TypeRegExp [I `::RegExp.prototype.test`]
                    (value [I `::Function.prototype.toString`]())));

const [ValueConstructorDefinition, GetValueConstructorDefinitionOf] =
    Definition `ValueConstructorDefinition` ((T, declaration) => given((
        [name, isCallable] = fromParsedConstructorName(declaration.binding),
        hasDeclarationTail = !(declaration instanceof Declaration.Tail),
        isRecordDeclaration =
            hasDeclarationTail &&
            IsRecordDeclaration(declaration.tail[0]),
        isConstant =
            !isRecordDeclaration &&
            (!hasDeclarationTail || !IsFunctionObject(declaration.tail[0])),
        toConstructor = isConstant ?
            toConstantValueConstructor :
            toValueConstructor,
        implementation = toConstructor(
            T,
            name,
            isCallable,
            isConstant ?
                hasDeclarationTail && declaration.tail[0] :
            isRecordDeclaration ?
                α(fields => fields, { toString() { return `({ ${Object.keys(declaration.tail[0]).join(", ")} }) => {}` } }) :
                declaration.tail[0])) =>
    ({
        name,
        symbol: Symbol(name),
        isConstant,
        implementation,
        ...(isConstant && { instance: implementation() })
    })));

exports.ValueConstructorDefinition = ValueConstructorDefinition;

exports.GetValueConstructorDefinitionOf = GetValueConstructorDefinitionOf;

const GetValueConstructorOf = value => I `Object.getPrototypeOf` (value).constructor;

exports.GetValueConstructorOf = GetValueConstructorOf;

exports.ValueConstructorSymbols = ValueConstructorSymbols;
