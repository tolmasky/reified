
//const { Error } = require("@reified/intrinsics");
const Δ = require("@reified/delta");


// FIXME: Allow exitCode to be an object too?
module.exports = function ExitCodeError (exitCode, properties)
{
    const error = Δ(Error(`Process exited with status: ${exitCode}`),
    {        
        [Δ.prototype]: ExitCodeError.prototype,

        exitCode,
        ...properties
    });

//    Object.setPrototypeOf(error, ExitCodeError.prototype);
    
    return error;
}

module.exports.prototype = { };

Object.setPrototypeOf(module.exports.prototype, Error.prototype);

/*
module.exports = function NewError(code)
{
    const error = Object.assign(Error("hello"), { code });

    Object.setPrototypeOf(error, NewError.prototype);

    return error;
}

Object.setPrototypeOf(module.exports.prototype, Error.prototype);

*/