const given = f => f();

const I = require("@reified/intrinsics");
const { IsString } = require("./types-and-values");
const { ƒnamed, IsTaggedCall, ToResolvedString } = require("./function-objects");


module.exports = given ((
    Declaration = ({ name, tail: [declare, ...sources] }) => given((
        parse = (name, ...tail) => declare({ name, tail })) =>
        I `Object.assign` (ƒnamed(name, function (...headArguments)
        {
            return  IsTaggedCall(headArguments) ?
                    (...tailArguments) =>
                        parse(ToResolvedString(headArguments), ...tailArguments) :
                    IsString(headArguments[0]) ?
                        parse(...headArguments) :
                        parse(false, ...headArguments)
        }), ...sources))) =>
        Declaration({ name: "Declaration", tail: [Declaration] }));
