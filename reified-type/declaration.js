const given = f => f();

const { I, IsString } = require("@reified/ecma-262");
const { α } = require("@reified/object");
const
{
    ƒnamed,
    ƒextending,
    IsTaggedCall,
    ToResolvedString
} = require("@reified/core/function-objects");


const DeclarationTail = ƒextending(I.Function, "DeclarationTail",
    function (name, f)
    {
        f.binding = name;

        return I `Object.setPrototypeOf` (f, DeclarationTail.prototype);
    });

const Declaration = given ((
    Declaration = ({ binding, tail: [declare, ...sources] }) => given((
        parse = (binding, ...tail) =>
            I `Object.setPrototypeOf` (declare({ binding, tail }), T.prototype),
        T = I `Object.assign` (ƒnamed(binding, function (...headArguments)
        {
            return  IsTaggedCall(headArguments) ?
                    DeclarationTail(
                        ToResolvedString(headArguments),
                        (...tailArguments) =>
                            parse(ToResolvedString(headArguments), ...tailArguments)) :
                    IsString(headArguments[0]) ?
                        parse(...headArguments) :
                        parse(false, ...headArguments)
        }), ...sources)) => T)) =>
            Declaration({ binding: "Declaration", tail: [Declaration] }));

// FIXME: Can we incorporate this into Declaration?
I `Object.setPrototypeOf` (Declaration.prototype, Function.prototype);

module.exports = α(Declaration, { Declaration, Tail: DeclarationTail });
