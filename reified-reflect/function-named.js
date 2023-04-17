const I = require("@reified/intrinsics");


const ƒnamed = (name, f) =>
    name ?
        I `Object.defineProperty` (f, "name", { value: name }) :
        f;

module.exports = ƒnamed;
