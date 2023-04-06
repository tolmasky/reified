const I = require("@reified/intrinsics");


module.exports =
{
    of: value =>
        value === null ? "null" :
        I.Array.isArray(value) ? "array" :
        typeof value
};
