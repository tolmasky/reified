const BindingIdentifier = require("../../grammar/binding-identifier");
const BindingRestElement = require("../../grammar/binding-rest-element");

const toBindingIdentifier = ({ name }) =>
    BindingIdentifier([name]);
const toBindingRestElement = ({ name }) =>
    BindingRestElement([BindingIdentifier([name])]);

const toFormalParameter = toBindingIdentifier;

module.exports = (parameters, optional) =>
({
    required: parameters.map(toFormalParameter),
    optional: optional.map(toFormalParameter)
});
