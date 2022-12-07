const given = f => f();

const { toTableCellTextContentRows } = require("./x-path");
const fromSpecification = require("./from-specification");


module.exports = require("./from-specification") `well-known-symbols`
    (document =>
        toTableCellTextContentRows("table-well-known-symbols", document)
            .map(([name, description, documentation]) => 
            ({
                name,
                ["[[Description]]"]: description.replace(/^\*"|"\*$/g, ""),
                description: documentation,
                reference: "table-well-known-symbols"
            })));
