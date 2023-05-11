const given = f => f();

const { I, HasOwnProperty, IsString } = require("@reified/ecma-262");
const { ƒextending } = require("@reified/core/function-objects");

const Declaration = require("./declaration");
const typecheck = require("./type-check");

const Symbols = { extending: Symbol("extending") };


const toDataProperty = ({ binding, type }, location, source) =>
    !HasOwnProperty(source, binding) ?
        fail.type(
            `No value was provided for required field "${binding}" in ` +
            `${reference}.`) :
        ({
            value: typecheck(
                type,
                source[binding],
                `value for field "${binding}" in ${location}`),
            enumerable: true
        });

const Rudimentary = Declaration `Rudimentary` (({ binding, body }) => given((
    { [Symbols.extending]: extending = I `Object`, ...rest } = body,
    fields = I `Object.entries` (rest)
        [I `::Array.prototype.map`]
            (([binding, type]) => ({ type, binding }))) =>
    ƒextending(extending, binding, function R(properties)
    {
        return I `Object.create` (R.prototype,
            I `Object.fromEntries` (fields
                [I `::Array.prototype.map`] (field =>
                [
                    field.binding,
                    toDataProperty(field, binding, properties)
                ])));
    })));

module.exports = I `Object.assign` (Rudimentary, { Rudimentary }, Symbols);

Rudimentary.any = { [Symbol.hasInstance]: () => true };

Rudimentary.string = { [Symbol.hasInstance]: V => IsString(V) };


    /*


const FieldValueDefinition = BasicFactory `FieldValueDefinition`
    (() => fail.type("Not meant to be direcyly instantiated!"))
    

FieldValueDefinition.Variable = BasicFactory ``

        FieldValueDefinition.Variable |
        FieldValueDefinition.Constant |
        FieldValueDefinition.Computed
*/