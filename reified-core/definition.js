const given = f => f();

const I = require("@reified/intrinsics");
const { IsString } = require("./types-and-values");
const { α } = require("@reified/object");
const { ƒnamed, ƒextending, IsTaggedCall, ToResolvedString } = require("./function-objects");

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


const Definition = Declaration `Definition` (
    ({ name, tail:[instantiate] }) => given((
    definitions = new WeakMap()) =>
[
    ƒnamed(name, function Definition(...argumentsList)
    {
        if (!(this instanceof Definition))
            return new Definition(...argumentsList);

        const properties = instantiate(...argumentsList);

        definitions.set(properties.implementation, this);

        return I `Object.assign` (this, properties);
    }),
    ƒnamed(`Get${name}Of`, implemenation => definitions.get(implemenation))
]));

module.exports = Definition;