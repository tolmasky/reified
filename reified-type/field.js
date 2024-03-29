const given = f => f();

const { I, HasOwnProperty, IsFunctionObject } = require("@reified/ecma-262");


exports.IsFieldDeclaration = given((
    FieldDeclarationRegExp = /^\s*of\s*=>/) =>
    descriptor =>
        !!descriptor.enumerable &&
        HasOwnProperty(descriptor, "value") &&
        IsFunctionObject(descriptor.value) &&
        FieldDeclarationRegExp [I `::RegExp.prototype.test`]
            (descriptor.value [I `::Function.prototype.toString`] ()));

exports.Field = ({ type, caseof }) => given((
    Field = type `Field`
    ({
        key :of => Field.Key,

        Key: type `Field.Key`
        ({
            [caseof `String`]: [of => type.string],
            [caseof `Symbol`]: [of => type.symbol]
        }),
    }),

    IsFieldDeclaration = given((
        FieldDeclarationRegExp = /^\s*of\s*=>/) =>
        descriptor =>
            !!descriptor.enumerable &&
            HasOwnProperty(descriptor, "value") &&
            IsFunctionObject(descriptor.value) &&
            FieldDeclarationRegExp [I `::RegExp.prototype.test`]
                (descriptor.value [I `::Function.prototype.toString`] ()))) =>
({
    Field: { value: Field, enumerable: true },
}));
