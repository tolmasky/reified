const BindingIdentifier = require("../../grammar/binding-identifier");
const BindingRestElement = require("../../grammar/binding-rest-element");

const toBindingIdentifier = ({ name }) =>
    BindingIdentifier([name.replace(/^_|_$/g, "")]);
const toBindingRestElement = parameter =>
    BindingRestElement([toBindingIdentifier(parameter)]);

const toFormalParameter = toBindingIdentifier;

module.exports = ({ params, optionalParams }) =>
({
    required: params.map(toFormalParameter),
    optional: optionalParams.map(toFormalParameter)
});
