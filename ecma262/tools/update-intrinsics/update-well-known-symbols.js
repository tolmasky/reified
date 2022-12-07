const given = f => f();

const
{
    mkdirSync: mkdir,
    readFileSync: read,
    writeFileSync: write
} = require("fs");
const { dirname, join } = require("path");
const writep = (filename, ...rest) => mkdirp(dirname(filename), ...rest);
const mkdirp = filename => (mkdir(filename, { recursive: true }), filename);

const { JSDOM } = require("jsdom");

const downloadSpecification = require("../download-specification");
const { toTableCellTextContentRows } = require("./xpath");

const toDestination = tag =>
    join(__dirname, "..", "..", tag, "well-known-symbols.json");


// constructor
// non-objects like "length"?
// ToProperty(V) -> P
// we need get AND set for __proto__
// Should the signature be more like x.{get}y?
module.exports = async function
({
    tag = "es2022"
}, destination = toDestination(tag))
{
    const specificationLocation = await downloadSpecification({ tag });
    const specification = read(specificationLocation, "utf-8");

    const { window: { document } } = new JSDOM(specification);

    const WellKnownSymbols =
        toTableCellTextContentRows("table-well-known-symbols", document)
            .map(([name, description, documentation]) => 
            ({
                name,
                ["[[Description]]"]: description.replace(/^\*"|"\*$/g, ""),
                description: documentation,
                reference: "table-well-known-symbols"
            }));

    mkdirp(dirname(destination));
    write(destination, JSON.stringify(WellKnownSymbols, null, 2), "utf-8");
}
