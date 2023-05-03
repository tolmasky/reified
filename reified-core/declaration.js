const given = f => f();

const { I, IsString } = require("@reified/ecma-262");
const { α } = require("@reified/object");
const
{
    ƒnamed,
    ƒextending,
    IsTaggedCall,
    ToResolvedString
} = require("./function-objects");


const DeclarationTail = ƒextending(I.Function, "DeclarationTail",
    function (name, f)
    {
        f.binding = name;

        return I `Object.setPrototypeOf` (f, DeclarationTail.prototype);
    });

const Declaration = given ((
    Declaration = ({ name, tail: [declare, ...sources] }) => given((
        parse = (name, ...tail) => declare({ name, tail })) =>
        I `Object.assign` (ƒnamed(name, function (...headArguments)
        {
            return  IsTaggedCall(headArguments) ?
                    DeclarationTail(
                        ToResolvedString(headArguments),
                        (...tailArguments) =>
                            parse(ToResolvedString(headArguments), ...tailArguments)) :
                    IsString(headArguments[0]) ?
                        parse(...headArguments) :
                        parse(false, ...headArguments)
        }), ...sources))) =>
        Declaration({ name: "Declaration", tail: [Declaration] }));

module.exports = α(Declaration, { Declaration, Tail: DeclarationTail });
