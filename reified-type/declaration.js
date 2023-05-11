const given = f => f();

const { I, IsPropertyKey } = require("@reified/ecma-262");
const { α } = require("@reified/object");
const
{
    ƒnamed,
    ƒextending,
    IsTaggedCall,
    ToResolvedString
} = require("@reified/core/function-objects");


const DeclarationBody = ƒextending(I.Function, "DeclarationBody",
    function (name, f)
    {
        f.binding = name;

        return I `Object.setPrototypeOf` (f, DeclarationBody.prototype);
    });

const Declaration = given ((
    Declaration = ({ binding, body: declare }) => given((
        parse = (binding, body) =>
            I `Object.setPrototypeOf` (declare({ binding, body }), T.prototype),
        T = ƒnamed(binding, function (...headArguments)
        {
            return  IsTaggedCall(headArguments) ?
                    DeclarationBody(
                        ToResolvedString(headArguments),
                        body => parse(ToResolvedString(headArguments), body)) :
                    IsPropertyKey(headArguments[0]) ?
                        parse(...headArguments) :
                        parse(false, ...headArguments)
        })) => T)) =>
            Declaration({ binding: "Declaration", body: Declaration }));

// FIXME: Can we incorporate this into Declaration?
I `Object.setPrototypeOf` (Declaration.prototype, Function.prototype);

module.exports = α(Declaration, { Declaration, Body: DeclarationBody });
