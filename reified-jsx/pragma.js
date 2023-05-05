const { curry } = require("@reified/function");


module.exports = function JSXPragma(evalInScope)
{
    return function JSXPragma(f, attributes, ...children)
    {
        return curry(
            typeof f === "string" ? evalInScope(f) : f,
            attributes,
            children);
    }
}
