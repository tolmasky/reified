const { assign: ObjectAssign } = Object;

const fail = ObjectAssign(
    (first, ...rest) => {
        throw   first instanceof Error ?
                    first :
                typeof first === "function" &&
                first.prototype instanceof Error ?
                    first(...rest) :
                typeof first === "object" ?
                    ObjectAssign(Error(), first) :
                rest.length > 1 ?
                    new (first)(...rest) :
                Error(first); },
    { syntax: message => fail(SyntaxError, message) },
    { type: message => fail(TypeError, message) });

module.exports = fail;
