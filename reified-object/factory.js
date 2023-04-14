const given = f => f();

const I = require("@reified/intrinsics");
const ƒnamed = require("@reified/language/function-named");
const Declaration = require("@reified/language/declaration");
const { ø, α } = require("./reified-object");


const Factory = Declaration `Factory` (({ name, tail }) => given((
    [TemplateConstructor, ...rest] = tail,
    { constructor: superclass } =
        I `Object.getPrototypeOf` (TemplateConstructor.prototype), 
    Factory = ƒnamed(name, function Error(...args)
    {
        return Reflect.construct(TemplateConstructor, args, Factory);
    }), 
    prototype = α(
        I `Object.setPrototypeOf`
            (Factory.prototype, superclass.prototype),
        TemplateConstructor.prototype,
        { constructor: Factory },
        ...rest)) => Factory));



module.exports = α(Factory,
{
    ErrorFactory: Declaration `ErrorFactory`
        (({ name, tail }) => Factory `${name}`
        (...tail, { get name() { return name } }))
});
    