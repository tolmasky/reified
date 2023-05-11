const given = f => f();

const { HasOwnProperty } = require("@reified/ecma-262");
const fail = require("@reified/core/fail");

const BasicFactory = require("./basic-factory");
const Maybe = require("./basic-maybe");
const Declaration = require("./declaration");


const typecheck = (reference, T, value) => value instanceof T ?
    value :
    fail.type (`Type mismatch in ${reference}:\n`+
        `Expected type: ${T}\n` +
        `But found type: ${typeof value}`);

const toMaybeDefault = (reference, type, rest) =>
    !HasOwnProperty(rest, "default") ?
        Maybe.None :
        Maybe.Just(typecheck(reference, type, rest.default));

const FieldValueDefinition = BasicFactory `FieldValueDefinition`
    (({ type, ...rest }) =>
        ({ type, default: toMaybeDefault("default value", type, rest) }));

exports.FieldValueDefinition = FieldValueDefinition;

FieldValueDefinition.parse = declaration => given((
    resolved = declaration()) =>
    resolved instanceof FieldValueDefinition ?
        resolved :
        FieldValueDefinition({ type: resolved }));


const FieldDeclaration = Declaration `FieldDeclaration`
    (({ binding, body: fieldValueDeclaration }) =>
        ({ binding, fieldValueDeclaration }));

exports.FieldDeclaration = FieldDeclaration;


const FieldDefinition = BasicFactory `FieldDefinition`
    (({ binding, fieldValueDefinition }) =>
        ({ binding, fieldValueDefinition }));

exports.FieldDefinition = FieldDefinition;

FieldDefinition.parse = ({ binding, fieldValueDeclaration }) => FieldDefinition
({
    binding,
    fieldValueDefinition: FieldValueDefinition.parse(fieldValueDeclaration)
});

FieldDefinition.extract = source => fieldDeclaration => given((
    { binding, fieldValueDefinition } = fieldDeclaration,
    { type } = fieldValueDefinition) =>
[
    binding,
    HasOwnProperty(source, binding) ?
        typecheck(`value for field "${binding}"`, type, source[binding]) :
    fieldValueDefinition.default !== Maybe.None ?
        fieldValueDefinition.default :
    fail.type(`No value was provided for required field "${binding}".`)
]);
