const I = require("@reified/intrinsics");


const ƒnamed = (name, f) =>
    I `Object.defineProperty` (f, "name", { value: name });

module.exports = ƒnamed;
