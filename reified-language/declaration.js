const given = f => f();

const ƒnamed = require("./function-named");
const { IsTaggedCall, ToResolvedString } = require("./tagged-templates");

const IsString = value => typeof value === "string";

const Declaration = given ((
    Declaration = ({ name, tail: [declare] }) => given((
        parse = (name, ...tail) => declare({ name, tail })) =>
        ƒnamed(name, (...headArguments) => IsTaggedCall(headArguments) ?
            (...tailArguments) =>
                parse(ToResolvedString(headArguments), ...tailArguments) :
            IsString(headArguments[0]) ?
                parse(...headArguments) :
                parse(false, ...headArguments)))) =>
        Declaration({ name: "Declaration", tail: [Declaration] }));

module.exports = Declaration;
