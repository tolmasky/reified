const given = f => f();

const fail = require("@reified/fail");
const { Call, I } = require("@reified/intrinsics");
const Declaration = require("./declaration");
const Definition = require("./definition");
const { ƒnamed, ƒextending, IsFunctionObject } = require("./function-objects");
const ValueConstructorSymbols = require("./symbol-enum")("apply");

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
    }), ValueConstructorStaticToPrimitive);

const ValueConstructorDeclaration = Declaration `ValueConstructor`
    (({ name, tail }) => ({ binding: name, tail }));

exports.ValueConstructorDeclaration = ValueConstructorDeclaration;

const parse = given ((
    ValueConstructorNameRegExp = /([^\(]+)(\(\))?$/) =>
    unparsed => given((
        [, name, isCallable] = Call(
            I `String.prototype.match`,
            unparsed,
            ValueConstructorNameRegExp)) =>
            [name, !!isCallable]));

const [ValueConstructorDefinition, GetValueConstructorDefinitionOf] =
    Definition `ValueConstructorDefinition` ((T, declaration) => given((
        [name, isCallable] = parse(declaration.binding),
        hasDeclarationTail = !(declaration instanceof Declaration.Tail),
        isConstant =
            !hasDeclarationTail ||
            !IsFunctionObject(declaration.tail[0]),
        implementation = isConstant ?
            toConstantValueConstructor(
                T,
                name,
                isCallable,
                hasDeclarationTail && declaration.tail[0]) :
            toValueConstructor(T, name, isCallable, declaration.tail[0])) =>
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
