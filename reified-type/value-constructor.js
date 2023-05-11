const given = f => f();

const { I } = require("@reified/ecma-262");

const Declaration = require("./declaration");
const { FieldDeclaration } = require("./field");


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
