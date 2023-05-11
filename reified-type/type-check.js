const fail = require("@reified/core/fail");


const check = (T, value, reference) =>
    value instanceof T ?
        value :
        fail.type (`Type mismatch ${reference ? `in ${reference}` : "" }:\n` +
            `Expected type: ${T}\n` +
            `But found type: ${typeof value}`);
            
module.exports = check;
