module.exports =
{
    I: require("./intrinsics"),
    Call: require("./intrinsics").Call,

    ...require("./types-and-values"),
    ...require("./type-conversion"),
    ...require("./testing-and-comparison-operations"),
    ...require("./operations-on-objects"),
    ...require("./ordinary-object-internal-methods-and-internal-slots"),
    ...require("./ecmascript-function-objects"),
    ...require("./array-exotic-objects"),
    ...require("./object-objects")
};
