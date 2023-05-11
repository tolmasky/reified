const { HasOwnProperty } = require("@reified/ecma-262");
const fail = require("@reified/core/fail");

const BasicFactory = require("./basic-factory");
const Maybe = require("./basic-maybe");


const toMaybeDefault = (type, rest) =>
    !HasOwnProperty(rest, "default") ?
        Maybe.None :
    rest.default instanceof type ?
        Maybe.Just(rest.default) :
        fail.type (`Default value of ${rest.default} is not of type ${type}`);

const FieldValueDefinition = BasicFactory `FieldValueDefinition`
    (({ type, ...rest }) =>
        ({ type, default: toMaybeDefault(type, rest) }));

exports.FieldValueDefinition = FieldValueDefinition;

/*
const FieldDeclaration = BasicFactory `FieldDeclaration`
    (({ binding, fieldValueDeclaration }) =>
        ({ binding, fieldValueDeclaration }));

exports.FieldDeclaration = FieldDeclaration;

const FieldDefinition = BasicFactory `FieldDefinition`
    (({ binding, fieldValueDefinition }) =>
         ({ binding, fieldValueDefinition }));

FieldDefinition.parse = declaration => FieldDefinition
({
    binding: declaration.binding,
    fieldValueDefinition: FieldValueDefinition.parse(declaration.fieldValueDeclaration)
});



FieldDefinition.parse = declaration => FieldDefinition
({
    binding: declaration.binding,
    fieldValueDefinition: FieldValueDefinition.parse(declaration.fieldValueDeclaration)
});
    
FieldDefinition.extract = source => field => given((
    value = source[field.binding],
    type = field.fieldValueDefinition.type) =>
    !satisfies(type, value) ?
        fail(`Expected type ${type}, but instead found ${typeof value}`) :
        [field.binding, value]);
*/