const { I }  = require("@reified/ecma-262");


function Maybe() { };

module.exports = I `Object.assign` (Maybe,
{
    Just: value => I `Object.assign` (I `Object.create` (Maybe.prototype), { value }),
    None: I `Object.create` (Maybe.prototype)
});
