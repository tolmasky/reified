const given = f => f();

const { IsString } = require("./types-and-values");
const { ƒnamed, IsTaggedCall, ToResolvedString } = require("./function-objects");


module.exports = given ((
    Declaration = ({ name, tail: [declare] }) => given((
        parse = (name, ...tail) => declare({ name, tail })) =>
        ƒnamed(name, function (...headArguments)
        {
            return  IsTaggedCall(headArguments) ?
                    (...tailArguments) =>
                        parse(ToResolvedString(headArguments), ...tailArguments) :
                    IsString(headArguments[0]) ?
                        parse(...headArguments) :
                        parse(false, ...headArguments)
        }))) =>
        Declaration({ name: "Declaration", tail: [Declaration] }));
