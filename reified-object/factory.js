const given = f => f();

const I = require("@reified/intrinsics");
const ƒnamed = require("@reified/language/function-named");
const Declaration = require("@reified/language/declaration");
const { ø, α } = require("./reified-object");

const SymbolEnum = require("@reified/object/symbol-enum");

const S = SymbolEnum("construct");


// We should do something meaningful when the tail is classes,
// namely, copy down through prototype, not prototype.
const Factory = Declaration `Factory` (({ name, tail }) => given((
    [TemplateConstructor, ...rest] = tail,
    { constructor: superclass } =
        I `Object.getPrototypeOf` (TemplateConstructor.prototype), 
    Factory = ƒnamed(name, function (...args)
    {
        const construct =
            Factory.prototype[S.construct] ||
            Reflect.construct;

        return construct(TemplateConstructor, args, Factory);
    }),
    prototype = α(
        I `Object.setPrototypeOf`
            (Factory.prototype, superclass.prototype),
        TemplateConstructor.prototype,
        { constructor: Factory },
        ...rest)) => Factory));



module.exports = α(Factory,
{
    ...S,

    ErrorFactory: Declaration `ErrorFactory`
        (({ name, tail }) => Factory `${name}`
        (...tail, { get name() { return name } })),

    FunctionFactory: Declaration `FunctionFactory`
        (({ name, tail }) => Factory(name, ...tail,
        {
            [S.construct](_, args, FunctionFactory)
            {
                const implementation = args[0];
                const instance = ƒnamed(implementation.name, function (...args)
                {
                    return implementation(...args);
                });

                I `Object.setPrototypeOf` (instance, FunctionFactory.prototype);

                return instance;
            }
        }))
});
    