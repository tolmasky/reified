const given = f => f();

const { I } = require("@reified/ecma-262");
const { ƒnamed } = require("@reified/core/function-objects");

const Declaration = require("./declaration");

const DataProperty = (value, enumerable = false) => ({ value, enumerable });


module.exports = Declaration `Rudimentary` (({ binding, body }) => given((
    fields = I `Object.entries` (body)) =>
    ƒnamed(binding, function R(properties)
    {
        return I `Object.create` (R.prototype,
            I `Object.fromEntries` (fields
                [I `::Array.prototype.map`]
                    (([key]) => [key, DataProperty(body[key], true)])));
    })));
    /*


const FieldValueDefinition = BasicFactory `FieldValueDefinition`
    (() => fail.type("Not meant to be direcyly instantiated!"))
    

FieldValueDefinition.Variable = BasicFactory ``

        FieldValueDefinition.Variable |
        FieldValueDefinition.Constant |
        FieldValueDefinition.Computed
*/