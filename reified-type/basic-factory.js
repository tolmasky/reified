const I = require("@reified/ecma-262/intrinsics");
const { ƒnamed } = require("@reified/core/function-objects");

const Declaration = require("./declaration");


module.exports = Declaration `BasicFactory`
    (({ binding, tail: [toProperties] }) =>
        ƒnamed(binding, function F(properties)
        {
            return I `Object.assign` (
                I `Object.create` (F.prototype),
                toProperties(properties));
        }));
