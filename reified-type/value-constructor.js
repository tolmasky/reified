const given = f => f();

const { I } = require("@reified/ecma-262");
const { ƒnamed } = require("@reified/core/function-objects");

const BasicFactory = require("./basic-factory");
const Declaration = require("./declaration");
const { FieldDeclaration, FieldDefinition } = require("./field");


const ValueConstructorDeclaration = Declaration `ValueConstructorDeclaration`
    (({ binding, body }) =>
({
    binding,
    fieldDeclarations: I `Object.entries`
        (I `Object.getOwnPropertyDescriptors`(body))
            [I `::Array.prototype.map`] (([binding, descriptor]) =>
                FieldDeclaration(binding,  descriptor.value))
}));

exports.ValueConstructorDeclaration = ValueConstructorDeclaration;


const toFieldDefinitionsGetter = given((
    fieldDefinitions = new I.WeakMap()) =>
        fFieldDefinitions => () => (
        !(fieldDefinitions [I `::WeakMap.prototype.has`] (fFieldDefinitions)) &&
        fieldDefinitions [I `::WeakMap.prototype.set`] (
            fFieldDefinitions,
            I `Array.from` (
                fFieldDefinitions,
                fFieldDefinition => fFieldDefinition())),
        fieldDefinitions [I `::WeakMap.prototype.get`] (fFieldDefinitions)));

const ValueConstructorDefinition = BasicFactory `ValueConstructorDefinition`
    (({ binding, ...rest }) => given((
        fFieldDefinitions = [...rest.fFieldDefinitions],
        GetFieldDefintions = toFieldDefinitionsGetter(fFieldDefinitions)) =>
({
    binding,
    fFieldDefinitions,
    get fieldDefinitions() { return GetFieldDefintions() },
    // FIXME: { [Symbols.Parameters]: fieldDefinitions }
    implementation: ƒnamed(binding, function C(values)
    {
        return I `Object.assign` (
            I `Object.create` (C.prototype),
            I `Object.fromEntries` (I `Array.from` (
                GetFieldDefintions(),
                FieldDefinition.extract(values))));
    })
})));

ValueConstructorDefinition.parse =
    ({ binding, fieldDeclarations }) => ValueConstructorDefinition
({
    binding,
    fFieldDefinitions: I `Array.from` (
        fieldDeclarations,
        declaration => () => FieldDefinition.parse(declaration))
});

exports.ValueConstructorDefinition = ValueConstructorDefinition;